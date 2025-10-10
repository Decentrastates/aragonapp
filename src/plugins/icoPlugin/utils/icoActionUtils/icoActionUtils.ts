import type { IProposalAction } from '@/modules/governance/api/governanceService';
import { actionComposerUtils } from '@/modules/governance/components/actionComposer';
import type { IActionComposerPluginData } from '@/modules/governance/types';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { TranslationFunction } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils';
import {
    addressUtils,
    ProposalActionType as GukProposalActionType,
    IconType,
    type IProposalActionChangeSettings as IGukProposalActionChangeSettings,
    type IProposalActionTokenMint as IGukProposalActionTokenMint,
} from '@cddao/gov-ui-kit';
import { formatUnits } from 'viem';
import {
    IcoProposalActionType,
    defaultCreateSalesBatch,
    defaultUpdateSettings,
} from './icoActionDefinitions';
import type { IcoPluginSettings } from '../../types/icoTypes';

export interface IGetIcoActionsProps {
    /**
     * DAO plugin data.
     */
    plugin: IDaoPlugin<IcoPluginSettings>;
    /**
     * The translation function for internationalization.
     */
    t: TranslationFunction;
}

export type IGetIcoActionsResult = IActionComposerPluginData<IDaoPlugin<IcoPluginSettings>>;

class IcoActionUtils {
    getIcoActions = ({ plugin, t }: IGetIcoActionsProps): IGetIcoActionsResult => {
        const { address, settings } = plugin;
        const { config } = settings;
        
        // 获取第一个交易对的输出代币作为主要代币
        const primaryToken = config.batches[0]?.tradingPair.outputToken || {
            address: '',
            name: 'Unknown Token',
            symbol: 'UNK',
            decimals: 18,
        };

        return {
            groups: [
                {
                    id: primaryToken.address,
                    name: primaryToken.name,
                    info: addressUtils.truncateAddress(primaryToken.address),
                    indexData: [primaryToken.address],
                },
                {
                    id: address,
                    name: daoUtils.getPluginName(plugin),
                    info: addressUtils.truncateAddress(address),
                    indexData: [address],
                },
            ],
            items: [
                {
                    id: `${address}-${IcoProposalActionType.UPDATE_ICO_SETTINGS}`,
                    name: t(`app.plugins.ico.icoActions.${IcoProposalActionType.UPDATE_ICO_SETTINGS}`),
                    icon: IconType.SETTINGS,
                    groupId: address,
                    defaultValue: defaultUpdateSettings(plugin),
                    meta: plugin,
                },
                {
                    id: `${primaryToken.address}-${IcoProposalActionType.CREATE_SALES_BATCH}`,
                    name: t(`app.plugins.ico.icoActions.${IcoProposalActionType.CREATE_SALES_BATCH}`),
                    icon: IconType.SETTINGS,
                    groupId: primaryToken.address,
                    meta: plugin,
                    defaultValue: defaultCreateSalesBatch(plugin),
                },
                {
                    ...actionComposerUtils.getDefaultActionPluginMetadataItem(plugin, t),
                    meta: plugin,
                    hidden: false,
                },
            ],
            components: {
                // ICO动作组件将在后续实现中添加
            },
        };
    };

    isUpdateSettingsAction = (action: IProposalAction): action is any => {
        return action.type === IcoProposalActionType.UPDATE_ICO_SETTINGS;
    };

    isCreateSalesBatchAction = (action: IProposalAction): action is any => {
        return action.type === IcoProposalActionType.CREATE_SALES_BATCH;
    };
}

export const icoActionUtils = new IcoActionUtils();