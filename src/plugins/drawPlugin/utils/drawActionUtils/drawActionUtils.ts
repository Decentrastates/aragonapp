import type { IProposalAction } from '@/modules/governance/api/governanceService';
import { actionComposerUtils } from '@/modules/governance/components/actionComposer';
import type { IActionComposerPluginData } from '@/modules/governance/types';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { TranslationFunction } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils';
import { addressUtils, IconType } from '@cddao/gov-ui-kit';
import { drawPlugin } from '../../constants/drawPlugin';
import type { IDrawPluginSettings } from '../../types';
import type { IDrawProposalAction } from '../../types/drawProposalAction';

export interface IGetDrawActionsProps {
    /**
     * DAO plugin data.
     */
    plugin: IDaoPlugin<IDrawPluginSettings>;
    /**
     * The translation function for internationalization.
     */
    t: TranslationFunction;
}

export type IGetDrawActionsResult = IActionComposerPluginData<IDaoPlugin<IDrawPluginSettings>>;

// Define action types for the draw plugin
export enum DrawProposalActionType {
    UPDATE_SETTINGS = 'UPDATE_SETTINGS',
    MINT_NFT = 'MINT_NFT',
}

class DrawActionUtils {
    getDrawActions = ({ plugin, t }: IGetDrawActionsProps): IGetDrawActionsResult => {
        const { address, settings } = plugin;
        
        return {
            groups: [
                {
                    id: address,
                    name: daoUtils.getPluginName(plugin),
                    info: addressUtils.truncateAddress(address),
                    indexData: [address],
                },
            ],
            items: [
                {
                    ...actionComposerUtils.getDefaultActionPluginMetadataItem(plugin, t),
                    meta: plugin,
                },
            ],
            components: {},
        };
    };

    isDrawAction = (action: IProposalAction | IDrawProposalAction): action is IDrawProposalAction => {
        return Object.values(DrawProposalActionType).includes(action.type as DrawProposalActionType);
    };
}

export const drawActionUtils = new DrawActionUtils();