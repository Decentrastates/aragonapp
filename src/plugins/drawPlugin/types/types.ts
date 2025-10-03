import { type Network } from '@/shared/api/daoService';

export interface ICreateDrawPageParams {
    /**
     * The address or ENS name of the DAO.
     */
    addressOrEns: string;
    /**
     * The network the DAO is deployed on.
     */
    network: Network;
    /**
     * The plugin address used to create a proposal for adding the draw plugin.
     */
    pluginAddress: string;
}
