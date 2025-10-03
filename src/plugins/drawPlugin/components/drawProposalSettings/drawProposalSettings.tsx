'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { InputContainer, InputText, InputNumber, Toggle } from '@cddao/gov-ui-kit';
import { useDrawPluginSettings } from '@/plugins/drawPlugin/hooks/useDrawPluginSettings';
import type { INftCombo } from '@/plugins/drawPlugin/hooks/useDrawPluginSettings';

interface IDrawProposalSettingsProps {
    daoId: string;
    pluginAddress: string;
}

// 自定义 FormSection 组件替代 Form.Section
const FormSection: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ title, description, children }) => (
    <div className="space-y-4">
        <div>
            <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
        </div>
        {children}
    </div>
);

// 自定义 FormField 组件替代 Form.Field
const FormField: React.FC<{
    id: string;
    label: string;
    description?: string;
    children: React.ReactNode;
}> = ({ id, label, description, children }) => (
    <InputContainer
        id={id}
        label={label}
        helpText={description}
        useCustomWrapper={true}
    >
        {children}
    </InputContainer>
);

export const DrawProposalSettings: React.FC<IDrawProposalSettingsProps> = ({ daoId }) => {
    const { t } = useTranslations();
    const { data: settings, isLoading } = useDrawPluginSettings(daoId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FormSection
                title={t('plugins.draw.proposalSettings.eligibilityTitle')}
                description={t('plugins.draw.proposalSettings.eligibilityDescription')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        id="eligibleToken"
                        label={t('plugins.draw.proposalSettings.eligibleToken')}
                        description={t('plugins.draw.proposalSettings.eligibleTokenDescription')}
                    >
                        <InputText
                            id="eligibleToken"
                            name="eligibleToken"
                            defaultValue={settings?.eligibleToken ?? ''}
                            placeholder="0x..."
                        />
                    </FormField>
                    
                    <FormField
                        id="minTokenAmount"
                        label={t('plugins.draw.proposalSettings.minTokenAmount')}
                        description={t('plugins.draw.proposalSettings.minTokenAmountDescription')}
                    >
                        <InputNumber
                            id="minTokenAmount"
                            name="minTokenAmount"
                            defaultValue={(settings?.minTokenAmount ?? BigInt(0)).toString()}
                            placeholder="100"
                        />
                    </FormField>
                    
                    <FormField
                        id="isErc1155Eligible"
                        label={t('plugins.draw.proposalSettings.isErc1155Eligible')}
                        description={t('plugins.draw.proposalSettings.isErc1155EligibleDescription')}
                    >
                        <Toggle
                            id="isErc1155Eligible"
                            name="isErc1155Eligible"
                            defaultChecked={settings?.isErc1155Eligible ?? false}
                            value="isErc1155Eligible"
                            label={t('plugins.draw.proposalSettings.isErc1155Eligible')}
                        />
                    </FormField>
                    
                    <FormField
                        id="eligibleNftId"
                        label={t('plugins.draw.proposalSettings.eligibleNftId')}
                        description={t('plugins.draw.proposalSettings.eligibleNftIdDescription')}
                    >
                        <InputNumber
                            id="eligibleNftId"
                            name="eligibleNftId"
                            defaultValue={(settings?.eligibleNftId ?? BigInt(0)).toString()}
                            placeholder="1"
                        />
                    </FormField>
                    
                    <FormField
                        id="drawInterval"
                        label={t('plugins.draw.proposalSettings.drawInterval')}
                        description={t('plugins.draw.proposalSettings.drawIntervalDescription')}
                    >
                        <InputNumber
                            id="drawInterval"
                            name="drawInterval"
                            defaultValue={(settings?.drawInterval ?? BigInt(0)).toString()}
                            placeholder="86400"
                        />
                    </FormField>
                </div>
            </FormSection>
            
            <FormSection
                title={t('plugins.draw.proposalSettings.tokenSettingsTitle')}
                description={t('plugins.draw.proposalSettings.tokenSettingsDescription')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        id="tokenA"
                        label={t('plugins.draw.proposalSettings.tokenA')}
                        description={t('plugins.draw.proposalSettings.tokenADescription')}
                    >
                        <InputText
                            id="tokenA"
                            name="tokenA"
                            defaultValue={settings?.tokenA ?? ''}
                            placeholder="0x..."
                        />
                    </FormField>
                    
                    <FormField
                        id="tokenB"
                        label={t('plugins.draw.proposalSettings.tokenB')}
                        description={t('plugins.draw.proposalSettings.tokenBDescription')}
                    >
                        <InputText
                            id="tokenB"
                            name="tokenB"
                            defaultValue={settings?.tokenB ?? ''}
                            placeholder="0x..."
                        />
                    </FormField>
                </div>
            </FormSection>
            
            <FormSection
                title={t('plugins.draw.proposalSettings.nftCombosTitle')}
                description={t('plugins.draw.proposalSettings.nftCombosDescription')}
            >
                <div className="space-y-4">
                    {settings?.nftCombos?.map((combo: INftCombo, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                            <h3 className="font-medium mb-3">Combo #{combo.comboId.toString()}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    id={`combo-${index.toString()}-isEnabled`}
                                    label={t('plugins.draw.proposalSettings.comboEnabled')}
                                >
                                    <Toggle
                                        id={`combo-${index.toString()}-isEnabled`}
                                        name={`nftCombos[${index.toString()}].isEnabled`}
                                        defaultChecked={combo.isEnabled}
                                        value={`combo-${index.toString()}-isEnabled`}
                                        label={t('plugins.draw.proposalSettings.comboEnabled')}
                                    />
                                </FormField>
                                
                                <FormField
                                    id={`combo-${index.toString()}-maxExchangeCount`}
                                    label={t('plugins.draw.proposalSettings.maxExchangeCount')}
                                >
                                    <InputNumber
                                        id={`combo-${index.toString()}-maxExchangeCount`}
                                        name={`nftCombos[${index.toString()}].maxExchangeCount`}
                                        defaultValue={combo.maxExchangeCount.toString()}
                                        placeholder="100"
                                    />
                                </FormField>
                                
                                <FormField
                                    id={`combo-${index.toString()}-maxSingleBatch`}
                                    label={t('plugins.draw.proposalSettings.maxSingleBatch')}
                                >
                                    <InputNumber
                                        id={`combo-${index.toString()}-maxSingleBatch`}
                                        name={`nftCombos[${index.toString()}].maxSingleBatch`}
                                        defaultValue={combo.maxSingleBatch.toString()}
                                        placeholder="10"
                                    />
                                </FormField>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>
        </div>
    );
};

export type { IDrawProposalSettingsProps };