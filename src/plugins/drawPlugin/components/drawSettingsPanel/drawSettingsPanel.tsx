'use client';

import { useTranslations } from '@/shared/components/translationsProvider';

export interface IDrawSettingsPanelProps {
    /**
     * Additional class names to apply to the component.
     */
    className?: string;
}

export const DrawSettingsPanel: React.FC<IDrawSettingsPanelProps> = (props) => {
    const { className } = props;
    const { t } = useTranslations();

    return (
        <div className={className}>
            <h2>{t('app.plugins.draw.settingsPanel.title')}</h2>
            <p>{t('app.plugins.draw.settingsPanel.description')}</p>
            {/* TODO: Implement draw settings panel UI */}
        </div>
    );
};
