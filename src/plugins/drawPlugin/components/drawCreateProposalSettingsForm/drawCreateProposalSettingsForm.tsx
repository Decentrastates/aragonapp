'use client';

import { useTranslations } from '@/shared/components/translationsProvider';

export interface IDrawCreateProposalSettingsFormProps {}

export const DrawCreateProposalSettingsForm: React.FC<IDrawCreateProposalSettingsFormProps> = () => {
    const { t } = useTranslations();

    return (
        <div className="text-sm text-gray-500">
            {t('app.plugins.draw.drawCreateProposalSettingsForm.description')}
        </div>
    );
};