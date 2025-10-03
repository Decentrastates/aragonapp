'use client';

import { type ISetupBodyFormExisting, type ISetupBodyFormNew } from '@/modules/createDao/dialogs/setupBodyDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import { formatterUtils, NumberFormat } from '@cddao/gov-ui-kit';
import type { IDrawSetupGovernanceForm } from '../../types';

interface ICompositeAddress {
    address: string;
}

export interface IDrawProcessBodyFieldProps {
    /**
     * The body to display the details for.
     */
    body:
        | ISetupBodyFormNew<IDrawSetupGovernanceForm, ICompositeAddress>
        | ISetupBodyFormExisting<IDrawSetupGovernanceForm, ICompositeAddress>;
    /**
     * ID of the DAO.
     */
    daoId: string;
    /**
     * Value of the field.
     */
    value: Record<string, unknown>;
}

export const DrawProcessBodyField: React.FC<IDrawProcessBodyFieldProps> = (props) => {
    const { value } = props;
    
    const { t } = useTranslations();
    
    // Extract relevant fields from the value object
    const eligibleToken = value.eligibleToken as string || '';
    const minTokenAmount = value.minTokenAmount as string || '0';
    const drawInterval = value.drawInterval as number || 0;
    
    const formattedMinAmount = formatterUtils.formatNumber(minTokenAmount, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    });
    
    // Convert drawInterval from seconds to a more readable format
    const drawIntervalHours = Math.floor(drawInterval / 3600);
    const drawIntervalDays = Math.floor(drawIntervalHours / 24);
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <span className="text-neutral-500">
                    {t('app.plugins.draw.drawProcessBodyField.eligibleToken')}
                </span>
                <span className="font-medium text-neutral-800">
                    {eligibleToken}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-500">
                    {t('app.plugins.draw.drawProcessBodyField.minTokenAmount')}
                </span>
                <span className="font-medium text-neutral-800">
                    {formattedMinAmount}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-500">
                    {t('app.plugins.draw.drawProcessBodyField.drawInterval')}
                </span>
                <span className="font-medium text-neutral-800">
                    {drawIntervalDays > 0 
                        ? t('app.plugins.draw.drawProcessBodyField.days', { count: drawIntervalDays })
                        : t('app.plugins.draw.drawProcessBodyField.hours', { count: drawIntervalHours })}
                </span>
            </div>
        </div>
    );
};