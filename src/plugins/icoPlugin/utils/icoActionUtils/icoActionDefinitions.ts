import type { ITokenActionChangeSettings, ITokenActionTokenMint } from '../../types/icoTypes';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { IcoPluginSettings } from '../../types/icoTypes';

// ICO动作类型枚举
export enum IcoProposalActionType {
    UPDATE_ICO_SETTINGS = 'UPDATE_ICO_SETTINGS',
    CREATE_SALES_BATCH = 'CREATE_SALES_BATCH',
}

// 默认更新设置动作
export const defaultUpdateSettings = (plugin: IDaoPlugin<IcoPluginSettings>): ITokenActionChangeSettings => ({
    type: IcoProposalActionType.UPDATE_ICO_SETTINGS,
    existingSettings: plugin.settings,
    proposedSettings: plugin.settings,
});

// 默认创建销售批次动作
export const defaultCreateSalesBatch = (plugin: IDaoPlugin<IcoPluginSettings>): ITokenActionTokenMint => ({
    type: IcoProposalActionType.CREATE_SALES_BATCH,
    token: plugin.settings.config.batches[0]?.tradingPair.outputToken || {
        address: '',
        name: '',
        symbol: '',
        decimals: 18,
    },
    receivers: {
        address: '',
        currentBalance: '0',
        newBalance: '0',
    },
});