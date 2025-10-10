/**
 * Token插件交易工具类
 * 提供与Token插件相关的交易数据构建和处理功能
 */
import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import type { IProposalCreate } from '@/modules/governance/dialogs/publishProposalDialog';
import type { IBuildCreateProposalDataParams, IBuildVoteDataParams } from '@/modules/governance/types';
import { createProposalUtils, type ICreateProposalEndDateForm } from '@/modules/governance/utils/createProposalUtils';
import type { IBuildPreparePluginUpdateDataParams } from '@/modules/settings/types';
import { dateUtils } from '@/shared/utils/dateUtils';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import { encodeAbiParameters, encodeFunctionData, parseUnits, zeroHash, type Hex } from 'viem';
import type { ITokenSetupGovernanceForm } from '../../components/tokenSetupGovernance';
import type { ITokenSetupMembershipForm, ITokenSetupMembershipMember } from '../../components/tokenSetupMembership';
import { tokenPlugin } from '../../constants/tokenPlugin';
import type { ITokenPluginSettings } from '../../types';
import { tokenSettingsUtils } from '../tokenSettingsUtils';
import { tokenPluginAbi, tokenPluginPrepareUpdateAbi, tokenPluginSetupAbi } from './tokenPluginAbi';

/**
 * Token提案表单数据接口
 * 扩展了基础提案接口，并部分包含结束日期表单数据
 * 结束日期表单值设为"partial"，因为用户也可以不使用提案向导创建提案
 */
export interface ICreateTokenProposalFormData extends IProposalCreate, Partial<ICreateProposalEndDateForm> {}

/**
 * Token插件安装数据准备参数接口
 * 扩展了基础插件安装数据准备参数，针对Token插件特定类型
 */
export interface IPrepareTokenInstallDataParams
    extends IBuildPreparePluginInstallDataParams<
        ITokenSetupGovernanceForm,
        ITokenSetupMembershipMember,
        ITokenSetupMembershipForm
    > {}

/**
 * Token插件交易工具类
 * 提供构建Token插件相关交易数据的各种方法
 */
class TokenTransactionUtils {
    /**
     * 构建创建提案的交易数据
     * @param params 创建提案数据参数，包含元数据、操作、提案和插件信息
     * @returns 编码后的交易数据Hex字符串
     */
    buildCreateProposalData = (
        params: IBuildCreateProposalDataParams<ICreateTokenProposalFormData, ITokenPluginSettings>,
    ): Hex => {
        const { metadata, actions, proposal, plugin } = params;
        const { minDuration } = plugin.settings;

        // 处理没有时间设置的提案：
        //   - 开始日期设为0
        //   - 如果有minDuration，且minDuration大于7天，则结束日期设为minDuration
        //   - 否则，结束日期设为从现在开始的7天
        const startDate = createProposalUtils.parseStartDate(proposal);
        const endDate =
            proposal.endTimeMode != null
                ? createProposalUtils.parseEndDate(proposal)
                : createProposalUtils.createDefaultEndDate(minDuration);

        const data = encodeFunctionData({
            abi: tokenPluginAbi,
            functionName: 'createProposal',
            args: [metadata, actions, BigInt(0), BigInt(startDate), BigInt(endDate), 0, false],
        });

        return data;
    };

    /**
     * 构建投票交易数据
     * @param params 投票数据参数，包含提案索引和投票选项
     * @returns 编码后的交易数据Hex字符串
     */
    buildVoteData = (params: IBuildVoteDataParams): Hex => {
        const { proposalIndex, vote } = params;

        const data = encodeFunctionData({
            abi: tokenPluginAbi,
            functionName: 'vote',
            args: [BigInt(proposalIndex), vote.value, false],
        });

        return data;
    };

    /**
     * 构建准备安装插件的交易数据
     * @param params 安装数据准备参数，包含主体、元数据、DAO和阶段投票期信息
     * @returns 编码后的交易数据
     */
    buildPrepareInstallData = (params: IPrepareTokenInstallDataParams) => {
        const { body, metadata, dao, stageVotingPeriod } = params;
        const { members } = body.membership;

        // 获取对应网络的仓库地址
        const repositoryAddress = tokenPlugin.repositoryAddresses[dao.network];

        // 构建各种设置数据
        const tokenSettings = this.buildInstallDataTokenSettings(body.membership.token);
        const mintSettings = this.buildInstallDataMintSettings(members);
        const votingSettings = this.buildInstallDataVotingSettings(params);
        const tokenTarget = pluginTransactionUtils.getPluginTargetConfig(dao, stageVotingPeriod != null);
        const pluginData = [
            votingSettings,
            tokenSettings,
            mintSettings,
            tokenTarget,
            BigInt(0),
            metadata,
            [],
        ] as const;
        console.log('=== buildPrepareInstallData params ===', pluginData);
        // 编码插件设置数据
        const pluginSettingsData = encodeAbiParameters(tokenPluginSetupAbi, [
            votingSettings,
            tokenSettings,
            mintSettings,
            tokenTarget,
            BigInt(0),
            metadata,
            [],
        ]);

        // 构建准备安装数据
        const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
            repositoryAddress,
            tokenPlugin.installVersion,
            pluginSettingsData,
            dao.address as Hex,
        );

        return transactionData;
    };

    /**
     * 构建准备更新插件的交易数据
     * @param params 更新数据准备参数，包含插件和DAO信息
     * @returns 编码后的交易数据Hex字符串
     */
    buildPrepareUpdateData = (params: IBuildPreparePluginUpdateDataParams): Hex => {
        const { plugin, dao } = params;
        const { isSubPlugin, metadataIpfs } = plugin;

        // 获取目标配置
        const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, isSubPlugin);
        // 处理元数据
        const metadata = metadataIpfs != null ? transactionUtils.stringToMetadataHex(metadataIpfs) : zeroHash;
        // 编码更新数据
        const transactionData = encodeAbiParameters(tokenPluginPrepareUpdateAbi, [BigInt(0), targetConfig, metadata]);

        return transactionData;
    };

    /**
     * 构建安装数据中的代币设置
     * @param token 代币信息对象
     * @returns 格式化的代币设置对象
     */
    private buildInstallDataTokenSettings = (token: ITokenSetupMembershipForm['token']) => {
        const { address, name, symbol } = token;

        return { addr: address as Hex, name, symbol };
    };

    /**
     * 构建安装数据中的代币铸造设置
     * @param members 成员列表
     * @returns 包含接收者地址和数量的铸造设置
     */
    private buildInstallDataMintSettings = (members: ITokenSetupMembershipMember[]) => {
        const initialData: { receivers: Hex[]; amounts: bigint[] } = { receivers: [], amounts: [] };
        const governanceTokenDecimals = 18;

        // 遍历成员列表，构建接收者和数量数组
        const mintSettings = members.reduce(
            (current, { address, tokenAmount }) => ({
                receivers: current.receivers.concat(address as Hex),
                amounts: current.amounts.concat(parseUnits(tokenAmount?.toString() ?? '0', governanceTokenDecimals)),
            }),
            initialData,
        );

        return mintSettings;
    };

    /**
     * 构建安装数据中的投票设置
     * @param params 安装数据准备参数
     * @returns 格式化的投票设置对象
     */
    private buildInstallDataVotingSettings = (params: IPrepareTokenInstallDataParams) => {
        const { body, stageVotingPeriod } = params;

        const { votingMode, supportThreshold, minParticipation, minProposerVotingPower, minDuration } = body.governance;
        const { decimals } = body.membership.token;

        // 将阶段投票期转换为秒
        const stageVotingPeriodSeconds = stageVotingPeriod ? dateUtils.durationToSeconds(stageVotingPeriod) : undefined;

        // 确定最终投票期和提案者投票权
        const processedVotingPeriod = stageVotingPeriodSeconds ?? minDuration;
        const parsedProposerVotingPower = parseUnits(minProposerVotingPower, decimals);

        // 构建投票设置对象
        const votingSettings = {
            votingMode,
            supportThreshold: tokenSettingsUtils.percentageToRatio(supportThreshold),
            minParticipation: tokenSettingsUtils.percentageToRatio(minParticipation),
            minDuration: BigInt(processedVotingPeriod),
            minProposerVotingPower: parsedProposerVotingPower,
        };

        return votingSettings;
    };
}

/**
 * Token交易工具实例
 * 提供Token插件相关交易数据构建的静态访问点
 */
export const tokenTransactionUtils = new TokenTransactionUtils();
