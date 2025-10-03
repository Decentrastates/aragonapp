'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { EligibilityRules, DrawRewardRules } from './fields';
import { SwapRules } from './fields/swapRules';

export interface ICreateDrawFormStep4Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const CreateDrawFormStep4: React.FC<ICreateDrawFormStep4Props> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    return (
        <div className="flex w-full flex-col gap-6">
            <h3 className="text-lg font-medium">
                {t('app.plugins.draw.createDrawForm.step4.eligibilityRules.title')}
            </h3>
            <EligibilityRules fieldPrefix={fieldPrefix} />
            
            <h3 className="text-lg font-medium mt-6 pt-6 border-t border-neutral-200">
                {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.title')}
            </h3>
            <DrawRewardRules fieldPrefix={fieldPrefix} />
            
            <h3 className="text-lg font-medium mt-6 pt-6 border-t border-neutral-200">
                {t('app.plugins.draw.createDrawForm.step4.swapRules.title')}
            </h3>
            <SwapRules fieldPrefix={fieldPrefix} />
        </div>
    );
};