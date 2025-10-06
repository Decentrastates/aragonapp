import type { ICreateDrawFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { IDao } from '@/shared/api/daoService';
import type { IPluginInstallationSetupData } from '@/shared/utils/pluginTransactionUtils';
import { type IBuildPreparePluginInstallDataParams } from '../../types';

// 更新 IPrepareDrawMetadata 接口以与其他插件保持一致
export interface IPrepareDrawMetadata {
    /**
     * 所有抽奖插件的元数据CID，按阶段和阶段内主体的顺序排列
     */
    plugins: string[];
    /**
     * 抽奖插件的元数据CID（例如抽奖插件），仅对创建新代币的情况设置
     */
    draw?: string;
}

export interface IBuildDrawTransactionParams {
    /**
     * 创建抽奖表单的值
     */
    values: ICreateDrawFormData;
    /**
     * 抽奖的元数据URI
     */
    drawMetadata: IPrepareDrawMetadata;
    /**
     * 要安装插件的DAO
     */
    dao: IDao;
}

export interface IBuildPrepareInstallPluginActionParams extends Omit<IBuildPreparePluginInstallDataParams, 'metadata'> {
    /**
     * 插件的元数据CID
     */
    metadataCid: string;
}

export interface IBuildDrawProposalActionsParams {
    /**
     * 创建流程表单的值
     */
    values: ICreateDrawFormData;
    /**
     * 要安装插件的DAO
     */
    dao: IDao;
    /**
     * 要安装的插件地址列表
     */
    setupData: IPluginInstallationSetupData[];
}