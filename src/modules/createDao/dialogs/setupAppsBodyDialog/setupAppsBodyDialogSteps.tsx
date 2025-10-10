import { WizardDialog } from '@/shared/components/wizards/wizardDialog';
import { daoUtils } from '@/shared/utils/daoUtils';
import { useWatch } from 'react-hook-form';
import type { IAppsSetupBodyForm } from './setupAppsBodyDialogDefinitions';
import { SetupAppsBodyDialogDraw } from './setupAppsBodyDialogDraw';
import { SetupAppsBodyDialogErc1155 } from './setupAppsBodyDialogErc1155';
import { SetupAppsBodyDialogErc20 } from './setupAppsBodyDialogErc20';
import { SetupAppsBodyDialogMetadata } from './setupAppsBodyDialogMetadata';
import { externalPluginId, SetupAppsBodyDialogSelect } from './setupAppsBodyDialogSelect';

export interface ISetupAppsBodyDialogStepsProps {
    /**
     * Initial values for the form.
     */
    initialValues?: IAppsSetupBodyForm;
    /**
     * Defines if the body is being added to the governance process as a sub-plugin or not.
     */
    isSubPlugin?: boolean;
    /**
     * ID of the DAO.
     */
    daoId: string;

    appsCategory: string;
}

const setupAppsBodySteps = [
    { id: 'select', order: 1, meta: { name: '' } },
    { id: 'metadata', order: 2, meta: { name: '' } },
    { id: 'erc20', order: 2, meta: { name: '' } },
    { id: 'erc1155', order: 3, meta: { name: '' } },
    { id: 'ico', order: 4, meta: { name: '' } },
    { id: 'draw', order: 4, meta: { name: '' } },
];

export const SetupAppsBodyDialogSteps: React.FC<ISetupAppsBodyDialogStepsProps> = (props) => {
    const { initialValues, isSubPlugin, daoId, appsCategory} = props;
    console.log('SetupAppsBodyDialogSteps-1111111', props);

    const selectedPlugin = useWatch<IAppsSetupBodyForm, 'plugin'>({ name: 'plugin' });
    const isExternalPlugin = selectedPlugin === externalPluginId;
    const isErc20 = appsCategory === 'ICO' || appsCategory === 'DRAW';
    const isDraw = appsCategory === 'DRAW';
    const isErc1155 = appsCategory === 'DRAW';
    const isIco = appsCategory === 'ICO';

    const [selectStep, metadataStep, erc20Step, erc1155Step, icoStep, drawStep] = setupAppsBodySteps;

    const { network } = daoUtils.parseDaoId(daoId);

    console.log('SetupAppsBodyDialogSteps 2', selectedPlugin, isExternalPlugin, setupAppsBodySteps, network);

    return (
        <>
            <WizardDialog.Step {...selectStep} hidden={initialValues != null}>
                <SetupAppsBodyDialogSelect isSubPlugin={isSubPlugin} network={network} appsCategory={appsCategory} />
            </WizardDialog.Step>
            <WizardDialog.Step {...metadataStep} hidden={!isSubPlugin || isExternalPlugin}>
                <SetupAppsBodyDialogMetadata />
            </WizardDialog.Step>
            <WizardDialog.Step {...erc20Step} hidden={!isErc20}>
                <SetupAppsBodyDialogErc20 daoId={daoId} />
            </WizardDialog.Step>
            <WizardDialog.Step {...erc1155Step} hidden={!isErc1155}>
                <SetupAppsBodyDialogErc1155 daoId={daoId} />
            </WizardDialog.Step>
            <WizardDialog.Step {...icoStep} hidden={!isIco}>
                <SetupAppsBodyDialogDraw daoId={daoId} />
            </WizardDialog.Step>
            <WizardDialog.Step {...drawStep} hidden={!isDraw}>
                <SetupAppsBodyDialogDraw daoId={daoId} />
            </WizardDialog.Step>
        </>
    );
};
