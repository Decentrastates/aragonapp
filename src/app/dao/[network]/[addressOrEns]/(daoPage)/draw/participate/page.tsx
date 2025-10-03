import type React from 'react';
import { notFound } from 'next/navigation';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { IDaoPageParams } from '@/shared/types';
import { DrawParticipationPage } from '@/modules/draw/pages/drawParticipationPage';

interface IDrawParticipationPageParams extends IDaoPageParams {}

export interface IDrawParticipationPageProps {
    params: Promise<IDrawParticipationPageParams>;
}

const DrawParticipationPageWrapper: React.FC<IDrawParticipationPageProps> = async ({ params }) => {
    const resolvedParams = await params;
    const daoId = await daoUtils.resolveDaoId(resolvedParams);

    if (!daoId) {
        notFound();
    }

    return <DrawParticipationPage daoId={daoId} />;
};

export default DrawParticipationPageWrapper;