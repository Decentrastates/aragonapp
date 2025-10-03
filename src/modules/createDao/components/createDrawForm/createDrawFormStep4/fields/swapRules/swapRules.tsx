'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { ICreateDrawFormData, INftCombo } from '../../../createDrawFormDefinitions';
import { NftComboForm } from './nftComboForm/nftComboForm';
import { SwapInfo } from './swapInfo.tsx';
import { useWatch } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

export interface ISwapRulesProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const SwapRules: React.FC<ISwapRulesProps> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();
    const { control } = useFormContext();

    // NFT combo setting (swap rules) - now only one combo
    const nftComboField = useFormField<ICreateDrawFormData, 'governance.nftCombos'>('governance.nftCombos', {
        label: t('app.plugins.draw.createDrawForm.step4.nftCombos.label'),
        fieldPrefix: fieldPrefix ? `${fieldPrefix}.governance` : 'governance',
        defaultValue: undefined,
    });

    // Watch for tokenA from step 3
    const tokenAData = useWatch<{ tokenA?: string }>({ 
        control, 
        name: 'governance.tokenA' as never,
    });
    const tokenA = (tokenAData as { tokenA?: string } | undefined)?.tokenA ?? undefined;
    
    // Watch for custom token A settings
    const useCustomTokenAData = useWatch<{ useCustomTokenA?: boolean }>({ 
        control, 
        name: 'governance.useCustomTokenA' as never,
    });
    const useCustomTokenA = (useCustomTokenAData as { useCustomTokenA?: boolean } | undefined)?.useCustomTokenA ?? false;
    
    const customTokenAData = useWatch<{ customTokenA?: string }>({ 
        control, 
        name: 'governance.customTokenA' as never,
    });
    const customTokenA = (customTokenAData as { customTokenA?: string } | undefined)?.customTokenA ?? undefined;
    
    // Determine which token A address to use
    const effectiveTokenA = useCustomTokenA && customTokenA ? customTokenA : tokenA;
    
    // Watch for NFT initial supply from step 2
    const nftInitialSupplyData = useWatch<{ nftInitialSupply?: string }>({ 
        control, 
        name: 'governance.nftInitialSupply' as never,
    });
    const nftInitialSupply = (nftInitialSupplyData as { nftInitialSupply?: string } | undefined)?.nftInitialSupply ?? undefined;
    
    // Calculate maxNftId based on nftInitialSupply if available
    const maxNftId = nftInitialSupply ? Number(nftInitialSupply) : 0;

    // Convert the field value to a single combo (or undefined if empty array)
    const singleComboValue = nftComboField.value?.[0];

    // Handle changes to the single combo
    const handleComboChange = (combo: INftCombo | undefined) => {
        // Convert single combo back to array format for form compatibility
        nftComboField.onChange(combo ? [combo] : []);
    };

    return (
        <div className="mt-4">
            <SwapInfo fieldPrefix={fieldPrefix} />
            <NftComboForm 
                value={singleComboValue}
                onChange={handleComboChange}
                maxNftId={maxNftId}
                tokenA={effectiveTokenA}
            />
        </div>
    );
};