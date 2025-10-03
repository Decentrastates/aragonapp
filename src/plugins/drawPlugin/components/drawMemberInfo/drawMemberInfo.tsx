'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { formatterUtils, NumberFormat } from '@cddao/gov-ui-kit';
import type { IDrawPlugin } from '../../types';

export interface IDrawMemberInfoProps {
    /**
     * Plugin to display member info for.
     */
    plugin: IDrawPlugin;
}

export const DrawMemberInfo: React.FC<IDrawMemberInfoProps> = (props) => {
    const { plugin } = props;
    
    const { t } = useTranslations();
    
    const { eligibleToken, minTokenAmount } = plugin.settings;
    
    const formattedMinAmount = formatterUtils.formatNumber(minTokenAmount.toString(), {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    });
    
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-neutral-800">
                {t('app.plugins.draw.drawMemberInfo.title')}
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawMemberInfo.eligibleToken')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {eligibleToken}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500">
                        {t('app.plugins.draw.drawMemberInfo.minTokenAmount')}
                    </span>
                    <span className="font-medium text-neutral-800">
                        {formattedMinAmount}
                    </span>
                </div>
            </div>
        </div>
    );
};