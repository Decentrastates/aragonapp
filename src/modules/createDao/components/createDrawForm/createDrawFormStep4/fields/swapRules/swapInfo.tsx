'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useWatch, useFormContext } from 'react-hook-form';

export interface ISwapInfoProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const SwapInfo: React.FC<ISwapInfoProps> = () => {
    const { t } = useTranslations();
    const { control } = useFormContext();

    // Watch for tokenA from step 3
    const tokenAData = useWatch<{ tokenA?: string }>({ 
        control, 
        name: 'governance.tokenA' as never,
    });
    // Type assertion to ensure TypeScript understands tokenAData can be undefined
    const tokenA = (tokenAData as { tokenA?: string } | undefined)?.tokenA ?? undefined;
    
    // Watch for custom token A settings
    const useCustomTokenAData = useWatch<{ useCustomTokenA?: boolean }>({ 
        control, 
        name: 'governance.useCustomTokenA' as never,
    });
    // Type assertion to ensure TypeScript understands useCustomTokenAData can be undefined
    const useCustomTokenA = (useCustomTokenAData as { useCustomTokenA?: boolean } | undefined)?.useCustomTokenA ?? false;
    
    const customTokenAData = useWatch<{ customTokenA?: string }>({ 
        control, 
        name: 'governance.customTokenA' as never,
    });
    // Type assertion to ensure TypeScript understands customTokenAData can be undefined
    const customTokenA = (customTokenAData as { customTokenA?: string } | undefined)?.customTokenA ?? undefined;
    
    // Determine which token A address to use
    const effectiveTokenA = useCustomTokenA && customTokenA ? customTokenA : tokenA;

    return (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
            <h4 className="font-medium text-green-800 mb-2">
                {t('app.plugins.draw.createDrawForm.step4.swapRules.infoTitle')}
            </h4>
            <p className="text-sm text-green-700">
                {t('app.plugins.draw.createDrawForm.step4.swapRules.infoDescription')}
            </p>
            {effectiveTokenA ? (
                <p className="text-sm text-green-700 mt-2">
                    {useCustomTokenA && customTokenA 
                        ? t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoWithCustomAddress', { tokenA: effectiveTokenA })
                        : t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoWithAddress', { tokenA: effectiveTokenA })}
                </p>
            ) : (
                <p className="text-sm text-green-700 mt-2">
                    {t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoWithoutAddress')}
                </p>
            )}
        </div>
    );
};