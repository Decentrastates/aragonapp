import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { PluginSingleComponent } from '@/shared/components/pluginSingleComponent';
import { useWatch } from 'react-hook-form';
import type { IAppsSetupBodyForm } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogDrawProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const SetupAppsBodyDialogDraw: React.FC<ISetupAppsBodyDialogDrawProps> = (props) => {
    const selectedPlugin = useWatch<Record<string, IAppsSetupBodyForm['plugin']>>({ name: 'plugin' });
    const { daoId } = props;

    return (
        <PluginSingleComponent
            slotId={CreateDaoSlotId.CREATE_DAO_SETUP_DRAW}
            pluginId={selectedPlugin}
            formPrefix="draw"
            daoId={daoId}
        />
    );
};