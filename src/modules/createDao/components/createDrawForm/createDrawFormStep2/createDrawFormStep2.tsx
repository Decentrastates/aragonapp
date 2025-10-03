'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { IDrawExtendedFields } from '../createDrawFormDefinitions';
import { CreateNewNftSwitch } from './fields/createNewNftSwitch';
import { CreateNewNftFields } from './fields/createNewNftFields';
import { TokenBFields } from './fields/tokenBFields';
// import { NftMetadataFields } from './fields/nftMetadataFields';
import { useEffect, useRef, useState } from 'react';

export interface ICreateNewNftSwitchProps {
  /**
   * Prefix to prepend to all the form fields.
   */
  fieldPrefix?: string;
}

export const CreateDrawFormStep2: React.FC<ICreateNewNftSwitchProps> = (props) => {
  const { fieldPrefix } = props;

  const { t } = useTranslations();

  const isCreateNewNftField = useFormField<IDrawExtendedFields, 'isCreateNewNft'>('isCreateNewNft', {
    label: t('app.plugins.draw.createDrawForm.step2.isCreateNewNft.label'),
    fieldPrefix,
    defaultValue: true,
  });

  // Token B field
  const tokenBField = useFormField<IDrawExtendedFields, 'tokenB'>('tokenB', {
    label: t('app.plugins.draw.createDrawForm.step2.tokenB.label'),
    fieldPrefix,
    defaultValue: '',
  });

  // NFT URI field
  const erc1155UriField = useFormField<IDrawExtendedFields, 'erc1155Uri'>('erc1155Uri', {
    label: t('app.plugins.draw.createDrawForm.step2.nftUri.label'),
    fieldPrefix,
    defaultValue: '',
  });

  // Refs for fields to avoid dependency issues
  const tokenBFieldRef = useRef(tokenBField);
  const erc1155UriFieldRef = useRef(erc1155UriField);

  // Update refs when fields change
  useEffect(() => {
    tokenBFieldRef.current = tokenBField;
    erc1155UriFieldRef.current = erc1155UriField;
  }, [tokenBField, erc1155UriField]);

  // State to trigger NFT fields reset
  const [resetNftFields, setResetNftFields] = useState(0);

  // State to trigger token B field reset
  const [resetTokenBField, setResetTokenBField] = useState(0);

  // Refs to track the previous values
  const prevIsCreateNewNftRef = useRef<boolean | undefined>(undefined);

  // Effect to handle field resets when switching between create new NFT and use existing NFT
  useEffect(() => {
    // Skip on initial render
    if (prevIsCreateNewNftRef.current === undefined) {
      prevIsCreateNewNftRef.current = isCreateNewNftField.value;
      return;
    }

    // Only reset when user actively changes the toggle
    if (prevIsCreateNewNftRef.current !== isCreateNewNftField.value) {
      if (isCreateNewNftField.value === true) {
        // When switching to create new NFT, clear token B field
        tokenBFieldRef.current.onChange('');
        // Increment token B field reset counter
        setResetTokenBField(prev => prev + 1);
        // Increment NFT fields reset counter
        setResetNftFields(prev => prev + 1);
      } else {
        // When switching to use existing NFT, clear NFT related fields
        erc1155UriFieldRef.current.onChange('');
        // Increment NFT metadata reset counter
        // setResetNftMetadata(prev => prev + 1);
      }
    }

    // Update the previous value
    prevIsCreateNewNftRef.current = isCreateNewNftField.value;
  }, [isCreateNewNftField.value]); // Now the dependencies are correct

  return (
    <div className="flex w-full flex-col gap-6">
      <CreateNewNftSwitch fieldPrefix={fieldPrefix} />

      <CreateNewNftFields 
        fieldPrefix={fieldPrefix} 
        showFields={isCreateNewNftField.value !== false} 
        resetCounter={resetNftFields}
      />
{/*       
      <NftMetadataFields 
        resetCounter={resetNftMetadata} 
      /> */}

      <TokenBFields 
        fieldPrefix={fieldPrefix} 
        showField={!(isCreateNewNftField.value !== false)} 
        isCreateNewNft={isCreateNewNftField.value !== false} 
        resetCounter={resetTokenBField}
      />
    </div>
  );
};