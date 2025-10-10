export interface IDrawPluginSetupERC1155Props {
    /**
     * Prefix to be appended to all form fields.
     */
    formPrefix: string;
}

export interface IDrawPluginSetupERC1155Form {
    /**
     * Flag indicating whether to create a new ERC1155 token.
     */
    isCreateNewErc1155?: boolean;
    /**
     * Address of the existing ERC1155 token.
     */
    erc1155Address?: string;
    /**
     * URI for the new ERC1155 token.
     */
    erc1155URI?: string;
}