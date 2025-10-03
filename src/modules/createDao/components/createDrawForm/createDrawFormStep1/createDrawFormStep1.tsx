import { ResourcesInput } from '@/shared/components/forms/resourcesInput';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText, TextArea } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../createDrawFormDefinitions';

export interface ICreateDrawFormStep1Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

const nameMaxLength = 40;
const summaryMaxLength = 480;

export const CreateDrawFormStep1: React.FC<ICreateDrawFormStep1Props> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    const nameField = useFormField<ICreateDrawFormData, 'name'>('name', {
        label: t('app.plugins.draw.createDrawForm.step1.name.label'),
        fieldPrefix,
        rules: { required: true, maxLength: nameMaxLength },
        trimOnBlur: true,
        defaultValue: '',
    });

    const descriptionField = useFormField<ICreateDrawFormData, 'description'>('description', {
        label: t('app.plugins.draw.createDrawForm.step1.description.label'),
        fieldPrefix,
        rules: { maxLength: summaryMaxLength },
        trimOnBlur: true,
        defaultValue: '',
    });

    return (
        <div className="flex w-full flex-col gap-10">
            <InputText 
                maxLength={nameMaxLength} 
                {...nameField} 
                placeholder={t('app.plugins.draw.createDrawForm.step1.name.placeholder')}
            />
            <TextArea
                helpText={t('app.plugins.draw.createDrawForm.step1.description.helpText')}
                maxLength={summaryMaxLength}
                isOptional={true}
                {...descriptionField}
                placeholder={t('app.plugins.draw.createDrawForm.step1.description.placeholder')}
            />
            <ResourcesInput
                name="resources"
                helpText={t('app.plugins.draw.createDrawForm.step1.resources.helpText')}
                fieldPrefix={fieldPrefix}
            />
        </div>
    );
};