import { ResourcesInput } from '@/shared/components/forms/resourcesInput';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText, TextArea } from '@cddao/gov-ui-kit';
import { type ChangeEvent } from 'react';
import type { ICreateDrawFormData } from '../createDrawFormDefinitions';

export interface ICreateDrawFormStep1Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
    /**
     * Displays the process key field when set to true.
     * @default true
     */
    displayDrawKey?: boolean;
    /**
     * Plugin type to be used for form labels.
     * @default 'process'
     */
    pluginType?: 'plugin' | 'process';
}

const nameMaxLength = 40;
const drawKeyMaxLength = 5;
const summaryMaxLength = 480;

export const CreateDrawFormStep1: React.FC<ICreateDrawFormStep1Props> = (props) => {
    const { fieldPrefix, displayDrawKey = true, pluginType = 'plugin' } = props;

    const { t } = useTranslations();

    const nameField = useFormField<ICreateDrawFormData, 'name'>('name', {
        label: t('app.plugins.draw.createDrawForm.step1.name.label'),
        fieldPrefix,
        rules: { required: true, maxLength: nameMaxLength },
        trimOnBlur: true,
        defaultValue: '',
    });

    const { onChange: onDrawKeyChange, ...drawKeyField } = useFormField<ICreateDrawFormData, 'drawKey'>('drawKey', {
        label: t('app.plugins.draw.createDrawForm.step1.drawKey.label'),
        fieldPrefix,
        rules: { required: displayDrawKey, pattern: /^[A-Z]+$/, maxLength: drawKeyMaxLength },
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

    const handleKeyFieldChange = (event: ChangeEvent<HTMLInputElement>) =>
        onDrawKeyChange(event.target.value.toUpperCase());

    const typeLabel = t(`app.createDao.createProcessForm.metadata.type.${pluginType}`);

    return (
        <div className="flex w-full flex-col gap-10">
            <InputText
                maxLength={nameMaxLength}
                {...nameField}
                placeholder={t('app.plugins.draw.createDrawForm.step1.name.placeholder')}
            />
            {displayDrawKey && (
                <InputText
                    helpText={t('app.plugins.draw.createDrawForm.step1.drawKey.helpText')}
                    maxLength={drawKeyMaxLength}
                    onChange={handleKeyFieldChange}
                    {...drawKeyField}
                />
            )}
            <TextArea
                helpText={t('app.plugins.draw.createDrawForm.step1.description.helpText', { type: typeLabel })}
                maxLength={summaryMaxLength}
                isOptional={true}
                {...descriptionField}
                placeholder={t('app.plugins.draw.createDrawForm.step1.description.placeholder')}
            />
            <ResourcesInput
                name="resources"
                helpText={t('app.plugins.draw.createDrawForm.step1.resources.helpText', { type: typeLabel })}
                fieldPrefix={fieldPrefix}
            />
        </div>
    );
};
