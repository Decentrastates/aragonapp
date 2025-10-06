import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { ICreateDrawFormData } from '../createDrawFormDefinitions';
import { TokenASwitch } from './fields/tokenASwitch';
import { TokenAFields } from './fields/tokenAFields';
import { TokenMetadataFields } from './fields/tokenMetadataFields';

export interface ICreateDrawFormStep3Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const CreateDrawFormStep3: React.FC<ICreateDrawFormStep3Props> = (props) => {
    const { fieldPrefix } = props;
    // console.log('CreateDrawFormStep3 props', props)

    const { t } = useTranslations();

    // 创建新ERC20的开关字段，使用传入的默认值
    const isCreateNewTokenField = useFormField<ICreateDrawFormData, 'governance.isCreateNewErc20'>('governance.isCreateNewErc20', {
        label: t('app.plugins.draw.createDrawForm.step3.isCreateNewToken.label'),
        fieldPrefix,
        defaultValue: false,
    });
    // console.log('isCreateNewTokenField', isCreateNewTokenField)

    return (
        <div className="flex w-full flex-col gap-6">
            <TokenASwitch fieldPrefix={fieldPrefix} />
            <TokenMetadataFields showFields={isCreateNewTokenField.value !== false} fieldPrefix={fieldPrefix} />
            <TokenAFields 
                showField={!(isCreateNewTokenField.value !== false)} 
                isCreateNewToken={isCreateNewTokenField.value !== false} 
                fieldPrefix={fieldPrefix} 
            />
        </div>
    );
};