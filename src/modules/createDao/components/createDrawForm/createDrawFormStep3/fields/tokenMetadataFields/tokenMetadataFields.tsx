'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputNumber, InputText } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../../../createDrawFormDefinitions';
import { useMemo } from 'react';

export interface ITokenMetadataFieldsProps {
  /**
   * 表单字段的前缀
   */
  fieldPrefix?: string;
  /**
   * 是否显示代币元数据字段
   */
  showFields: boolean;
}

export const TokenMetadataFields: React.FC<ITokenMetadataFieldsProps> = (props) => {
  const { fieldPrefix, showFields } = props;

  const { t } = useTranslations();

  const tokenNameRules = useMemo(() => ({
    required: showFields ? t('app.plugins.draw.createDrawForm.step3.tokenName.required') : false,
  }), [showFields, t]);

  const tokenSymbolRules = useMemo(() => ({
    required: showFields ? t('app.plugins.draw.createDrawForm.step3.tokenSymbol.required') : false,
  }), [showFields, t]);

  const tokenDecimalsRules = useMemo(() => ({
    required: showFields ? t('app.plugins.draw.createDrawForm.step3.tokenDecimals.required') : false,
    min: 0,
    max: 18
  }), [showFields, t]);

  // 代币名称字段
  const tokenNameField = useFormField<ICreateDrawFormData, 'governance.tokenAMetaData.name'>('governance.tokenAMetaData.name', {
    label: t('app.plugins.draw.createDrawForm.step3.tokenName.label'),
    fieldPrefix,
    rules: tokenNameRules,
    defaultValue: '',
  });

  // 代币符号字段
  const tokenSymbolField = useFormField<ICreateDrawFormData, 'governance.tokenAMetaData.symbol'>('governance.tokenAMetaData.symbol', {
    label: t('app.plugins.draw.createDrawForm.step3.tokenSymbol.label'),
    fieldPrefix,
    rules: tokenSymbolRules,
    defaultValue: '',
  });

  // 代币小数位数字段
  const tokenDecimalsField = useFormField<ICreateDrawFormData, 'governance.tokenAMetaData.decimals'>('governance.tokenAMetaData.decimals', {
    label: t('app.plugins.draw.createDrawForm.step3.tokenDecimals.label'),
    fieldPrefix,
    rules: tokenDecimalsRules,
    defaultValue: 18,
  });

  if (!showFields) {
    return null;
  }

  return (
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
  );
};