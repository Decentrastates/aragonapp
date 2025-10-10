'use client';

import type { ISetupBodyFormExisting } from '@/modules/createDao/dialogs/setupBodyDialog';
import { daoProcessDetailsClientUtils } from '@/modules/settings/pages/daoProcessDetailsPage';
import type { IPluginToFormDataParams } from '@/modules/settings/types';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { IcoPluginSettings } from '../../types/icoTypes';

export interface IIcoPluginToFormDataParams extends IPluginToFormDataParams<IcoPluginSettings> {}

export class IcoBodyUtils {
    pluginToFormData = (
        params: IIcoPluginToFormDataParams,
    ): ISetupBodyFormExisting<IcoPluginSettings, ICompositeAddress, any> => {
        const { plugin } = params;

        return daoProcessDetailsClientUtils.bodyToFormDataDefault<IcoPluginSettings, any>({
            plugin,
            membership: { members: [] },
        });
    };
}

export const icoBodyUtils = new IcoBodyUtils();