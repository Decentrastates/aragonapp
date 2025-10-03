'use client';

import { useTranslations } from '@/shared/components/translationsProvider';

export interface IDrawRewardInfoProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const DrawRewardInfo: React.FC<IDrawRewardInfoProps> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">
                {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.infoTitle')}
            </h4>
            <p className="text-sm text-blue-700">
                {t('app.plugins.draw.createDrawForm.step4.drawRewardRules.infoDescription')}
            </p>
        </div>
    );
};