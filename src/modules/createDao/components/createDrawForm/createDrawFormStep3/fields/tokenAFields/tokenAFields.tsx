'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../../../createDrawFormDefinitions';
import { useMemo } from 'react';

export interface ITokenAFieldsProps {
  /**
   * 表单字段的前缀
   */
  fieldPrefix?: string;
  /**
   * 是否显示Token A字段
   */
  showField: boolean;
  /**
   * 是否创建新代币
   */
  isCreateNewToken: boolean;
}

export const TokenAFields: React.FC<ITokenAFieldsProps> = (props) => {
  const { fieldPrefix, showField, isCreateNewToken } = props;

  const { t } = useTranslations();

  const tokenARules = useMemo(() => ({
    required: !isCreateNewToken ? t('app.plugins.draw.createDrawForm.step3.tokenA.required') : false,
    pattern: {
      value: /^0x[a-fA-F0-9]{40}$/,
      message: t('app.plugins.draw.createDrawForm.step3.tokenA.invalidAddress')
    }
  }), [isCreateNewToken, t]);

  // Token A字段
  const tokenAField = useFormField<ICreateDrawFormData, 'governance.tokenA'>('governance.tokenA', {
    label: t('app.plugins.draw.createDrawForm.step3.tokenA.label'),
    fieldPrefix,
    rules: tokenARules,
    defaultValue: '',
  });

  if (!showField) {
    return null;
  }

  return (
    <InputText 
      {...tokenAField} 
      placeholder={t('app.plugins.draw.createDrawForm.step3.tokenA.placeholder')}
    />
  );
};