'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';
import type { ICreateDrawForm } from '../../../createDrawFormDefinitions';
import { useMemo } from 'react';

export interface ITokenBMetadataFieldsProps {
  /**
   * Prefix to prepend to all the form fields.
   */
  fieldPrefix?: string;
  /**
   * Whether to show the NFT metadata fields
   */
  showFields: boolean;
}

export const TokenBMetadataFields: React.FC<ITokenBMetadataFieldsProps> = (props) => {
  const { fieldPrefix, showFields } = props;

  const { t } = useTranslations();

  const erc1155UriRules = useMemo(() => ({
    required: showFields ? t('app.plugins.draw.createDrawForm.step2.nftUri.required') : false,
  }), [showFields, t]);

  const erc1155UriField = useFormField<ICreateDrawForm, 'governance.tokenBMetaData.erc1155Uri'>('governance.tokenBMetaData.erc1155Uri', {
    label: t('app.plugins.draw.createDrawForm.step2.nftUri.label'),
    fieldPrefix,
    rules: erc1155UriRules,
    defaultValue: '',
  });

  if (!showFields) {
    return null;
  }

  return (
    <InputText
      {...erc1155UriField}
      placeholder={t('app.plugins.draw.createDrawForm.step2.nftUri.placeholder')}
    />
  );
};