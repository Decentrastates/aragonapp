import type { IDao } from '@/shared/api/daoService';
import type { IPluginInstallationSetupData } from '@/shared/utils/pluginTransactionUtils';
import type { ICreateAppFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { Hex } from 'viem';

export interface IBuildDrawProposalActionsParams {
    values: ICreateAppFormData;
    dao: IDao;
    setupData: IPluginInstallationSetupData[];
    executeConditionAddress?: Hex;
}

export interface IDrawProposalAction {
    to: Hex;
    data: Hex;
    value: string;
}