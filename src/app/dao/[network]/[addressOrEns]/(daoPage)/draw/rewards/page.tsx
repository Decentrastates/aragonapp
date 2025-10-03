import type React from 'react';
import { notFound } from 'next/navigation';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { IDaoPageParams } from '@/shared/types';
import { RewardRedemptionPage } from '@/modules/draw/pages/rewardRedemptionPage';

interface IRewardRedemptionPageParams extends IDaoPageParams {}

export interface IRewardRedemptionPageProps {
    params: Promise<IRewardRedemptionPageParams>;
}

const RewardRedemptionPageWrapper: React.FC<IRewardRedemptionPageProps> = async ({ params }) => {
    const resolvedParams = await params;
    const daoId = await daoUtils.resolveDaoId(resolvedParams);

    if (!daoId) {
        notFound();
    }

    return <RewardRedemptionPage daoId={daoId} />;
};

export default RewardRedemptionPageWrapper;