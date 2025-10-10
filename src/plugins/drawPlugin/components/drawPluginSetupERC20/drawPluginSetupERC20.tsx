'use client';

import type { ITokenPluginSettings } from '@/plugins/tokenPlugin/types/tokenPluginSettings';
import type { ITokenPluginSettingsToken } from '@/plugins/tokenPlugin/types/tokenPluginSettingsToken';
import { useDao } from '@/shared/api/daoService';
import { AddressesInput } from '@/shared/components/forms/addressesInput';
import { useTranslations } from '@/shared/components/translationsProvider';
import { InputContainer } from '@cddao/gov-ui-kit';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { IDrawPluginSetupERC20Props } from './drawPluginSetupERC20.api';

export const DrawPluginSetupERC20: React.FC<IDrawPluginSetupERC20Props> = (props) => {
    const { formPrefix, disabled, hideLabel, daoId } = props;

    const { t } = useTranslations();
    const { data: dao } = useDao({ urlParams: { id: daoId! } }, { enabled: !!daoId });
    const { setValue, watch } = useFormContext();

    const [addressOptions, setAddressOptions] = useState<Array<{ label: string; value: string }>>([]);

    // Process assets into address options
    useEffect(() => {
        if (!dao) {return;}

        const tokenVotingPlugins = dao.plugins
            .filter((plugin) => plugin.interfaceType === 'tokenVoting')
            .map((plugin) => {
                // 类型断言确保我们只对正确的插件类型访问 token 属性
                const tokenPluginSettings = plugin.settings as ITokenPluginSettings;
                const token: ITokenPluginSettingsToken = tokenPluginSettings.token;

                return {
                    label: `${token.name} (${token.address})`,
                    value: token.address,
                };
            });

        setAddressOptions(tokenVotingPlugins);
    }, [dao]);

    // Set default value when addressOptions are loaded
    useEffect(() => {
        if (addressOptions.length > 0) {
            // Check if a value is already set
            const addressField = `${formPrefix}.address`;
            const currentValue = watch(addressField) as string | undefined;
            
            // If no value is set, use the first option as default
            if (!currentValue) {
                setValue(addressField, addressOptions[0].value);
                
                // Also set the name field
                const nameField = `${formPrefix}.name`;
                setValue(nameField, addressOptions[0].label);
            }
        }
    }, [addressOptions, formPrefix, setValue, watch]);

    return (
        <InputContainer
            id="drawPluginSetupERC20"
            label={!hideLabel ? t('app.createDao.setupAppsBodyDialog.erc20.label') : undefined}
            helpText={!hideLabel ? t('app.createDao.setupAppsBodyDialog.erc20.helpText') : undefined}
            useCustomWrapper={true}
        >
            <AddressesInput.SelectItem
                index={0}
                disabled={disabled}
                formPrefix={formPrefix}
                addressOptions={addressOptions}
            />
        </InputContainer>
    );
};