'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Checkbox, InputText } from '@cddao/gov-ui-kit';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

// 定义表单字段类型
interface IERC1155FormFields {
    isCreateNewErc1155?: boolean;
    erc1155Address?: string;
    erc1155URI?: string;
}

export interface IDrawPluginSetupERC1155Props {
    /**
     * Prefix to be appended to all form fields.
     */
    formPrefix: string;
}

export const DrawPluginSetupERC1155: React.FC<IDrawPluginSetupERC1155Props> = (props) => {
    const { formPrefix } = props;
    
    const { t } = useTranslations();
    const { control, setValue } = useFormContext<IERC1155FormFields>();
    
    // Watch the isCreateNewErc1155 field
    const isCreateNewErc1155 = useWatch<IERC1155FormFields, 'isCreateNewErc1155'>({ 
        name: `${formPrefix}.isCreateNewErc1155` as 'isCreateNewErc1155',
        control
    });
    
    // Set default value for isCreateNewErc1155
    useEffect(() => {
        if (isCreateNewErc1155 === undefined) {
            setValue(`${formPrefix}.isCreateNewErc1155` as 'isCreateNewErc1155', false);
        }
    }, [isCreateNewErc1155, setValue, formPrefix]);
    
    return (
        <div className="flex flex-col gap-6">
            <Controller
                name={`${formPrefix}.isCreateNewErc1155` as 'isCreateNewErc1155'}
                control={control}
                render={({ field }) => {
                    // 从 field 中提取值并确保它是布尔类型
                    const checkedValue = Boolean(field.value);
                    
                    // 从 field 中移除可能引起类型冲突的属性
                    const { value: fieldValue, ...fieldProps } = field;
                    
                    return (
                        <Checkbox
                            {...fieldProps}
                            label={t('app.createDao.setupAppsBodyDialog.erc1155.createCheckbox.label')}
                            checked={checkedValue}
                            onCheckedChange={(checked) => field.onChange(checked)}
                        />
                    );
                }}
            />
            
            {!isCreateNewErc1155 ? (
                <Controller
                    name={`${formPrefix}.erc1155Address` as 'erc1155Address'}
                    control={control}
                    rules={{
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        required: isCreateNewErc1155 === false ? t('app.createDao.setupAppsBodyDialog.erc1155.address.required'): '',
                        pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/,
                            message: t('app.createDao.setupAppsBodyDialog.erc1155.address.invalid'),
                        },
                    }}
                    render={({ field, fieldState }) => {
                        // 确保错误消息是字符串类型
                        const errorMessage = fieldState.error?.message ?? '';
                        
                        return (
                            <InputText
                                {...field}
                                label={t('app.createDao.setupAppsBodyDialog.erc1155.address.label')}
                                placeholder={t('app.createDao.setupAppsBodyDialog.erc1155.address.placeholder')}
                                variant={fieldState.error ? 'critical' : 'default'}
                                alert={fieldState.error ? { message: errorMessage, variant: 'critical' } : undefined}
                            />
                        );
                    }}
                />
            ) : (
                <Controller
                    name={`${formPrefix}.erc1155URI` as 'erc1155URI'}
                    control={control}
                    rules={{
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        required: isCreateNewErc1155 ? (t('app.createDao.setupAppsBodyDialog.erc1155.uri.required')) : '',
                    }}
                    render={({ field, fieldState }) => {
                        // 确保错误消息是字符串类型
                        const errorMessage = fieldState.error?.message ?? '';
                        
                        return (
                            <InputText
                                {...field}
                                 label={t('app.createDao.setupAppsBodyDialog.erc1155.uri.label')}
                                 placeholder={t('app.createDao.setupAppsBodyDialog.erc1155.uri.placeholder')}
                                variant={fieldState.error ? 'critical' : 'default'}
                                alert={fieldState.error ? { message: errorMessage, variant: 'critical' } : undefined}
                            />
                        );
                    }}
                />
            )}
        </div>
    );
};