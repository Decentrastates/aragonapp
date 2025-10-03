'use client';

import { PageMainSection } from '@/shared/components/page/pageMainSection';
import { PageHeader } from '@/shared/components/page/pageHeader';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Container } from '@/shared/components/container';
import { Card, Icon, IconType, Button } from '@cddao/gov-ui-kit';
import { useState } from 'react';
import { useDrawEligibility } from '@/plugins/drawPlugin/hooks/useDrawEligibility';
import { useRequestDraw } from '@/plugins/drawPlugin/api';
import type { DrawResult } from '@/plugins/drawPlugin/api/drawService/domain';

interface IDrawParticipationPageProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const DrawParticipationPage: React.FC<IDrawParticipationPageProps> = ({ daoId }) => {
    const { t } = useTranslations();
    const { isLoading: isEligibilityLoading, isEligible, eligibilityData } = useDrawEligibility(daoId);
    const { mutate: requestDraw, isPending: isDrawing } = useRequestDraw(daoId);
    const [drawResult, setDrawResult] = useState<{ isWinner: boolean; reward?: string } | null>(null);

    const handleParticipate = () => {
        requestDraw(undefined, {
            onSuccess: (data: DrawResult) => {
                setDrawResult({
                    isWinner: data.isWinner,
                    reward: data.rewardAmount ? `${data.rewardAmount} ${data.rewardType ?? ''}` : undefined
                });
            }
        });
    };

    return (
        <div>
            <PageHeader
                title={t('plugins.draw.participationPage.title')}
                description={t('plugins.draw.participationPage.description')}
            />
            <PageMainSection title={t('plugins.draw.participationPage.title')}>
                <Container>
                    <div className="max-w-2xl mx-auto">
                        {isEligibilityLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Icon icon={IconType.DRAW} className="animate-spin w-8 h-8" />
                            </div>
                        ) : drawResult ? (
                            <Card className="p-8 text-center">
                                {drawResult.isWinner ? (
                                    <>
                                        <Icon icon={IconType.SUCCESS} className="w-16 h-16 mx-auto text-green-500 mb-4" />
                                        <h2 className="text-2xl font-bold mb-2">{t('plugins.draw.participationPage.result.win.title')}</h2>
                                        <p className="text-gray-600 mb-4">
                                            {t('plugins.draw.participationPage.result.win.description', { reward: drawResult.reward })}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon={IconType.WARNING} className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                                        <h2 className="text-2xl font-bold mb-2">{t('plugins.draw.participationPage.result.lose.title')}</h2>
                                        <p className="text-gray-600 mb-4">
                                            {t('plugins.draw.participationPage.result.lose.description')}
                                        </p>
                                    </>
                                )}
                                <Button onClick={() => setDrawResult(null)}>
                                    {t('plugins.draw.participationPage.result.tryAgain')}
                                </Button>
                            </Card>
                        ) : (
                            <Card className="p-6">
                                <div className="text-center mb-6">
                                    <Icon icon={IconType.DRAW} className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">{t('plugins.draw.participationPage.draw.title')}</h2>
                                    <p className="text-gray-600">
                                        {t('plugins.draw.participationPage.draw.description')}
                                    </p>
                                </div>

                                {isEligible ? (
                                    <div className="text-center">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                            <Icon icon={IconType.SUCCESS} className="w-8 h-8 mx-auto text-green-500 mb-2" />
                                            <p className="font-medium text-green-800">
                                                {t('plugins.draw.participationPage.eligible.message')}
                                            </p>
                                        </div>
                                        <Button 
                                            size="lg" 
                                            onClick={handleParticipate}
                                            disabled={isDrawing}
                                            className="w-full md:w-auto"
                                        >
                                            {isDrawing ? (
                                                <>
                                                    <Icon icon={IconType.DRAW} className="animate-spin mr-2 w-4 h-4" />
                                                    {t('plugins.draw.participationPage.draw.button.processing')}
                                                </>
                                            ) : (
                                                t('plugins.draw.participationPage.draw.button.participate')
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <Icon icon={IconType.WARNING} className="w-6 h-6 text-red-500 mr-2" />
                                                <h3 className="font-medium text-red-800">
                                                    {t('plugins.draw.participationPage.ineligible.title')}
                                                </h3>
                                            </div>
                                            <p className="text-red-700 mt-2 text-sm">
                                                {eligibilityData?.reason ?? t('plugins.draw.participationPage.ineligible.defaultReason')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-medium mb-2">{t('plugins.draw.participationPage.requirements.title')}</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>{t('plugins.draw.participationPage.requirements.tokenBalance')}</span>
                                                    <span className="font-medium">
                                                        {eligibilityData?.tokenBalance ?? '0'} TOKEN
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{t('plugins.draw.participationPage.requirements.requiredBalance')}</span>
                                                    <span className="font-medium">100 TOKEN</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </Container>
            </PageMainSection>
        </div>
    );
};