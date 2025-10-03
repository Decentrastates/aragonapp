'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';
import type { IDrawExtendedFields } from '../../../createDrawFormDefinitions';
import { useEffect } from 'react';

export interface ITokenBFieldsProps {
  /**
   * Prefix to prepend to all the form fields.
   */
  fieldPrefix?: string;
  /**
   * Whether to show the token B field
   */
  showField: boolean;
  /**
   * Whether creating a new NFT
   */
  isCreateNewNft: boolean;
  /**
   * Reset counter to trigger field reset
   */
  resetCounter?: number;
}

export const TokenBFields: React.FC<ITokenBFieldsProps> = (props) => {
  const { fieldPrefix, showField, isCreateNewNft, resetCounter } = props;

  const { t } = useTranslations();

  const tokenBRules = {
    required: !isCreateNewNft ? t('app.plugins.draw.createDrawForm.step2.tokenB.required') : false,
    pattern: {
      value: /^0x[a-fA-F0-9]{40}$/,
      message: t('app.plugins.draw.createDrawForm.step2.tokenB.invalidAddress'),
    },
  };

  const tokenBField = useFormField<IDrawExtendedFields, 'tokenB'>('tokenB', {
    label: t('app.plugins.draw.createDrawForm.step2.tokenB.label'),
    fieldPrefix,
    rules: tokenBRules,
    defaultValue: '',
  });

  // Effect to reset field when resetCounter changes
  useEffect(() => {
    tokenBField.onChange('');
  }, [resetCounter]);

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