'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { IDrawPluginSettings } from '../../types';

export interface IDrawMemberInfoProps {
    /**
     * Plugin to display member info for.
     */
    plugin: IDaoPlugin<IDrawPluginSettings>;
}

export const DrawMemberInfo: React.FC<IDrawMemberInfoProps> = (props) => {
    const { plugin } = props;
    
    const { t } = useTranslations();
    
    const { minTokenAmount, isErc1155Eligible } = plugin.settings;
    
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-neutral-800">
                {t('app.plugins.draw.drawMemberInfo.title')}
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawMemberInfo.minTokenAmount')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {minTokenAmount.toString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawMemberInfo.isErc1155Eligible')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {isErc1155Eligible 
                            ? t('app.plugins.draw.drawMemberInfo.yes')
                            : t('app.plugins.draw.drawMemberInfo.no')}
                    </span>
                </div>
            </div>
        </div>
    );
};