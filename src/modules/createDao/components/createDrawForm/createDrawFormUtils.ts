import type { ICreateDrawFormStage, IDrawCommonFields, ICreateDrawFormData } from './createDrawFormDefinitions';

class CreateDrawFormUtils {
    buildDefaultData = (): ICreateDrawFormData => {
        const defaultGovernance: IDrawCommonFields = {
            eligibleToken: '',
            minTokenAmount: '100',
            isErc1155Eligible: false,
            eligibleNftId: '',
            drawInterval: '86400', // 24 hours in seconds
            tokenA: '',
            tokenB: '',
            nftCombos: [],
        };

        return {
            // Base fields
            name: '',
            processKey: '',
            description: '',
            resources: [],
            
            // Governance settings
            governance: defaultGovernance,
            
            // New fields for step-by-step form
            isCreateNewNft: false,
            isCreateNewToken: false,
            tokenDecimals: '18',
            tokenName: '',
            tokenSymbol: '',
            tokenInitialSupply: '',
            erc1155Uri: '',
        } as ICreateDrawFormData;
    };

    buildDefaultStage = (): ICreateDrawFormStage => {
        const internalId = crypto.randomUUID();

        return {
            internalId,
            name: '',
            bodies: [],
        };
    };
}

export const createDrawFormUtils = new CreateDrawFormUtils();