'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Card } from '@cddao/gov-ui-kit';
import type { IIcoSetupGovernanceProps } from './icoSetupGovernance.api';

export const IcoSetupGovernance: React.FC<IIcoSetupGovernanceProps> = () => {
    const { t } = useTranslations();

    return (
        <div className="flex w-full flex-col gap-y-6">
            <Card className="shadow-neutral-sm flex flex-col gap-6 border border-neutral-100 p-6">
                <div className="text-lg font-semibold">
                    {t('app.plugins.ico.icoSetupGovernance.title')}
                </div>
                <p className="text-neutral-500">
                    {t('app.plugins.ico.icoSetupGovernance.description')}
                </p>
            </Card>
        </div>
    );
};