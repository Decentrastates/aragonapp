import { Page } from '@/shared/components/page';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { ICreateDrawPageParams } from '@/plugins/drawPlugin/types/types';
import { CreateDrawPageClient } from './createDrawPageClient';

export interface ICreateDrawPageProps {
    /**
     * Parameters of the create draw page.
     */
    params: Promise<ICreateDrawPageParams>;
}

export const CreateDrawPage: React.FC<ICreateDrawPageProps> = async (props) => {
    const { params } = props;
    const { addressOrEns, network, pluginAddress } = await params;
    // resolveDaoId 返回的是 string 类型，不是 Network 类型
    const daoId = await daoUtils.resolveDaoId({ addressOrEns, network });

    return (
        <Page.Container>
            <CreateDrawPageClient daoId={daoId} pluginAddress={pluginAddress} />
        </Page.Container>
    );
};