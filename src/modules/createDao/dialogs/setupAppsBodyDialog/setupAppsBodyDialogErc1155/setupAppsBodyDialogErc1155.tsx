import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { PluginSingleComponent } from '@/shared/components/pluginSingleComponent';
import { useWatch } from 'react-hook-form';
import type { IAppsSetupBodyForm } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogErc1155Props {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const SetupAppsBodyDialogErc1155: React.FC<ISetupAppsBodyDialogErc1155Props> = (props) => {
    const selectedPlugin = useWatch<Record<string, IAppsSetupBodyForm['plugin']>>({ name: 'plugin' });
    const { daoId } = props;

    return (
        <PluginSingleComponent
            slotId={CreateDaoSlotId.CREATE_DAO_SETUP_ERC1155}
            pluginId={selectedPlugin}
            formPrefix="erc1155"
            daoId={daoId}
        />
    );
};
