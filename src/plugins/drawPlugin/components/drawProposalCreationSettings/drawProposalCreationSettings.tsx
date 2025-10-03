'use client';

import type { IPluginProposalCreationSettingsParams } from '@/modules/createDao/types';
import type { IDrawSetupGovernanceForm } from '../../types';
import type { IDrawSetupMembershipForm, IDrawSetupMembershipMember } from '../drawSetupMembership';
import { useTranslations } from '@/shared/components/translationsProvider';

export interface IDrawProposalCreationSettingsProps
    extends IPluginProposalCreationSettingsParams<
        IDrawSetupGovernanceForm,
        IDrawSetupMembershipMember,
        IDrawSetupMembershipForm
    > {
    /**
     * Current value of the settings.
     */
    value: Record<string, unknown>;
    /**
     * Callback to call when the value changes.
     */
    onChange: (value: Record<string, unknown>) => void;
}

export const DrawProposalCreationSettings: React.FC<IDrawProposalCreationSettingsProps> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, onChange, ...restProps } = props;
    
    const { t } = useTranslations();
    
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-neutral-800">
                {t('app.plugins.draw.drawProposalCreationSettings.title')}
            </h3>
            <p className="text-neutral-500">
                {t('app.plugins.draw.drawProposalCreationSettings.description')}
            </p>
            {/* Add any specific settings for draw plugin proposal creation here */}
        </div>
    );
};