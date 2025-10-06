'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { Switch } from '@cddao/gov-ui-kit';
import type { ICreateDrawFormData } from '../../../createDrawFormDefinitions';

export interface ITokenASwitchProps {
  /**
   * 表单字段的前缀
   */
  fieldPrefix?: string;
  /**
   * 创建新ERC20的默认值
   */
  defaultIsCreateNewErc20?: boolean;
}

export const TokenASwitch: React.FC<ITokenASwitchProps> = (props) => {
  const { fieldPrefix, defaultIsCreateNewErc20 } = props;

  const { t } = useTranslations();

  // 创建新ERC20的开关字段，使用传入的默认值
  const isCreateNewTokenField = useFormField<ICreateDrawFormData, 'governance.isCreateNewErc20'>('governance.isCreateNewErc20', {
    label: t('app.plugins.draw.createDrawForm.step3.isCreateNewToken.label'),
    fieldPrefix,
    defaultValue: defaultIsCreateNewErc20 ?? false,
  });

  return (
    <Switch
      checked={isCreateNewTokenField.value}
      onCheckedChanged={isCreateNewTokenField.onChange}
      label={isCreateNewTokenField.label}
    />
  );
};