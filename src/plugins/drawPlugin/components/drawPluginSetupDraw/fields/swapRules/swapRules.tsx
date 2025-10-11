'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { useFormContext, useWatch } from 'react-hook-form';
import type { IDrawPluginSettings, IErc1155Combo } from '../../../../types/drawPluginSettings';
import { NftComboForm } from './nftComboForm/nftComboForm';
// import { SwapInfo } from './swapInfo';

export interface ISwapRulesProps {
    /**
     * 表单字段的前缀
     */
    fieldPrefix?: string;
}

export const SwapRules: React.FC<ISwapRulesProps> = (props) => {
    const { fieldPrefix } = props;
    // console.log('SwapRules', props);

    const { t } = useTranslations();
    const { control } = useFormContext();

    // NFT组合设置（兑换规则）- 现在只有一个组合
    const nftComboField = useFormField<IDrawPluginSettings, 'initNFTCombos'>('initNFTCombos', {
        label: t('app.plugins.draw.createDrawForm.step4.nftCombos.label'),
        fieldPrefix,
        defaultValue: undefined,
    });
    // console.log('nftComboField.value', nftComboField);

    // 监听第3步中的tokenA
    const tokenAData = useWatch<{ tokenA?: string }>({
        control,
        name: 'tokenA' as never,
    });
    const tokenA = (tokenAData as { tokenA?: string } | undefined)?.tokenA ?? undefined;

    // 监听自定义token A设置
    const useCustomTokenAData = useWatch<{ useCustomTokenA?: boolean }>({
        control,
        name: 'useCustomTokenA' as never,
    });
    const useCustomTokenA =
        (useCustomTokenAData as { useCustomTokenA?: boolean } | undefined)?.useCustomTokenA ?? false;

    const customTokenAData = useWatch<{ customTokenA?: string }>({
        control,
        name: 'customTokenA' as never,
    });
    const customTokenA = (customTokenAData as { customTokenA?: string } | undefined)?.customTokenA ?? undefined;

    // 确定使用哪个token A地址
    const effectiveTokenA = useCustomTokenA && customTokenA ? customTokenA : tokenA;

    // 监听第2步中的NFT初始供应量
    const nftInitialSupplyData = useWatch<{ nftInitialSupply?: string }>({
        control,
        name: 'erc1155InitialSupply' as never,
    });
    const nftInitialSupply =
        (nftInitialSupplyData as { nftInitialSupply?: string } | undefined)?.nftInitialSupply ?? undefined;

    // 如果有nftInitialSupply，则计算maxNftId
    const maxNftId = nftInitialSupply ? Number(nftInitialSupply) : 0;
    // 处理单个组合的变更
    const handleComboChange = (combo: IErc1155Combo | undefined) => {
        nftComboField.onChange(combo);
    };

    return (
        <div className="mt-4">
            {/* <SwapInfo fieldPrefix={fieldPrefix} /> */}
            <NftComboForm
                value={nftComboField.value}
                onChange={handleComboChange}
                maxNftId={maxNftId}
                tokenA={effectiveTokenA}
                formPrefix = {fieldPrefix}
            />
        </div>
    );
};