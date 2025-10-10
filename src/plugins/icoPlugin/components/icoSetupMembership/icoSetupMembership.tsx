'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Card } from '@cddao/gov-ui-kit';
import type { IIcoSetupMembershipProps } from './icoSetupMembership.api';

export const IcoSetupMembership: React.FC<IIcoSetupMembershipProps> = () => {
    const { t } = useTranslations();

    return (
        <div className="flex w-full flex-col gap-y-6">
            <Card className="shadow-neutral-sm flex flex-col gap-6 border border-neutral-100 p-6">
                <div className="text-lg font-semibold">
                    {t('app.plugins.ico.icoSetupMembership.title')}
                </div>
                <p className="text-neutral-500">
                    {t('app.plugins.ico.icoSetupMembership.description')}
                </p>
            </Card>
        </div>
    );
};