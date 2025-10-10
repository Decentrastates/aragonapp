import type { IWizardStepperStep } from '@/shared/components/wizards/wizard';

export enum CreateDrawWizardStep {
    METADATA = 'METADATA',
    SETTINGS = 'SETTINGS',
    PUBLISH = 'PUBLISH',
}

export const createDrawWizardSteps: IWizardStepperStep[] = [
    {
        id: CreateDrawWizardStep.METADATA,
        order: 0,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.METADATA.name',
            // title: 'app.plugins.draw.createDrawPage.steps.METADATA.title',
            // description: 'app.plugins.draw.createDrawPage.steps.METADATA.description',
        },
    },
    {
        id: CreateDrawWizardStep.SETTINGS,
        order: 1,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.SETTINGS.name',
            // title: 'app.plugins.draw.createDrawPage.steps.SETTINGS.title',
            // description: 'app.plugins.draw.createDrawPage.steps.SETTINGS.description',
        },
    },
    // {
    //     id: CreateDrawWizardStep.TOKEN_SETTINGS,
    //     order: 2,
    //     meta: {
    //         name: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.name',
    //         // title: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.title',
    //         // description: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.description',
    //     },
    // },
    {
        id: CreateDrawWizardStep.PUBLISH,
        order: 3,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.PUBLISH.name',
            // title: 'app.plugins.draw.createDrawPage.steps.PUBLISH.title',
            // description: 'app.plugins.draw.createDrawPage.steps.PUBLISH.description',
        },
    },
];