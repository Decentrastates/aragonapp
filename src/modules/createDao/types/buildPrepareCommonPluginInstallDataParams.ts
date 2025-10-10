// 非治理插件安装
import type { IAppsSetupBodyForm } from '@/modules/createDao/dialogs/setupAppsBodyDialog/setupAppsBodyDialogDefinitions';
import type { IDao } from '@/shared/api/daoService';
import type { Hex } from 'viem';

export interface IBuildPrepareCommonPluginInstallDataParams<TErc20 = unknown, TErc1155 = unknown,TDraw = unknown> {
    /**
     * 安装流程所需的主体表单数据
     */
    body: IAppsSetupBodyForm<TErc20, TErc1155, TDraw>;
    /**
     * 流程的十六进制格式元数据
     */
    metadata: Hex;
    /**
     * 要安装流程的DAO
     */
    dao: IDao;
}
