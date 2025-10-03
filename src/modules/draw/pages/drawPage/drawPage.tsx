import { Page } from '@/shared/components/page';
import { type IDaoPageParams } from '@/shared/types';
import { daoUtils } from '@/shared/utils/daoUtils';
import { QueryClient } from '@tanstack/react-query';
import { DrawPageClient } from './drawPageClient';

export interface IDrawPageProps {
    /**
     * DAO page parameters.
     */
    params: Promise<IDaoPageParams>;
}

export const drawCount = 20;

export const DrawPage: React.FC<IDrawPageProps> = async (props) => {
    const { params } = props;
    const daoPageParams = await params;
    const daoId = await daoUtils.resolveDaoId(daoPageParams);

    const queryClient = new QueryClient();

    // 在这里可以预取一些通用数据，例如DAO信息等
    // 示例：await queryClient.prefetchQuery(daoOptions({ urlParams: { id: daoId } }));

    return (
        <Page.Container queryClient={queryClient}>
            <DrawPageClient daoId={daoId} />
        </Page.Container>
    );
};

export default DrawPage;