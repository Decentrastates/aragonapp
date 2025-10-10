/**
 * Token插件交易工具类
 * 提供与Token插件相关的交易数据构建和处理功能
 */
import type { IBuildPrepareCommonPluginInstallDataParams } from '@/modules/createDao/types';
// import type { IBuildCreateProposalDataParams } from '@/modules/governance/types';
import type { ICreateProposalEndDateForm } from '@/modules/governance/utils/createProposalUtils/createProposalUtils.api';
import type { IBuildPreparePluginUpdateDataParams } from '@/modules/settings/types';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import { encodeAbiParameters, zeroAddress, zeroHash, type Hex } from 'viem';
import { type IDrawPluginSetupDrawForm } from '../../components/drawPluginSetupDraw';
import { type IDrawPluginSetupERC1155Form } from '../../components/drawPluginSetupERC1155/drawPluginSetupERC1155.api';
import { type IDrawPluginSetupERC20Form } from '../../components/drawPluginSetupERC20';
import { drawPlugin } from '../../constants/drawPlugin';
import { drawPluginPrepareUpdateAbi, drawPluginSetupAbi } from './drawPluginAbi';
import { type IErc1155Combo } from '../../types';

export interface ICreateDrawProposalFormData extends ICreateProposalEndDateForm {
    title: string;
    summary: string;
    resources: Array<{ name: string; url: string }>;
    actions: Array<{ to: string; value: string; data: string }>;
}

/**
 * Token插件安装数据准备参数接口
 * 扩展了基础插件安装数据准备参数，针对Token插件特定类型
 */
export interface IPrepareDrawInstallDataParams
    extends IBuildPrepareCommonPluginInstallDataParams<
        IDrawPluginSetupERC20Form,
        IDrawPluginSetupERC1155Form,
        IDrawPluginSetupDrawForm
    > {}

class DrawTransactionUtils {
    /**
     * 构建准备安装插件的交易数据
     * @param params 安装数据准备参数，包含主体、元数据、DAO和阶段投票期信息
     * @returns 编码后的交易数据
     */
    buildPrepareInstallData = (params: IPrepareDrawInstallDataParams) => {
        const { body, metadata, dao } = params;
        const { erc20, erc1155, draw } = body;
        // 获取对应网络的仓库地址
        const repositoryAddress = drawPlugin.repositoryAddresses[dao.network];
        
        // 构建ERC20设置
        const erc20Setting = {
            tokenAddress: (erc20.address as Hex | undefined) ?? zeroAddress,
        };
        
        // 构建抽奖设置
        const drawSetting = {
            eligibleToken: (draw.eligibleToken as Hex | undefined) ?? zeroAddress,
            minTokenAmount: BigInt(draw.minTokenAmount ?? 0),
            isErc1155Eligible: draw.isErc1155Eligible ?? false,
            eligibleERC1155Id: BigInt(draw.eligibleNftId ?? 0),
            drawInterval: BigInt(draw.drawInterval ?? 0),
        };

        const initNFTCombos = this.buildInstallDataInitNFTCombos(draw.initNFTCombos ?? []);
        
        // 构建ERC1155设置
        const erc1155Setting = {
            tokenAddress: (erc1155.erc1155Address as Hex | undefined) ?? zeroAddress,
            uri: erc1155.erc1155URI ?? '',
        };
        
        // 获取目标配置
        const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, false);
        
        // 构建元数据
        const pluginMetadata = transactionUtils.stringToMetadataHex(metadata);
        
        // 构建插件设置数据
        const data = [
            erc20Setting,
            drawSetting,
            initNFTCombos,
            erc1155Setting,
            targetConfig,
            pluginMetadata,
        ] as const;
        
        const pluginSettingsData = encodeAbiParameters(drawPluginSetupAbi, data);

        const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
            repositoryAddress,
            {
                release: drawPlugin.installVersion.release,
                build: drawPlugin.installVersion.build
            },
            pluginSettingsData,
            dao.address as Hex,
        );

        return transactionData;
    };

    // 创建插件更新数据
    buildPrepareUpdateData = (params: IBuildPreparePluginUpdateDataParams): Hex => {

        const { plugin, dao } = params;

        const { isSubPlugin, metadataIpfs } = plugin;

        const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, isSubPlugin);
        const metadata = metadataIpfs != null ? transactionUtils.stringToMetadataHex(metadataIpfs) : zeroHash;
        const transactionData = encodeAbiParameters(drawPluginPrepareUpdateAbi, [targetConfig, metadata]);
        
        return transactionData;
    };

    private buildInstallDataInitNFTCombos = (initNFTCombos: IErc1155Combo[]) => {
        const combos = Array.isArray(initNFTCombos) ? initNFTCombos : [];

        return combos.map((combo) => ({
            comboId: BigInt(combo.comboId),
            nftUnits: combo.erc1155Units.map((unit) => ({
                id: BigInt(unit.id),
                unit: BigInt(unit.unit),
            })),
            isEnabled: combo.isEnabled,
            maxExchangeCount: BigInt(combo.maxExchangeCount),
            maxSingleBatch: BigInt(combo.maxSingleBatch),
            currentExchangeCount: BigInt(combo.currentExchangeCount),
        }));
    };
}

export const drawTransactionUtils = new DrawTransactionUtils();