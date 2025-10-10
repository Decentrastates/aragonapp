import { type Network } from '@/shared/api/daoService';

export interface IAddressesInputERC20ItemProps {
    /**
     * When true show a read only mode of the address field.
     */
    disabled?: boolean;
    /**
     * Address of the plugin.
     */
    pluginAddress?: string;
    /**
     * Network of the plugin.
     */
    network?: Network;
    /**
     * Form field prefix.
     */
    formPrefix: string;
    /**
     * ID of the DAO to fetch assets from.
     */
    daoId?: string;
}