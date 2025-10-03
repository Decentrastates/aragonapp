'use client';

import { DrawWidget } from '@/plugins/drawPlugin/components/drawWidget';
import { mockNftCollectionDetail } from '@/plugins/drawPlugin/data/mockNftCollectionData';
import { useDrawDialogs } from '@/plugins/drawPlugin/hooks/useDrawDialogs';
import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils/daoUtils';
import { NftCollectionDetail } from '@cddao/gov-ui-kit';
import { useAccount } from 'wagmi';

export interface IDrawDetailPageClientProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
    /**
     * ID of the draw/NFT collection.
     */
    drawId: string;
}

export const DrawDetailPageClient: React.FC<IDrawDetailPageClientProps> = ({ daoId, drawId }) => {
    // _drawId is intentionally unused, reserved for future use
    const { t } = useTranslations();
    const { address: userAddress } = useAccount();
    const { openParticipateDrawDialogWithDaoId, openRedeemRewardsDialog } = useDrawDialogs();

    // 解析 daoId 获取网络和地址
    const { network, address } = daoUtils.parseDaoId(daoId);

    // 定义面包屑导航
    const pageBreadcrumbs = [
        {
            href: `/dao/${network}/${address}/draw`,
            label: t('app.plugins.draw.mainPage.home.title'),
        },
        { label: drawId },
    ];

    // 处理抽奖按钮点击
    const handleLotteryClick = () => {
        if (userAddress) {
            openParticipateDrawDialogWithDaoId(daoId);
        }
    };

    // 处理兑换按钮点击
    const handleRedemptionClick = () => {
        // 传递必要的参数给兑奖对话框
        openRedeemRewardsDialog({
            daoId,
            onSuccess: () => {
                // 成功回调
                console.log('Redemption successful');
            },
        });
    };

    return (
        <Page.Container>
            <Page.Header breadcrumbs={pageBreadcrumbs} />
            <Page.Content>
                <Page.Main>
                    <NftCollectionDetail
                        {...mockNftCollectionDetail}
                        showLotteryButton={true}
                        showRedemptionButton={true}
                        onLotteryClick={handleLotteryClick}
                        onRedemptionClick={handleRedemptionClick}
                    />
                </Page.Main>
                <Page.Aside>
                    <DrawWidget daoId={daoId} />
                </Page.Aside>
            </Page.Content>
        </Page.Container>
    );
};
