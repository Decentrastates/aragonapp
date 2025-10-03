import { type IDaoPlugin } from '@/shared/api/daoService';
import type { IActionComposerPluginData } from '@/modules/governance/types/actionComposerPluginData';
import type { IDrawPluginSettings } from '../../types';
import { daoUtils } from '@/shared/utils/daoUtils';
import { addressUtils , IconType } from '@cddao/gov-ui-kit';
import { actionComposerUtils } from '@/modules/governance/components/actionComposer';
import { useTranslations } from '@/shared/components/translationsProvider';

export const useDrawActions = (plugin: IDaoPlugin<IDrawPluginSettings>): IActionComposerPluginData<IDaoPlugin<IDrawPluginSettings>> => {
    const { t } = useTranslations();
    const { address, settings } = plugin;
    
    // Get plugin name for display
    const pluginName = daoUtils.getPluginName(plugin);
    
    // For draw plugin, we want to add specific actions related to:
    // 1. Managing NFT combinations
    // 2. Updating draw settings
    // 3. Managing token requirements
    
    return {
        groups: [
            {
                id: address,
                name: pluginName,
                info: addressUtils.truncateAddress(address),
                indexData: [address],
            },
            // Add token group if we have token addresses
            ...(settings.eligibleToken ? [{
                id: settings.eligibleToken,
                name: t('app.plugins.draw.actions.tokenGroup'),
                info: addressUtils.truncateAddress(settings.eligibleToken),
                indexData: [settings.eligibleToken],
            }] : []),
        ],
        items: [
            // Add update settings action
            {
                id: `${address}-update-settings`,
                name: t('app.plugins.draw.actions.updateSettings'),
                icon: IconType.SETTINGS,
                groupId: address,
                meta: plugin,
                // TODO: Add default value for update settings action when implemented
            },
            // Add plugin metadata update action
            {
                ...actionComposerUtils.getDefaultActionPluginMetadataItem(plugin, t),
                meta: plugin,
            },
            // Add token-related actions if we have a token
            ...(settings.eligibleToken ? [
                {
                    id: `${settings.eligibleToken}-update-token-requirements`,
                    name: t('app.plugins.draw.actions.updateTokenRequirements'),
                    icon: IconType.SETTINGS,
                    groupId: settings.eligibleToken,
                    meta: plugin,
                    // TODO: Add default value for token requirements action when implemented
                }
            ] : []),
        ],
        components: {
            // TODO: Add custom components for draw actions when implemented
        }
    };
};