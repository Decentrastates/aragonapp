'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import type { IWizardStepperStep } from '@/shared/components/wizards/wizard';
import { WizardPage } from '@/shared/components/wizards/wizardPage';
import { CreateDrawWizardStep } from './createDrawPageDefinitions';
import { CreateDrawForm } from '@/modules/createDao/components/createDrawForm';

export interface ICreateDrawPageClientStepsProps {
    /**
     * Steps of the wizard.
     */
    steps: IWizardStepperStep[];
    /**
     * The DAO ID.
     */
    daoId: string;
    /**
     * Plugin address used to create a proposal for adding a new draw.
     */
    pluginAddress: string;
}

export const CreateDrawPageClientSteps: React.FC<ICreateDrawPageClientStepsProps> = (props) => {
    const { steps, daoId } = props;
    console.log('CreateDrawPageClientSteps', { steps, daoId });

    const { t } = useTranslations();
    const [metadataStep, settingsStep, creationStep, permissionsStep] = steps;

    return (
        <>
            <WizardPage.Step
                title={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.METADATA}.title`)}
                description={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.METADATA}.description`)}
                {...metadataStep}
            >
                <CreateDrawForm.Step1 />
            </WizardPage.Step>
            <WizardPage.Step
                title={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.NFT_SETTINGS}.title`)}
                description={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.NFT_SETTINGS}.description`)}
                {...settingsStep}
            >
                <div className="flex flex-col gap-10">
                    {/* <CreateDrawForm.Governance daoId={daoId} /> */}
                    <CreateDrawForm.Step2 />
                </div>
            </WizardPage.Step>
            <WizardPage.Step
                title={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.TOKEN_SETTINGS}.title`)}
                description={t(
                    `app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.TOKEN_SETTINGS}.description`,
                )}
                {...creationStep}
            >
                <CreateDrawForm.Step3 />
            </WizardPage.Step>
            <WizardPage.Step
                title={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.DRAW_SETTINGS}.title`)}
                description={t(
                    `app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.DRAW_SETTINGS}.description`,
                )}
                {...permissionsStep}
            >
                <CreateDrawForm.Step4 />
            </WizardPage.Step>
        </>
    );
};