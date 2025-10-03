'use client';

import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Container } from '@/shared/components/container';
import { Card, Icon, IconType } from '@cddao/gov-ui-kit';
import { useDrawHistory } from '@/plugins/drawPlugin/hooks/useDrawHistory';

interface IDrawHistoryPageProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const DrawHistoryPage: React.FC<IDrawHistoryPageProps> = ({ daoId }) => {
    const { t } = useTranslations();
    const { history, isLoading } = useDrawHistory(daoId);

    return (
        <Page.Container>
            <Page.Header
                title={t('plugins.draw.historyPage.title')}
                description={t('plugins.draw.historyPage.description')}
            />
            <Page.MainSection title={t('plugins.draw.historyPage.title')}>
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Icon icon={IconType.DRAW} className="animate-spin w-8 h-8" />
                            </div>
                        ) : history && history.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {history.items.map((item) => (
                                    <Card key={item.id} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium">{item.rewardType}</h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">ID: {item.id}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Status:</span>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                item.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : item.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-8 text-center">
                                <Icon icon={IconType.WARNING} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium mb-2">{t('plugins.draw.historyPage.noHistory')}</h3>
                                <p className="text-gray-600">{t('plugins.draw.historyPage.noHistoryDescription')}</p>
                            </Card>
                        )}
                    </div>
                </Container>
            </Page.MainSection>
        </Page.Container>
    );
};