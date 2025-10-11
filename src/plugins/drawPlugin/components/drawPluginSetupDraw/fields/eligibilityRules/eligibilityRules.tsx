'use client';

import type { IDrawPluginSettings } from '@/plugins/drawPlugin/types/drawPluginSettings';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';

export interface IEligibilityRulesProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const EligibilityRules: React.FC<IEligibilityRulesProps> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    const minTokenAmountField = useFormField<IDrawPluginSettings, 'minTokenAmount'>('minTokenAmount', {
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
    });

    const drawIntervalField = useFormField<IDrawPluginSettings, 'drawInterval'>('drawInterval', {
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

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputText
                    {...minTokenAmountField}
                    placeholder={t('app.plugins.draw.createDrawForm.step4.minTokenAmount.placeholder')}
                    // helpText={t('app.plugins.draw.createDrawForm.step4.minTokenAmount.helpText')}
                />
                <InputText
                    {...drawIntervalField}
                    placeholder={t('app.plugins.draw.createDrawForm.step4.drawInterval.placeholder')}
                    // helpText={t('app.plugins.draw.createDrawForm.step4.drawInterval.helpText')}
                />
            </div>
        </>
    );
};
