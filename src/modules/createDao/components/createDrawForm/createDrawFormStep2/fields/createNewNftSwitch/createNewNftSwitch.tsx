'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { Switch } from '@cddao/gov-ui-kit';
import type { IDrawExtendedFields } from '../../../createDrawFormDefinitions';

export interface ICreateNewNftSwitchProps {
  /**
   * Prefix to prepend to all the form fields.
   */
  fieldPrefix?: string;
}

export const CreateNewNftSwitch: React.FC<ICreateNewNftSwitchProps> = (props) => {
  const { fieldPrefix } = props;

  const { t } = useTranslations();

  const isCreateNewNftField = useFormField<IDrawExtendedFields, 'isCreateNewNft'>('isCreateNewNft', {
    label: t('app.plugins.draw.createDrawForm.step2.isCreateNewNft.label'),
    fieldPrefix,
    defaultValue: true,
  });

  return (
    <Switch
      checked={isCreateNewNftField.value}
      onCheckedChanged={isCreateNewNftField.onChange}
      label={isCreateNewNftField.label}
    />
  );
};