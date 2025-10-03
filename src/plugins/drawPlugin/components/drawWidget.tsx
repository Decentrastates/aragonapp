import type React from 'react';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Button, Card , Icon, IconType } from '@cddao/gov-ui-kit';
import { useDrawEligibility } from '../hooks/useDrawEligibility';
import { useDrawDialogs } from '../hooks/useDrawDialogs';

interface IDrawWidgetProps {
    daoId: string;
}

export const DrawWidget: React.FC<IDrawWidgetProps> = ({ daoId }) => {
    const { t } = useTranslations();
    const { isLoading, isEligible, eligibilityData } = useDrawEligibility(daoId);
    const { openParticipateDrawDialogWithDaoId } = useDrawDialogs();
    
    const handleDraw = () => {
        openParticipateDrawDialogWithDaoId(daoId);
    };
    
    if (isLoading) {
        return (
            <Card>
                <div className="flex justify-center items-center h-32">
                    <Icon icon={IconType.DRAW} className="animate-spin w-8 h-8" />
                </div>
            </Card>
        );
    }
    
    return (
        <Card>
            <div className="p-6">
                <h3 className="text-lg font-medium mb-4">{t('app.plugins.draw.widget.title')}</h3>
                {isEligible ? (
                    <div className="text-center">
                        <div className="mb-4">
                            <Icon icon={IconType.SUCCESS} className="text-green-500 w-12 h-12 mx-auto" />
                            <p className="mt-2 text-green-600 font-medium">
                                {t('app.plugins.draw.widget.eligible')}
                            </p>
                        </div>
                        <Button 
                            onClick={handleDraw} 
                            size="lg"
                            className="w-full"
                        >
                            {t('app.plugins.draw.widget.drawButton')}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-4">
                            <Icon icon={IconType.WARNING} className="text-red-500 w-12 h-12 mx-auto" />
                            <p className="mt-2 text-red-600 font-medium">
                                {t('app.plugins.draw.widget.notEligible')}
                            </p>
                            {eligibilityData?.reason && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {eligibilityData.reason}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>{t('app.plugins.draw.widget.tokenBalance')}</span>
                                <span className="font-medium">
                                    {eligibilityData?.tokenBalance ?? '0'} TOKEN
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('app.plugins.draw.widget.requiredBalance')}</span>
                                <span className="font-medium">100 TOKEN</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};