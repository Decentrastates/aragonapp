import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputNumber, InputText, Switch } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../createDrawFormDefinitions';
import { useMemo } from 'react';

export interface ICreateDrawFormStep3Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const CreateDrawFormStep3: React.FC<ICreateDrawFormStep3Props> = (props) => {
    const { fieldPrefix } = props;

    const { t } = useTranslations();

    const isCreateNewTokenField = useFormField<ICreateDrawFormData, 'governance.isCreateNewToken'>('governance.isCreateNewToken', {
        label: t('app.plugins.draw.createDrawForm.step3.isCreateNewToken.label'),
        fieldPrefix,
        defaultValue: false,
    });

    const tokenARules = useMemo(() => ({
        required: !isCreateNewTokenField.value ? t('app.plugins.draw.createDrawForm.step3.tokenA.required') : false,
        pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: t('app.plugins.draw.createDrawForm.step3.tokenA.invalidAddress')
        }
    }), [isCreateNewTokenField.value, t]);

    const tokenNameRules = useMemo(() => ({
        required: isCreateNewTokenField.value ? t('app.plugins.draw.createDrawForm.step3.tokenName.required') : false,
    }), [isCreateNewTokenField.value, t]);

    const tokenSymbolRules = useMemo(() => ({
        required: isCreateNewTokenField.value ? t('app.plugins.draw.createDrawForm.step3.tokenSymbol.required') : false,
    }), [isCreateNewTokenField.value, t]);

    const tokenDecimalsRules = useMemo(() => ({
        required: isCreateNewTokenField.value ? t('app.plugins.draw.createDrawForm.step3.tokenDecimals.required') : false,
        min: 0,
        max: 18
    }), [isCreateNewTokenField.value, t]);

    // Token A settings (exchange token)
    const tokenAField = useFormField<ICreateDrawFormData, 'governance.tokenA'>('governance.tokenA', {
        label: t('app.plugins.draw.createDrawForm.step3.tokenA.label'),
        fieldPrefix,
        rules: tokenARules,
        defaultValue: '',
    });

    const tokenNameField = useFormField<ICreateDrawFormData, 'governance.tokenName'>('governance.tokenName', {
        label: t('app.plugins.draw.createDrawForm.step3.tokenName.label'),
        fieldPrefix,
        rules: tokenNameRules,
        defaultValue: '',
    });

    const tokenSymbolField = useFormField<ICreateDrawFormData, 'governance.tokenSymbol'>('governance.tokenSymbol', {
        label: t('app.plugins.draw.createDrawForm.step3.tokenSymbol.label'),
        fieldPrefix,
        rules: tokenSymbolRules,
        defaultValue: '',
    });

    const tokenDecimalsField = useFormField<ICreateDrawFormData, 'governance.tokenDecimals'>('governance.tokenDecimals', {
        label: t('app.plugins.draw.createDrawForm.step3.tokenDecimals.label'),
        fieldPrefix,
        rules: tokenDecimalsRules,
        defaultValue: '18',
    });

    return (
        <div className="flex w-full flex-col gap-6">
            <Switch 
                checked={isCreateNewTokenField.value}
                onCheckedChanged={isCreateNewTokenField.onChange}
                label={isCreateNewTokenField.label}
            />
            
            {isCreateNewTokenField.value ? (
                <>
                    <InputText 
                        {...tokenNameField} 
                        placeholder={t('app.plugins.draw.createDrawForm.step3.tokenName.placeholder')}
                    />
                    <InputText 
                        {...tokenSymbolField} 
                        placeholder={t('app.plugins.draw.createDrawForm.step3.tokenSymbol.placeholder')}
                    />
                    <InputNumber 
                        {...tokenDecimalsField} 
                        placeholder={t('app.plugins.draw.createDrawForm.step3.tokenDecimals.placeholder')}
                    />
                </>
            ) : (
                <InputText 
                    {...tokenAField} 
                    placeholder={t('app.plugins.draw.createDrawForm.step3.tokenA.placeholder')}
                />
            )}
        </div>
    );
};