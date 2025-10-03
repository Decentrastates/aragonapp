'use client';

import { DrawWidget } from '@/plugins/drawPlugin/components/drawWidget';
import { NftCollectionDetail } from '@/plugins/drawPlugin/components/nftCollectionDetail';
import { mockNftCollectionDetail } from '@/plugins/drawPlugin/data/mockNftCollectionData';
import { useDrawDialogs } from '@/plugins/drawPlugin/hooks/useDrawDialogs';
import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils/daoUtils';
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
        <>
            <Page.Header
                breadcrumbs={pageBreadcrumbs}
                title={mockNftCollectionDetail.name}
                description={mockNftCollectionDetail.description}
            />
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
                    <Page.MainSection title="How to Participate">
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
                            <p className="mb-4 text-blue-700">
                                {/* You can participate in the {tokenDetails.name} ICO through {dao.name}. Select the */}
                                &quot;Participate in ICO&quot; button above to begin the process.
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-blue-700">
                                <li>Connect your wallet</li>
                                <li>Choose your investment amount</li>
                                <li>Confirm transaction</li>
                                <li>Receive tokens after ICO completion</li>
                            </ul>
                        </div>
                    </Page.MainSection>
                </Page.Aside>
            </Page.Content>
        </>
    );
};
