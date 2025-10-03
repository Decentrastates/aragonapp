'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import type { IDrawPlugin } from '../../types';

export interface IDrawGovernanceInfoProps {
    /**
     * Plugin to display governance info for.
     */
    plugin: IDrawPlugin;
}

export const DrawGovernanceInfo: React.FC<IDrawGovernanceInfoProps> = (props) => {
    const { plugin } = props;
    
    const { t } = useTranslations();
    
    const { drawInterval, nftCombos } = plugin.settings;
    
    // Convert drawInterval from seconds to a more readable format
    const drawIntervalHours = Number(drawInterval / BigInt(3600));
    const drawIntervalDays = Math.floor(drawIntervalHours / 24);
    
    const activeCombos = nftCombos.filter(combo => combo.isEnabled).length;
    
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-neutral-800">
                {t('app.plugins.draw.drawGovernanceInfo.title')}
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawGovernanceInfo.drawInterval')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {drawIntervalDays > 0 
                            ? t('app.plugins.draw.drawGovernanceInfo.days', { count: drawIntervalDays })
                            : t('app.plugins.draw.drawGovernanceInfo.hours', { count: drawIntervalHours })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawGovernanceInfo.activeCombos')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {activeCombos}
                    </span>
                </div>
            </div>
        </div>
    );
};