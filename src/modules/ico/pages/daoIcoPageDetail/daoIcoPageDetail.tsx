import { daoOptions } from '@/shared/api/daoService';
import { Page } from '@/shared/components/page';
import { type IDaoPageParams } from '@/shared/types';
import { daoUtils } from '@/shared/utils/daoUtils';
import { QueryClient } from '@tanstack/react-query';
import { DaoIcoPageDetailClient } from './daoIcoPageDetailClient';

export interface IDaoIcoPageDetailProps {
    /**
     * DAO page parameters.
     */
    params: Promise<IDaoPageParams>;
}

export const DaoIcoPageDetail: React.FC<IDaoIcoPageDetailProps> = async (props) => {
    const { params } = props;
    const daoPageParams = await params;
    const daoId = await daoUtils.resolveDaoId(daoPageParams);

    const queryClient = new QueryClient();

    const useDaoParams = { id: daoId };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dao = await queryClient.fetchQuery(daoOptions({ urlParams: useDaoParams }));

    return (
        <Page.Container queryClient={queryClient}>
            <DaoIcoPageDetailClient id={daoId} />
        </Page.Container>
    );
};
