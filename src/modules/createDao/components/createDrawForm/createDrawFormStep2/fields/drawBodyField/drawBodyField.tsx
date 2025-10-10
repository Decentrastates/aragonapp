import { CreateDaoDialogId } from '@/modules/createDao/constants/createDaoDialogId';
import type { ISetupBodyDialogParams, ISetupBodyForm } from '@/modules/createDao/dialogs/setupBodyDialog';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { Button, IconType, InputContainer } from '@cddao/gov-ui-kit';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import type { ICreateAppFormData } from '../../../createDrawFormDefinitions';
import { AppsBodyField } from '../appsBodyField';

export interface IDrawBodyFieldProps {
    /**
     * ID of the DAO to setup the body for.
     */
    daoId: string;
    /**
     * If the component field is read-only.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Name of the body field.
     */
    appsCategory: string;
}

export const DrawBodyField: React.FC<IDrawBodyFieldProps> = (props) => {
    const { daoId, readOnly = false, appsCategory } = props;

    const { t } = useTranslations();
    const { open, close } = useDialogContext();

    const requiredErrorMessage = `app.createDao.createAppsForm.apps.${appsCategory.toLowerCase()}BodyField.required`;
    const {
        value: body,
        onChange: onBodyChange,
        onBlur: onBodyBlur,
        ...bodyField
    } = useFormField<Record<string, ISetupBodyForm | undefined>, 'body'>('body', {
        label: t(`app.createDao.createAppsForm.apps.${appsCategory.toLowerCase()}BodyField.label`),
        rules: { required: { value: true, message: requiredErrorMessage } },
    });

    const appName = useWatch<ICreateAppFormData, 'name'>({ name: 'name' });

    const handleBodySubmit = (values: ISetupBodyForm) => {
        const bodyId = crypto.randomUUID();
        onBodyChange({ ...values, internalId: bodyId, name: appName, canCreateProposal: true });
        close();
    };

    const openSetupDialog = () => {
        const onSubmit = handleBodySubmit;
        const params: ISetupBodyDialogParams = { onSubmit, initialValues: body, isSubPlugin: false, daoId, appsCategory };
        open(CreateDaoDialogId.SETUP_APPS_BODY, { params });
    };

    // Set body to null instead of undefined to make sure react-hook-form library triggers a rerender
    const handleDelete = () => onBodyChange(null);

    // Keep body-name & process-name in sync when setting up a simple governance process. Other metadata (description,
    // process-key, resources) is processed right before pinning the metadata for the simple governance process.
    useEffect(() => {
        if (readOnly || body == null || body.name === appName) {
            return;
        }

        onBodyChange({ ...body, name: appName });
    }, [body, onBodyChange, appName, readOnly]);

    console.log('DrawBodyField body', body);

    return (
        <InputContainer
            id="basicBody"
            helpText={t(`app.createDao.createAppsForm.apps.${appsCategory.toLowerCase()}BodyField.helpText`)}
            useCustomWrapper={true}
            {...bodyField}
        >
            {body != null && (
                <AppsBodyField
                    daoId={daoId}
                    fieldName="body"
                    body={body}
                    onEdit={openSetupDialog}
                    onDelete={handleDelete}
                    readOnly={readOnly}
                />
            )}
            {body == null && !readOnly && (
                <Button
                    size="md"
                    variant="tertiary"
                    className="w-fit"
                    iconLeft={IconType.PLUS}
                    onClick={() => openSetupDialog()}
                    type="button"
                >
                    {t('app.createDao.createProcessForm.governance.basicBodyField.action.add')}
                </Button>
            )}
        </InputContainer>
    );
};
