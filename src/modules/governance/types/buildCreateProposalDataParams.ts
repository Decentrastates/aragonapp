import type { IDaoPlugin, IPluginSettings } from '@/shared/api/daoService';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import type { Hex } from 'viem';
import type { IProposalCreate } from '../dialogs/publishProposalDialog';

export interface IBuildCreateProposalDataParams<
    TProposal extends IProposalCreate = IProposalCreate,
    TSettings extends IPluginSettings = IPluginSettings,
> {
    /**
     * 十六进制格式的提案元数据。
     */
    metadata: Hex;
    /**
     * 要执行的操作。
     */
    actions: ITransactionRequest[];
    /**
     * 在创建提案向导中收集的表单值。
     */
    proposal: TProposal;
    /**
     * 用于创建提案的流程插件。
     */
    plugin: IDaoPlugin<TSettings>;
}