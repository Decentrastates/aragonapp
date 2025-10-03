'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { InputText } from '@cddao/gov-ui-kit';
import type { IDrawExtendedFields } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import { useEffect, useRef } from 'react';

export interface ICreateNewNftFieldsProps {
  /**
   * Prefix to prepend to all the form fields.
   */
  fieldPrefix?: string;
  /**
   * Whether to show the new NFT fields
   */
  showFields: boolean;
  /**
   * Reset counter to trigger field reset
   */
  resetCounter?: number;
}

export const CreateNewNftFields: React.FC<ICreateNewNftFieldsProps> = (props) => {
  const { fieldPrefix, showFields, resetCounter } = props;

  const { t } = useTranslations();
  const prevResetCounterRef = useRef<number | undefined>(undefined);

  // NFT URI field
  const erc1155UriField = useFormField<IDrawExtendedFields, 'erc1155Uri'>('erc1155Uri', {
    label: t('app.plugins.draw.createDrawForm.step2.nftUri.label'),
    fieldPrefix,
    defaultValue: '',
  });

  // Effect to reset fields when resetCounter changes
  useEffect(() => {
    // Only reset when resetCounter actually changes (not on initial mount)
    if (prevResetCounterRef.current !== undefined && prevResetCounterRef.current !== resetCounter) {
      erc1155UriField.onChange('');
    }
    
    // Update the previous reset counter value
    prevResetCounterRef.current = resetCounter;
  }, [resetCounter]);

  if (!showFields) {
    return null;
  }

  return (
    <>
      <InputText
        {...erc1155UriField}
        placeholder={t('app.plugins.draw.createDrawForm.step2.nftUri.placeholder')}
        helpText={t('app.plugins.draw.createDrawForm.step2.nftUri.helpText')}
      />
    </>
  );
};