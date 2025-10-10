'use client';

import { useTranslations } from '@/shared/components/translationsProvider';

export interface IDrawRewardInfoProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const DrawRewardInfo: React.FC<IDrawRewardInfoProps> = () => {
    // const { fieldPrefix } = props;

    const { t } = useTranslations();

    return (
        <>
            <h3 className="mt-6 border-t border-neutral-200 pt-6 text-lg font-medium">
                {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.title')}
            </h3>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-800">
                    {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.infoTitle')}
                </h4>
                <p className="text-sm text-blue-700">
                    {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.infoDescription')}
                </p>
            </div>
        </>
    );
};
