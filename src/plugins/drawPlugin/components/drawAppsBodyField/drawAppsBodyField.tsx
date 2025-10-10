/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { type IAppsSetupBodyFormExisting, type IAppsSetupBodyFormNew } from '@/modules/createDao/dialogs/setupAppsBodyDialog';
import { BodyType } from '@/modules/createDao/types/enum';
import { useTranslations } from '@/shared/components/translationsProvider';
import { DefinitionList, type ICompositeAddress } from '@cddao/gov-ui-kit';

export interface IDrawAppsBodyFieldProps {
    /**
     * The body to display the details for.
     */
    body:
        | IAppsSetupBodyFormNew<ICompositeAddress>
        | IAppsSetupBodyFormExisting<ICompositeAddress>;
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const DrawAppsBodyField = (props: IDrawAppsBodyFieldProps) => {
    const { body, daoId } = props;
    console.log('DrawAppsBodyField props', props)

    const { t } = useTranslations();
    const { erc20, erc1155, draw } = body;
    const isExisting = body.type === BodyType.EXISTING;

    const baseTranslationKey = 'app.plugins.draw.drawAppsBodyField';

    const initialParams = {
        queryParams: { daoId, pluginAddress: isExisting ? body.address : '' },
    };

    return (
        <DefinitionList.Container className="w-full" >
            ERC20: 
            ERC1155:
            DRAW:
        </DefinitionList.Container>
    );
};
