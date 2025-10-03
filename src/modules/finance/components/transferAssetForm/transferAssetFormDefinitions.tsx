import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { IAssetInputFormData } from '../assetInput';

export interface ITransferAssetFormData extends IAssetInputFormData {
    /**
     * The address receiving the tokens.
     */
    receiver?: ICompositeAddress;
}
