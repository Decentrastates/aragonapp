'use client';

import { type IDialogComponentProps } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { type IWizardDetailsDialogStep, WizardDetailsDialog } from '@/shared/components/wizardDetailsDialog';
import { invariant } from '@cddao/gov-ui-kit';

export interface ICreateDrawDetailsDialogParams {
    /**
     * URL of the DAO to create the draw plugin for.
     */
    daoUrl?: string;
    /**
     * Plugin address used to create a proposal for adding the draw plugin.
     */
    pluginAddress?: string;
    /**
     * Callback function to be called when the get started action is clicked.
     */
    onActionClick?: () => void;
}

export interface ICreateDrawDetailsDialogProps extends IDialogComponentProps<ICreateDrawDetailsDialogParams> {}

export const CreateDrawDetailsDialog: React.FC<ICreateDrawDetailsDialogProps> = (props) => {
    const { location } = props;
    const { id } = location;

    invariant(location.params != null, 'CreateAppsDetailsDialog: required parameters must be set.');
    const { daoUrl, pluginAddress, onActionClick } = location.params;

    const { t } = useTranslations();

    const steps: IWizardDetailsDialogStep[] = [
        {
            label: t('app.plugins.draw.createAppsDetailsDialog.steps.describe'),
            icon: 'LABELS',
        },
        {
            label: t('app.plugins.draw.createAppsDetailsDialog.steps.configureNft'),
            icon: 'USERS',
        },
        {
            label: t('app.plugins.draw.createAppsDetailsDialog.steps.configureRedemption'),
            icon: 'USERS',
        },
        // {
        //     label: t('app.plugins.draw.createAppsDetailsDialog.steps.configureDraw'),
        //     icon: 'SMART_CONTRACT',
        // },
    ];

    return (
        <WizardDetailsDialog
            title={t('app.plugins.draw.createAppsDetailsDialog.title')}
            description={t('app.plugins.draw.createAppsDetailsDialog.description')}
            steps={steps}
            actionLabel={t('app.plugins.draw.createAppsDetailsDialog.actionLabel')}
            onActionClick={onActionClick}
            wizardLink={pluginAddress && daoUrl ? `${daoUrl}/create/${pluginAddress}/apps` : undefined}
            // infoLink="https://docs.cddao.com/draw-plugin"
            dialogId={id}
        />
    );
};
