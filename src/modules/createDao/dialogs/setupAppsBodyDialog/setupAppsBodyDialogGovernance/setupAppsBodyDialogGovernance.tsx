import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { PluginSingleComponent } from '@/shared/components/pluginSingleComponent';
import { useWatch } from 'react-hook-form';
import type { IAppsSetupBodyForm, IAppsSetupBodyFormNew } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogGovernanceProps {
    /**
     * Renders the correct governance settings depending if the plugin is setup as a sub-plugin or not.
     */
    isSubPlugin?: boolean;
}

export const SetupAppsBodyDialogGovernance: React.FC<ISetupAppsBodyDialogGovernanceProps> = (props) => {
    const { isSubPlugin } = props;

    const selectedPlugin = useWatch<Record<string, IAppsSetupBodyForm['plugin']>>({ name: 'plugin' });

    const membershipSettings = useWatch<Record<string, IAppsSetupBodyFormNew['membership']>>({ name: 'membership' });

    return (
        <PluginSingleComponent
            slotId={CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE}
            pluginId={selectedPlugin}
            formPrefix="governance"
            isSubPlugin={isSubPlugin}
            showProposalCreationSettings={false}
            membershipSettings={membershipSettings}
        />
    );
};
