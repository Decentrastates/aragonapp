import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { PluginSingleComponent } from '@/shared/components/pluginSingleComponent';
import { useWatch } from 'react-hook-form';
import type { IAppsSetupBodyForm } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogErc20Props {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const SetupAppsBodyDialogErc20: React.FC<ISetupAppsBodyDialogErc20Props> = (props) => {
    const selectedPlugin = useWatch<Record<string, IAppsSetupBodyForm['plugin']>>({ name: 'plugin' });
    const { daoId } = props;
    // console.log('SetupAppsBodyDialogErc20', selectedPlugin, props)

    return (
        <PluginSingleComponent
            slotId={CreateDaoSlotId.CREATE_DAO_SETUP_ERC20}
            pluginId={selectedPlugin}
            formPrefix="erc20"
            daoId={daoId}
        />
    );
};
