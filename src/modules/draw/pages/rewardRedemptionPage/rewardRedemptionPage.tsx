'use client';

import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Container } from '@/shared/components/container';
import { Card, Icon, IconType, Button } from '@cddao/gov-ui-kit';
import { useNftHoldings, useRedemptionRequirements } from '@/plugins/drawPlugin/hooks/useRewards';
import { PageError } from '@/shared/components/page/pageError';

interface IRewardRedemptionPageProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const RewardRedemptionPage: React.FC<IRewardRedemptionPageProps> = ({ daoId }) => {
    const { t } = useTranslations();
    const { nftHoldings, isLoading: isLoadingNfts, error: nftHoldingsError } = useNftHoldings(daoId);
    const { requirements, isLoading: isLoadingRequirements, error: redemptionRequirementsError } = useRedemptionRequirements(daoId);

    const isLoading = isLoadingNfts || isLoadingRequirements;
    
    // 检查是否有错误并且不是加载状态
    if (!isLoading) {
        if (nftHoldingsError) {
            return (
                <PageError 
                    titleKey="plugins.draw.redemptionPage.error.title"
                    descriptionKey={nftHoldingsError instanceof Error ? nftHoldingsError.message : String(nftHoldingsError)}
                />
            );
        }
        
        if (redemptionRequirementsError) {
            return (
                <PageError 
                    titleKey="plugins.draw.redemptionPage.error.title"
                    descriptionKey={redemptionRequirementsError instanceof Error ? redemptionRequirementsError.message : String(redemptionRequirementsError)}
                />
            );
        }
    }

    return (
        <Page.Main>
            <Page.Header
                title={t('plugins.draw.redemptionPage.title')}
                description={t('plugins.draw.redemptionPage.description')}
            />
            <Page.MainSection title={t('plugins.draw.redemptionPage.sectionTitle')}>
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Icon icon={IconType.DRAW} className="animate-spin w-8 h-8" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <h2 className="text-xl font-medium mb-4">{t('plugins.draw.redemptionPage.holdings.title')}</h2>
                                    {nftHoldings.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {nftHoldings.map((nft) => (
                                                <div key={nft.id} className="border rounded-lg p-4">
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-2" />
                                                    <h3 className="font-medium">{nft.name}</h3>
                                                    <p className="text-sm text-gray-600">Quantity: {nft.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">{t('plugins.draw.redemptionPage.holdings.empty')}</p>
                                    )}
                                </Card>

                                <Card className="p-6">
                                    <h2 className="text-xl font-medium mb-4">{t('plugins.draw.redemptionPage.requirements.title')}</h2>
                                    {requirements.length > 0 ? (
                                        <div className="space-y-3">
                                            {requirements.map((req, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <h3 className="font-medium">NFT ID: {req.nftId}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            Required: {req.requiredQuantity}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        req.isMet 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {req.isMet 
                                                            ? t('plugins.draw.redemptionPage.requirements.met')
                                                            : t('plugins.draw.redemptionPage.requirements.notMet')
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">{t('plugins.draw.redemptionPage.requirements.empty')}</p>
                                    )}
                                </Card>

                                <div className="text-center">
                                    <Button size="lg" disabled={!requirements.some(req => req.isMet)}>
                                        {t('plugins.draw.redemptionPage.redeemButton')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </Page.MainSection>
        </Page.Main>
    );
};