import { daoProcessDetailsClientUtils } from '@/modules/settings/pages/daoProcessDetailsPage';
import { useDao } from '@/shared/api/daoService';
import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { WizardDialog } from '@/shared/components/wizards/wizardDialog';
import { addressUtils, invariant } from '@cddao/gov-ui-kit';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { BodyType } from '../../types/enum';
import { type IAppsSetupBodyForm } from './setupAppsBodyDialogDefinitions';
import { SetupAppsBodyDialogSteps, type ISetupAppsBodyDialogStepsProps } from './setupAppsBodyDialogSteps';

export interface ISetupAppsBodyDialogParams extends ISetupAppsBodyDialogStepsProps {
    /**
     * Callback called on submit.
     */
    onSubmit: (values: IAppsSetupBodyForm) => void;
}

export interface ISetupAppsBodyDialogProps extends IDialogComponentProps<ISetupAppsBodyDialogParams> {}

export const SetupAppsBodyDialog: React.FC<ISetupAppsBodyDialogProps> = (props) => {
    const { location } = props;
    console.log('SetupAppsBodyDialog 666666666666', props);

    invariant(location.params != null, 'SetupAppsBodyDialog: required parameters must be set.');
    const { onSubmit, initialValues, isSubPlugin, daoId, appsCategory } = location.params;

    const { t } = useTranslations();
    const { address } = useAccount();

    const { data: dao } = useDao({ urlParams: { id: daoId } });

    const processedInitialValues = useMemo(() => {
        if (initialValues?.type === BodyType.EXTERNAL || initialValues?.membership.members.length) {
            return initialValues;
        }

        return { ...initialValues, membership: { ...initialValues?.membership, members: [{ address }] } };
    }, [initialValues, address]);

    const handleSubmit = (values: IAppsSetupBodyForm) => {
        if (values.type === BodyType.EXTERNAL) {
            const existingPlugin = dao?.plugins.find((plugin) =>
                addressUtils.isAddressEqual(plugin.address, values.address),
            );

            const processedValues = existingPlugin
                ? daoProcessDetailsClientUtils.bodyToFormData({ plugin: existingPlugin, membership: { members: [] } })
                : values;

            onSubmit(processedValues);
        } else {
            onSubmit(values);
        }
    };

    return (
        <WizardDialog.Container
            title={t('app.createDao.setupAppsBodyDialog.title')}
            formId="bodySetup"
            onSubmit={handleSubmit}
            defaultValues={processedInitialValues}
            submitLabel={t('app.createDao.setupBodyDialog.submit')}
        >
            <SetupAppsBodyDialogSteps initialValues={initialValues} daoId={daoId} isSubPlugin={isSubPlugin} appsCategory={appsCategory} />
        </WizardDialog.Container>
    );
};
