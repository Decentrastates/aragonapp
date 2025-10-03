'use client';

import type { ISetupBodyFormExisting } from '@/modules/createDao/dialogs/setupBodyDialog';
import { daoProcessDetailsClientUtils } from '@/modules/settings/pages/daoProcessDetailsPage';
import type { IPluginToFormDataParams } from '@/modules/settings/types';
import type { IDrawPluginSettings } from '@/plugins/drawPlugin/types';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { IDrawSetupMembershipForm } from '../../components/drawSetupMembership';

export interface IDrawPluginToFormDataParams extends IPluginToFormDataParams<IDrawPluginSettings> {}

export class DrawBodyUtils {
    pluginToFormData = (
        params: IDrawPluginToFormDataParams,
    ): ISetupBodyFormExisting<IDrawPluginSettings, ICompositeAddress, IDrawSetupMembershipForm> => {
        const { plugin } = params;

        return daoProcessDetailsClientUtils.bodyToFormDataDefault<IDrawPluginSettings, IDrawSetupMembershipForm>({
            plugin,
            membership: { members: [] },
        });
    };
}

export const drawBodyUtils = new DrawBodyUtils();