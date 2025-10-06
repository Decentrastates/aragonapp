'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { Switch } from '@cddao/gov-ui-kit';
import type { ICreateDrawForm } from '../../../createDrawFormDefinitions';

export interface ITokenBSwitchProps {
  /**
   * 表单字段的前缀
   */
  fieldPrefix?: string;
  /**
   * 创建新ERC1155的默认值
   */
  defaultIsCreateNewErc1155?: boolean;
}

export const TokenBSwitch: React.FC<ITokenBSwitchProps> = (props) => {
  const { fieldPrefix, defaultIsCreateNewErc1155 } = props;

  const { t } = useTranslations();

  // 创建新ERC1155的开关字段，使用传入的默认值
  const isCreateNewNftField = useFormField<ICreateDrawForm, 'governance.isCreateNewErc1155'>('governance.isCreateNewErc1155', {
    label: t('app.plugins.draw.createDrawForm.step2.isCreateNewNft.label'),
    fieldPrefix,
    defaultValue: defaultIsCreateNewErc1155 ?? true,
  });

  return (
    <Switch
      checked={isCreateNewNftField.value}
      onCheckedChanged={isCreateNewNftField.onChange}
      label={isCreateNewNftField.label}
    />
  );
};