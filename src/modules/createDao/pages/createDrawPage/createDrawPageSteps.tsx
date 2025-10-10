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

    const { t } = useTranslations();
    const [metadataStep, settingsStep, creationStep] = steps;

    return (
        <>
            <WizardPage.Step
                title={t(`app.createDao.createAppsForm.apps.${CreateDrawWizardStep.METADATA.toLowerCase()}.title`)}
                description={t(`app.createDao.createAppsForm.apps.${CreateDrawWizardStep.METADATA.toLowerCase()}.description`)}
                {...metadataStep}
            >
                <CreateDrawForm.Step1 />
            </WizardPage.Step>
            <WizardPage.Step
                title={t(`app.createDao.createAppsForm.apps.${CreateDrawWizardStep.SETTINGS.toLowerCase()}.title`)}
                description={t(`app.createDao.createAppsForm.apps.${CreateDrawWizardStep.SETTINGS.toLowerCase()}.description`)}
                {...settingsStep}
            >
                <div className="flex flex-col gap-10">
                    <CreateDrawForm.Step2 daoId={daoId}/>
                </div>
            </WizardPage.Step>
            {/* <WizardPage.Step
                title={t(`app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.TOKEN_SETTINGS}.title`)}
                description={t(
                    `app.plugins.draw.createDrawPage.steps.${CreateDrawWizardStep.TOKEN_SETTINGS}.description`,
                )}
                {...creationStep}
            >
                <CreateDrawForm.Step3 />
            </WizardPage.Step> */}
            <WizardPage.Step
                title={t(`app.createDao.createAppsForm.apps.${CreateDrawWizardStep.PUBLISH.toLowerCase()}.title`)}
                description={t(
                    `app.createDao.createAppsForm.apps.${CreateDrawWizardStep.PUBLISH.toLowerCase()}.description`,
                )}
                {...creationStep}
            >
                <CreateDrawForm.Step4 />
            </WizardPage.Step>
        </>
    );
};