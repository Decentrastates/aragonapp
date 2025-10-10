/**
 * ICO插件交易工具类
 * 提供与ICO插件相关的交易数据构建和处理功能
 */
import type { IBuildPrepareCommonPluginInstallDataParams } from '@/modules/createDao/types';
import type { IBuildPreparePluginUpdateDataParams } from '@/modules/settings/types';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import { encodeAbiParameters, zeroAddress, zeroHash, type Hex } from 'viem';
import { icoPlugin } from '../../constants/icoPlugin';
import { icoPluginAbi, icoPluginSetupAbi } from './icoPluginAbi';

/**
 * ICO插件安装数据准备参数接口
 * 扩展了基础插件安装数据准备参数，针对ICO插件特定类型
 */
export interface IPrepareIcoInstallDataParams
    extends IBuildPrepareCommonPluginInstallDataParams<{}, {}, {}> {}

class IcoTransactionUtils {
    /**
     * 构建准备安装插件的交易数据
     * @param params 安装数据准备参数，包含主体、元数据、DAO和阶段投票期信息
     * @returns 编码后的交易数据
     */
    buildPrepareInstallData = (params: IPrepareIcoInstallDataParams) => {
        console.log('=== buildPrepareInstallData START ===');
        console.log('Input params:', JSON.parse(JSON.stringify(params, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value as unknown
        )));

        const { body, metadata, dao } = params;
        // 获取对应网络的仓库地址
        const repositoryAddress = icoPlugin.repositoryAddresses[dao.network];
        
        // 验证仓库地址是否有效
        if (repositoryAddress === zeroAddress) {
            throw new Error(`Invalid repository address for network ${dao.network}`);
        }
        
        console.log('Repository Address:', repositoryAddress);
        console.log('DAO Network:', dao.network);
        console.log('DAO Address:', dao.address);
        
        // 从body对象中提取相关参数
        const governanceToken = zeroAddress; // 默认值，实际应从表单获取
        const fundingRecipient = dao.address as Hex; // 默认资金接收地址为DAO地址
        const metadataHex = transactionUtils.stringToMetadataHex(metadata);
        
        const data = [
            governanceToken,
            fundingRecipient,
            metadataHex,
        ] as const;
        
        console.log('pluginSettingsData Data:', data);

        // 编码插件设置数据
        console.log('About to call encodeAbiParameters with icoPluginSetupAbi:', icoPluginSetupAbi);
        console.log('And data:', data);
        let pluginSettingsData: Hex;
        try {
            pluginSettingsData = encodeAbiParameters(icoPluginSetupAbi, data);
            console.log('encodeAbiParameters result:', pluginSettingsData);
            console.log('pluginSettingsData length:', pluginSettingsData.length);
        } catch (error) {
            console.error('Error in encodeAbiParameters:', error);
            throw error;
        }

        console.log('Build prepare installation data params:', {
            repositoryAddress,
            installVersion: {
                release: icoPlugin.installVersion.release,
                build: icoPlugin.installVersion.build
            },
            pluginSettingsData,
            daoAddress: dao.address
        });

        const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
            repositoryAddress,
            {
                release: icoPlugin.installVersion.release,
                build: icoPlugin.installVersion.build
            },
            pluginSettingsData,
            dao.address as Hex,
        );

        console.log('Final Transaction Data:', transactionData);
        console.log('Final Transaction Data length:', transactionData.length);

        return transactionData;
    };

    // 创建插件更新数据
    buildPrepareUpdateData = (params: IBuildPreparePluginUpdateDataParams): Hex => {
        console.log('=== buildPrepareUpdateData called ===');
        console.log('Params:', params);

        const { plugin, dao } = params;

        const { isSubPlugin, metadataIpfs } = plugin;

        const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, isSubPlugin);
        const metadata = metadataIpfs != null ? transactionUtils.stringToMetadataHex(metadataIpfs) : zeroHash;
        // 注意：ICO插件的更新ABI需要根据实际合约定义进行调整
        const transactionData = encodeAbiParameters(icoPluginSetupAbi, [zeroAddress, zeroAddress, metadata]);

        console.log('Transaction Data:', transactionData);
        console.log('=== buildPrepareUpdateData completed ===');

        return transactionData;
    };
}

export const icoTransactionUtils = new IcoTransactionUtils();