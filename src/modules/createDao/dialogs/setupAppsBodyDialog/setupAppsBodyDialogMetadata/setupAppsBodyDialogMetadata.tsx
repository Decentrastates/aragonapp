import { ResourcesInput } from '@/shared/components/forms/resourcesInput';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText, TextArea } from '@cddao/gov-ui-kit';
import type { IAppsSetupBodyForm } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogMetadataProps {}

const nameMaxLength = 40;
const summaryMaxLength = 480;

export const SetupAppsBodyDialogMetadata: React.FC<ISetupAppsBodyDialogMetadataProps> = () => {
    const { t } = useTranslations();

    const nameField = useFormField<IAppsSetupBodyForm, 'name'>('name', {
        label: t('app.createDao.setupBodyDialog.metadata.name.label'),
        trimOnBlur: true,
        defaultValue: '',
        rules: { required: true },
    });

    const summaryField = useFormField<IAppsSetupBodyForm, 'description'>('description', {
        label: t('app.createDao.setupBodyDialog.metadata.summary.label'),
        defaultValue: '',
    });

    return (
        <div className="flex flex-col gap-6">
            <InputText maxLength={nameMaxLength} {...nameField} />
            <TextArea
                helpText={t('app.createDao.setupBodyDialog.metadata.summary.helpText')}
                isOptional={true}
                maxLength={summaryMaxLength}
                {...summaryField}
            />
            <ResourcesInput
                name="resources"
                helpText={t('app.createDao.setupBodyDialog.metadata.resources.helpText')}
            />
        </div>
    );
};
