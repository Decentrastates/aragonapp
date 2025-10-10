'use client';

import { useProposalPermissionCheckGuard } from '@/modules/governance/hooks/useProposalPermissionCheckGuard';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { WizardPage } from '@/shared/components/wizards/wizardPage';
import { useMemo } from 'react';
import { type ICreateAppFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import { createDrawFormUtils } from '@/modules/createDao/components/createDrawForm/createDrawFormUtils';
import type { IPrepareDrawDialogParams } from '@/modules/createDao/dialogs/prepareDrawDialog/prepareDrawDialog.api';
import { createDrawWizardSteps } from './createDrawPageDefinitions';
import { CreateDrawPageClientSteps } from './createDrawPageSteps';
import { CreateDaoDialogId } from '../../constants/createDaoDialogId';

export interface ICreateDrawPageClientProps {
    /**
     * ID of the current DAO.
     */
    daoId: string;
    /**
     * Plugin address used to create a proposal for adding a new draw.
     */
    pluginAddress: string;
}

export const CreateDrawPageClient: React.FC<ICreateDrawPageClientProps> = (props) => {
    const { daoId, pluginAddress } = props;

    const { t } = useTranslations();
    const { open } = useDialogContext();

    useProposalPermissionCheckGuard({ daoId, pluginAddress, redirectTab: 'settings' });

    const handleFormSubmit = (values: ICreateAppFormData) => {
        const dialogParams: IPrepareDrawDialogParams = { daoId, values, pluginAddress };
        console.log('handleFormSubmit', dialogParams)
        open(CreateDaoDialogId.PREPARE_DRAW, { params: dialogParams });
    };

    const processedSteps = useMemo(
        () => createDrawWizardSteps.map(({ meta, ...step }) => ({ ...step, meta: { ...meta, name: t(meta.name) } })),
        [t],
    );

    // 明确指定默认值的类型以解决 ESLint 错误
    const defaultValues: ICreateAppFormData = createDrawFormUtils.buildDefaultData();
    // console.log('defaultValues', defaultValues)

    return (
        <Page.Main fullWidth={true}>
            <WizardPage.Container
                finalStep={t('app.plugins.draw.createDrawPage.finalStep')}
                submitLabel={t('app.plugins.draw.createDrawPage.submitLabel')}
                submitHelpText={t('app.plugins.draw.createDrawPage.submitHelpText')}
                initialSteps={processedSteps}
                onSubmit={handleFormSubmit}
                defaultValues={defaultValues}
            >
                <CreateDrawPageClientSteps steps={processedSteps} daoId={daoId} pluginAddress={pluginAddress} />
            </WizardPage.Container>
        </Page.Main>
    );
};