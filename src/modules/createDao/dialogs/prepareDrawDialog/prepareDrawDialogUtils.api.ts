import type { ICreateDrawFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { IDao } from '@/shared/api/daoService';
import type { IPluginInstallationSetupData } from '@/shared/utils/pluginTransactionUtils';
import type { Hex } from 'viem';
import { type IBuildPreparePluginInstallDataParams } from '../../types';
import { type IProposalActionData } from '@/modules/governance/components/createProposalForm';

// 更新 IPrepareDrawMetadata 接口以更好地支持条件部署功能
export interface IPrepareDrawMetadata {
    /**
     * Metadata CID of all draw plugins.
     */
    plugins: string[];
    /**
     * Metadata CID for the draw metadata.
     */
    draw?: string;
    /**
     * Name of the process.
     */
    name: string;
    /**
     * Description of the process.
     */
    description: string;
    /**
     * Resources of the process.
     */
    resources: Array<{ name: string; url: string }>;
    /**
     * Key of the process used as prefix for proposals.
     */
    processKey?: string;
    /**
     * Contract deployment information for conditional deployment
     */
    contracts?: {
        /**
         * ERC1155 contract information
         */
        erc1155?: {
            /**
             * Whether a new ERC1155 contract needs to be deployed
             */
            needsDeployment: boolean;
            /**
             * Address of existing ERC1155 contract (if not deploying new)
             */
            address?: string;
            /**
             * Creation parameters for new ERC1155 contract (if deploying new)
             */
            creationParams?: {
                uri?: string;
            };
        };
        /**
         * ERC20 contract information
         */
        erc20?: {
            /**
             * Whether a new ERC20 contract needs to be deployed
             */
            needsDeployment: boolean;
            /**
             * Address of existing ERC20 contract (if not deploying new)
             */
            address?: string;
            /**
             * Creation parameters for new ERC20 contract (if deploying new)
             */
            creationParams?: {
                name?: string;
                symbol?: string;
                decimals?: string;
                initialSupply?: string;
            };
        };
        /**
         * Eligibility token information
         */
        eligibleToken?: {
            /**
             * Address of the eligibility token
             */
            address?: string;
            /**
             * Whether the eligibility token is ERC1155
             */
            isErc1155Eligible: boolean;
            /**
             * Specific NFT ID required for eligibility (if applicable)
             */
            eligibleNftId?: string;
        };
    };
}

export interface IBuildDrawTransactionParams {
    /**
     * Values of the create-draw form.
     */
    values: ICreateDrawFormData;
    /**
     * Metadata URI for the draw.
     */
    drawMetadata: IPrepareDrawMetadata;
    /**
     * DAO to install the plugins to.
     */
    dao: IDao;
}

export interface IBuildPrepareInstallPluginActionParams extends Omit<IBuildPreparePluginInstallDataParams, 'metadata'> {
    /**
     * Metadata CID of the plugin.
     */
    metadataCid: string;
}

export interface IBuildDrawProposalActionsParams {
    /**
     * Create-process form values.
     */
    values: ICreateDrawFormData;
    /**
     * DAO to install the plugins for.
     */
    dao: IDao;
    /**
     * Address list of the plugins to be installed.
     */
    setupData: IPluginInstallationSetupData[];
    /**
     * Address of the execute condition contract if specific permissions are set.
     */
    executeConditionAddress?: Hex;
}

export interface IBuildDeployExecuteSelectorConditionDataParams {
    /**
     * Specified actions from the create-process form.
     */
    permissionSelectors: IProposalActionData[];
    /**
     * DAO to install the ExecuteSelectorCondition to.
     */
    dao: IDao;
}