'use client';

import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFilterUrlParam } from '@/shared/hooks/useFilterUrlParam';
import { Tabs } from '@cddao/gov-ui-kit';
import type { IDrawPlugin, IDrawPluginSettings } from '../../types';

export interface IDrawMemberPanelProps {
    /**
     * DAO plugin to display the member panel for.
     */
    plugin: IDrawPlugin;
    /**
     * ID of the DAO with draw plugin.
     */
    daoId: string;
}

enum DrawMemberPanelTab {
    PARTICIPATE = 'participate',
    HISTORY = 'history',
}

const getTabsDefinitions = (settings: IDrawPluginSettings) => [
    { value: DrawMemberPanelTab.PARTICIPATE },
    { value: DrawMemberPanelTab.HISTORY },
];

export const drawMemberPanelFilterParam = 'memberPanel';

export const DrawMemberPanel: React.FC<IDrawMemberPanelProps> = (props) => {
    const { plugin, daoId } = props;

    const { t } = useTranslations();

    const visibleTabs = getTabsDefinitions(plugin.settings);

    const [selectedTab, setSelectedTab] = useFilterUrlParam({
        name: drawMemberPanelFilterParam,
        fallbackValue: DrawMemberPanelTab.PARTICIPATE,
        validValues: visibleTabs.map((tab) => tab.value),
    });

    return (
        <Page.AsideCard title={t('app.plugins.draw.drawMemberPanel.title')}>
            <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
                <Tabs.List className="pb-4">
                    {visibleTabs.map(({ value }) => (
                        <Tabs.Trigger
                            key={value}
                            label={t(`app.plugins.draw.drawMemberPanel.tabs.${value}`)}
                            value={value}
                        />
                    ))}
                </Tabs.List>
                <Tabs.Content value={DrawMemberPanelTab.PARTICIPATE}>
                    <div className="py-4">
                        <p>{t('app.plugins.draw.drawMemberPanel.participate.description')}</p>
                    </div>
                </Tabs.Content>
                <Tabs.Content value={DrawMemberPanelTab.HISTORY}>
                    <div className="py-4">
                        <p>{t('app.plugins.draw.drawMemberPanel.history.description')}</p>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </Page.AsideCard>
    );
};