'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../../../createDrawFormDefinitions';
import { useMemo } from 'react';

export interface ITokenBFieldsProps {
  /**
   * 表单字段的前缀
   */
  fieldPrefix?: string;
  /**
   * 是否显示Token B字段
   */
  showField: boolean;
  /**
   * 是否创建新NFT
   */
  isCreateNewNft: boolean;
}

export const TokenBFields: React.FC<ITokenBFieldsProps> = (props) => {
  const { fieldPrefix, showField, isCreateNewNft } = props;

  const { t } = useTranslations();

  const tokenBRules = useMemo(() => ({
    required: !isCreateNewNft ? t('app.plugins.draw.createDrawForm.step2.tokenB.required') : false,
    pattern: {
      value: /^0x[a-fA-F0-9]{40}$/,
      message: t('app.plugins.draw.createDrawForm.step2.tokenB.invalidAddress'),
    },
  }), [isCreateNewNft, t]);

  // Token B字段
  const tokenBField = useFormField<ICreateDrawFormData, 'governance.tokenB'>('governance.tokenB', {
    label: t('app.plugins.draw.createDrawForm.step2.tokenB.label'),
    fieldPrefix,
    rules: tokenBRules,
    defaultValue: '',
  });

  // 如果不显示字段，则返回null
  if (!showField) {
    return null;
  }

  return (
    <InputText
      {...tokenBField}
      placeholder={t('app.plugins.draw.createDrawForm.step2.tokenB.placeholder')}
    />
  );
};