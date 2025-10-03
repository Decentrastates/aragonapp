import type { IWizardStepperStep } from '@/shared/components/wizards/wizard';

export enum CreateDrawWizardStep {
    METADATA = 'METADATA',
    NFT_SETTINGS = 'NFT_SETTINGS',
    TOKEN_SETTINGS = 'TOKEN_SETTINGS',
    DRAW_SETTINGS = 'DRAW_SETTINGS',
}

export const createDrawWizardSteps: IWizardStepperStep[] = [
    {
        id: CreateDrawWizardStep.METADATA,
        order: 0,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.METADATA.name',
            title: 'app.plugins.draw.createDrawPage.steps.METADATA.title',
            description: 'app.plugins.draw.createDrawPage.steps.METADATA.description',
        },
    },
    {
        id: CreateDrawWizardStep.NFT_SETTINGS,
        order: 1,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.NFT_SETTINGS.name',
            title: 'app.plugins.draw.createDrawPage.steps.NFT_SETTINGS.title',
            description: 'app.plugins.draw.createDrawPage.steps.NFT_SETTINGS.description',
        },
    },
    {
        id: CreateDrawWizardStep.TOKEN_SETTINGS,
        order: 2,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.name',
            title: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.title',
            description: 'app.plugins.draw.createDrawPage.steps.TOKEN_SETTINGS.description',
        },
    },
    {
        id: CreateDrawWizardStep.DRAW_SETTINGS,
        order: 3,
        meta: {
            name: 'app.plugins.draw.createDrawPage.steps.DRAW_SETTINGS.name',
            title: 'app.plugins.draw.createDrawPage.steps.DRAW_SETTINGS.title',
            description: 'app.plugins.draw.createDrawPage.steps.DRAW_SETTINGS.description',
        },
    },
];