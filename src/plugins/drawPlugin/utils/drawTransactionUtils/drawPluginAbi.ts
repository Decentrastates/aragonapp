// ABI for the Draw Plugin setup parameters with conditional deployment support
export const drawPluginSetupAbi = [
    // Token settings
    { name: 'tokenA', type: 'address' },
    { name: 'tokenB', type: 'address' },
    { name: 'erc20Name', type: 'string' },
    { name: 'erc20Symbol', type: 'string' },
    { name: 'erc1155Uri', type: 'string' },

    // Eligibility parameters
    { name: 'eligibleToken', type: 'address' },
    { name: 'minTokenAmount', type: 'uint256' },
    { name: 'isErc1155Eligible', type: 'bool' },
    { name: 'eligibleNftId', type: 'uint256' },
    { name: 'drawInterval', type: 'uint256' },

    // NFT combinations
    {
        name: 'initNFTCombos',
        type: 'tuple[]',
        components: [
            { name: 'comboId', type: 'uint256' },
            {
                name: 'nftUnits',
                type: 'tuple[]',
                components: [
                    { name: 'id', type: 'uint256' },
                    { name: 'unit', type: 'uint256' },
                ],
            },
            { name: 'isEnabled', type: 'bool' },
            { name: 'maxExchangeCount', type: 'uint256' },
            { name: 'maxSingleBatch', type: 'uint256' },
            { name: 'currentExchangeCount', type: 'uint256' },
        ],
    },
] as const;

// ABI for the Draw Plugin prepare update parameters
export const drawPluginPrepareUpdateAbi = [
    {
        name: 'targetConfig',
        type: 'tuple',
        components: [
            { name: 'target', type: 'address' },
            { name: 'operation', type: 'uint8' },
        ],
    },
    { name: 'metadata', type: 'bytes' },
] as const;

// ABI for the Draw Plugin main functions
export const drawPluginAbi = [
    {
        name: 'drawNFT',
        type: 'function',
        inputs: [{ name: 'signature', type: 'bytes' }],
        outputs: [
            { name: 'success', type: 'bool' },
            { name: 'nftId', type: 'uint256' },
            { name: 'amount', type: 'uint256' },
            { name: 'message', type: 'string' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'exchangeToken',
        type: 'function',
        inputs: [
            { name: 'comboId', type: 'uint256' },
            { name: 'batchCount', type: 'uint256' },
            { name: 'signature', type: 'bytes' },
        ],
        outputs: [
            { name: 'success', type: 'bool' },
            { name: 'amount', type: 'uint256' },
            { name: 'message', type: 'string' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'getValidNftIds',
        type: 'function',
        inputs: [],
        outputs: [{ name: 'ids', type: 'uint256[]' }],
        stateMutability: 'view',
    },
    {
        name: 'getNftSupply',
        type: 'function',
        inputs: [{ name: 'nftId', type: 'uint256' }],
        outputs: [
            { name: 'current', type: 'uint256' },
            { name: 'max', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        name: 'updateEligibilityParam',
        type: 'function',
        inputs: [
            { name: 'paramName', type: 'string' },
            { name: 'newValue', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'updateBlacklist',
        type: 'function',
        inputs: [
            { name: 'users', type: 'address[]' },
            { name: 'isBlacklisted', type: 'bool' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'updateNFTCombo',
        type: 'function',
        inputs: [
            { name: 'comboId', type: 'uint256' },
            { name: 'isEnabled', type: 'bool' },
            { name: 'maxSingleBatch', type: 'uint256' },
            { name: 'maxExchangeCount', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'setNFTMaxSupply',
        type: 'function',
        inputs: [
            { name: 'nftId', type: 'uint256' },
            { name: 'maxSupply', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'createProposal',
        type: 'function',
        inputs: [
            { name: '_metadata', type: 'bytes' },
            {
                name: '_actions',
                type: 'tuple[]',
                components: [
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                ],
            },
            { name: '_allowFailureMap', type: 'uint256' },
            { name: '_startDate', type: 'uint64' },
            { name: '_endDate', type: 'uint64' },
        ],
        outputs: [{ name: 'proposalId', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
] as const;
