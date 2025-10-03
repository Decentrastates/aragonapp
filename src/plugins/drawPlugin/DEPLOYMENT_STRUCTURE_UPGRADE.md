# Draw Plugin Deployment Structure Upgrade

This document describes the upgrade to the draw plugin deployment structure to align with the frontend deployment fields documentation.

## Overview

The draw plugin deployment structure has been upgraded to match the documented field structure, providing a more consistent and maintainable interface for plugin deployment.

## New Data Structures

### 1. Token Settings (ITokenSettings)

```typescript
interface ITokenSettings {
    tokenA: string;           // ERC20 token address, set to address(0) to deploy a new token
    tokenB: string;           // ERC1155 token address, set to address(0) to deploy a new token
    erc20Name?: string;       // ERC20 token name (used only when deploying a new token)
    erc20Symbol?: string;     // ERC20 token symbol (used only when deploying a new token)
    erc1155Uri?: string;      // ERC1155 token URI (used only when deploying a new token)
}
```

### 2. Eligibility Parameters (IEligibilityParams)

```typescript
interface IEligibilityParams {
    eligibleToken: string;      // Token address used for eligibility verification
    minTokenAmount: bigint;     // Minimum token holding requirement
    isErc1155Eligible: boolean; // Whether ERC1155 tokens are used for eligibility
    eligibleNftId?: bigint;     // ERC1155 token ID (required if isErc1155Eligible is true)
    drawInterval: bigint;       // Draw interval in seconds
}
```

### 3. NFT Combination (INftCombo)

```typescript
interface INftComboUnit {
    id: bigint;    // NFT ID
    unit: bigint;  // Number of this NFT ID required per exchange
}

interface INftCombo {
    comboId: bigint;              // Combination ID
    nftUnits: INftComboUnit[];    // Array of NFT units in this combination
    isEnabled: boolean;           // Whether this combination is enabled
    maxExchangeCount: bigint;     // Maximum total exchange count for this combination
    maxSingleBatch: bigint;       // Maximum number of combinations that can be exchanged in a single batch
    currentExchangeCount: bigint; // Current exchange count for this combination
}
```

### 4. Complete Plugin Installation Parameters (IPluginInstallationParams)

```typescript
interface IPluginInstallationParams {
    tokenSettings: ITokenSettings;
    eligibilityParams: IEligibilityParams;
    initNFTCombos: INftCombo[];
}
```

## Implementation

### New ABI Definition

A new ABI definition has been created in `drawPluginDeploymentAbi.ts` that matches the documented structure:

```typescript
export const drawPluginDeploymentAbi = [
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
                    { name: 'unit', type: 'uint256' }
                ]
            },
            { name: 'isEnabled', type: 'bool' },
            { name: 'maxExchangeCount', type: 'uint256' },
            { name: 'maxSingleBatch', type: 'uint256' },
            { name: 'currentExchangeCount', type: 'uint256' }
        ]
    },
    
    // Target configuration and metadata
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
```

### New Transaction Building Method

A new method `buildPrepareInstallDataNew` has been added to `DrawTransactionUtils` that uses the new data structures and ABI definition.

## Benefits

1. **Consistency**: The new structure matches the documented frontend deployment fields exactly
2. **Maintainability**: Clear separation of concerns with dedicated interfaces
3. **Type Safety**: Strong TypeScript typing for all deployment parameters
4. **Backward Compatibility**: Existing methods remain unchanged to ensure no breaking changes
5. **Extensibility**: Easy to extend or modify individual components without affecting others

## Usage

To use the new deployment structure, call the `buildPrepareInstallDataNew` method instead of the original `buildPrepareInstallData` method. The new method provides the same functionality but with the improved data structure.

## Files Modified

1. `src/plugins/drawPlugin/types/drawPluginDeployment.ts` - New type definitions
2. `src/plugins/drawPlugin/types/index.ts` - Export new types
3. `src/plugins/drawPlugin/utils/drawTransactionUtils/drawPluginDeploymentAbi.ts` - New ABI definition
4. `src/plugins/drawPlugin/utils/drawTransactionUtils/drawTransactionUtils.ts` - New method implementation