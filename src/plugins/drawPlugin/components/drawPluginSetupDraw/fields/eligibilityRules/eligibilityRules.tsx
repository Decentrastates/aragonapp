'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText, Switch } from '@cddao/gov-ui-kit';
import type { IDrawPluginData } from '@/plugins/drawPlugin/types/drawPluginSettings';

export interface IEligibilityRulesProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const EligibilityRules: React.FC<IEligibilityRulesProps> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    // Use custom eligible token switch
    const useCustomEligibleTokenField = useFormField<IDrawPluginData, 'useCustomEligibleToken'>(
        'useCustomEligibleToken',
        {
            label: t('app.plugins.draw.createDrawForm.step4.useCustomEligibleToken.label'),
            fieldPrefix,
            defaultValue: false,
        },
    );

    // Eligible token rules - required only when using custom eligible token
    const eligibleTokenRules = {
        required: useCustomEligibleTokenField.value
            ? t('app.plugins.draw.createDrawForm.step4.eligibleToken.required')
            : false,
        pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: t('app.plugins.draw.createDrawForm.step4.eligibleToken.invalidAddress'),
        },
    };

    // Eligibility settings
    const eligibleTokenField = useFormField<IDrawPluginData, 'eligibleToken'>(
        'eligibleToken',
        {
            label: t('app.plugins.draw.createDrawForm.step4.eligibleToken.label'),
            fieldPrefix,
            rules: eligibleTokenRules,
            defaultValue: undefined,
        },
    );

    const minTokenAmountField = useFormField<IDrawPluginData, 'minTokenAmount'>(
        'minTokenAmount',
        {
            label: t('app.plugins.draw.createDrawForm.step4.minTokenAmount.label'),
            fieldPrefix,
            rules: {
                required: t('app.plugins.draw.createDrawForm.step4.minTokenAmount.required'),
                pattern: {
                    value: /^\d+$/,
                    message: t('app.plugins.draw.createDrawForm.step4.minTokenAmount.invalidNumber'),
                },
            },
            defaultValue: undefined,
        },
    );

    const drawIntervalField = useFormField<IDrawPluginData, 'drawInterval'>('drawInterval', {
        label: t('app.plugins.draw.createDrawForm.step4.drawInterval.label'),
        fieldPrefix,
        rules: {
            required: t('app.plugins.draw.createDrawForm.step4.drawInterval.required'),
            pattern: {
                value: /^\d+$/,
                message: t('app.plugins.draw.createDrawForm.step4.drawInterval.invalidSeconds'),
            },
        },
        defaultValue: undefined, // 24 hours in seconds
    });

    return (
        <>
            <h3 className="text-lg font-medium">{t('app.plugins.draw.createDrawForm.step4.eligibilityRules.title')}</h3>
            <div className="mt-4">
                <Switch
                    checked={useCustomEligibleTokenField.value}
                    onCheckedChanged={(value) => useCustomEligibleTokenField.onChange(value)}
                    label={useCustomEligibleTokenField.label}
                    helpText={t('app.plugins.draw.createDrawForm.step4.useCustomEligibleToken.helpText')}
                />

                {useCustomEligibleTokenField.value ? (
                    <div className="mt-4">
                        <InputText
                            {...eligibleTokenField}
                            placeholder={t('app.plugins.draw.createDrawForm.step4.eligibleToken.placeholder')}
                            helpText={t('app.plugins.draw.createDrawForm.step4.eligibleToken.helpText')}
                        />
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-sm text-neutral-500">
                            {t('app.plugins.draw.createDrawForm.step4.useCustomEligibleToken.defaultInfo')}
                        </p>
                    </div>
                )}
            </div>

            <InputText
                {...minTokenAmountField}
                placeholder={t('app.plugins.draw.createDrawForm.step4.minTokenAmount.placeholder')}
                helpText={t('app.plugins.draw.createDrawForm.step4.minTokenAmount.helpText')}
            />
            <InputText
                {...drawIntervalField}
                placeholder={t('app.plugins.draw.createDrawForm.step4.drawInterval.placeholder')}
                helpText={t('app.plugins.draw.createDrawForm.step4.drawInterval.helpText')}
            />
        </>
    );
};