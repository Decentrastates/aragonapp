import { daoOptions } from '@/shared/api/daoService';
import type { IDaoPageParams } from '@/shared/types';
import { daoUtils } from '@/shared/utils/daoUtils';
import { QueryClient } from '@tanstack/react-query';
import type React from 'react';
import { DrawDetailPageClient } from './drawDetailPageClient';

export interface IDrawDetailPageParams extends IDaoPageParams {
    /**
     * Address/ID of the draw/NFT collection.
     */
    address: string;
}

export interface IDrawDetailPageProps {
    /**
     * Draw detail page parameters.
     */
    params: Promise<IDrawDetailPageParams>;
}

export const DrawDetailPage: React.FC<IDrawDetailPageProps> = async (props) => {
    const { params } = props;
    const { address, addressOrEns, network } = await params;
    const daoId = await daoUtils.resolveDaoId({ addressOrEns, network });
    const queryClient = new QueryClient();
    
    // 预取DAO数据
    await queryClient.fetchQuery(daoOptions({ urlParams: { id: daoId } }));

    // 可以在这里预取抽奖相关的数据
    // 示例：await queryClient.fetchQuery(drawOptions({ urlParams: { id: address } }));

    return (
        <DrawDetailPageClient daoId={daoId} drawId={address} />
    );
};