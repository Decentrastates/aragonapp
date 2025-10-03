import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import type { ICreateDrawFormData } from '../../components/createDrawForm/createDrawFormDefinitions';

export interface IPrepareDrawDialogParams {
    /**
     * Values of the create-draw form.
     */
    values: ICreateDrawFormData;
    /**
     * ID of the DAO to prepare the draw for.
     */
    daoId: string;
    /**
     * Plugin address used to create a proposal for adding a new draw.
     */
    pluginAddress: string;
}

export interface IPrepareDrawDialogProps extends IDialogComponentProps<IPrepareDrawDialogParams> {}