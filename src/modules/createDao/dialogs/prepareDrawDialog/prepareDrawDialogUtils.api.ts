import type { ICreateAppFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { IDao } from '@/shared/api/daoService';
import type { IPluginInstallationSetupData } from '@/shared/utils/pluginTransactionUtils';
import { type IBuildPrepareCommonPluginInstallDataParams } from '../../types';

// 更新 IPrepareDrawMetadata 接口以与其他插件保持一致
export interface IPrepareDrawMetadata {
    /**
     * 所有抽奖插件的元数据CID，按阶段和阶段内主体的顺序排列
     */
    plugins: string[];
}

export interface IBuildDrawTransactionParams {
    /**
     * 创建抽奖表单的值
     */
    values: ICreateAppFormData;
    /**
     * 抽奖的元数据URI
     */
    drawMetadata: IPrepareDrawMetadata;
    /**
     * 要安装插件的DAO
     */
    dao: IDao;
}

export interface IBuildPrepareInstallPluginsActionParams {
    /**
     * Values of the create-draw form.
     */
    values: ICreateAppFormData;
    /**
     * DAO to install the plugins to.
     */
    dao: IDao;
    /**
     * Metadata CID of all the plugins.
     */
    pluginsMetadata: string[];
}

export interface IBuildPrepareInstallPluginActionParams extends Omit<IBuildPrepareCommonPluginInstallDataParams, 'metadata'> {
    /**
     * 插件的元数据CID
     */
    metadataCid: string;
}

export interface IBuildDrawProposalActionsParams {
    /**
     * 创建流程表单的值
     */
    values: ICreateAppFormData;
    /**
     * 要安装插件的DAO
     */
    dao: IDao;
    /**
     * 要安装的插件地址列表
     */
    setupData: IPluginInstallationSetupData[];
}