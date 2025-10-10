import type { IPluginSetupMembershipParams } from '@/modules/createDao/types';
import { ITokenPluginSettingsToken } from '@/plugins/tokenPlugin/types';
import type { Network } from '@/shared/api/daoService';

export interface IDrawPluginSetupERC20Props extends IPluginSetupMembershipParams {
    /**
     * When true show a read only mode of the address field.
     */
    disabled?: boolean;
    /**
     * Callback to be used when the add button is clicked.
     */
    onAddClick?: () => void;
    /**
     * Address of the plugin, used to validate if the entered user address is already a member of the plugin.
     */
    pluginAddress?: string;
    /**
     * Network of the plugin.
     */
    network?: Network;
    /**
     * Hides the field label and help-text when set to true.
     */
    hideLabel?: boolean;
    /**
     * ID of the DAO to fetch assets from.
     */
    daoId?: string;
}
export interface IDrawPluginSetupERC20Form extends ITokenPluginSettingsToken{}
