import { useWhitelistValidation } from '@/modules/createDao/hooks/useWhitelistValidation';
import type { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { IPluginInfo } from '@/shared/types';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { RadioCard, RadioGroup } from '@cddao/gov-ui-kit';
import { zeroAddress } from 'viem';
import { BodyType } from '../../../types/enum';
import type { IAppsSetupBodyForm } from '../setupAppsBodyDialogDefinitions';

export interface ISetupAppsBodyDialogSelectProps {
    /**
     * Defines if the body is being setup as a sub-plugin or not.
     */
    isSubPlugin?: boolean;
    /**
     * Network of the DAO.
     */
    network: Network;

    appsCategory: string;
}

export const externalPluginId = 'external';

export const SetupAppsBodyDialogSelect: React.FC<ISetupAppsBodyDialogSelectProps> = (props) => {
    const { isSubPlugin, network, appsCategory } = props;

    const { t } = useTranslations();

    const plugins = pluginRegistryUtils.getPlugins() as IPluginInfo[];
    console.log('SetupAppsBodyDialogSelect plugins', plugins, props);

    const availablePlugins = plugins
        .filter((plugin) => plugin.category === appsCategory)
        .filter((plugin) => {
            // keep only plugins that have a non-zero repository address for the current network
            return plugin.repositoryAddresses[network] !== zeroAddress;
        });
    console.log('SetupAppsBodyDialogSelect availablePlugins', availablePlugins);

    const { enabledPlugins, disabledPlugins } = useWhitelistValidation({ plugins: availablePlugins });
    console.log('SetupAppsBodyDialogSelect enabledPlugins', enabledPlugins);

    const { onChange: onPluginChange, ...governanceTypeField } = useFormField<IAppsSetupBodyForm, 'plugin'>('plugin', {
        label: t('app.createDao.setupAppsBodyDialog.select.plugin.label'),
        defaultValue: enabledPlugins[0]?.id,
    });

    const { onChange: onTypeChange } = useFormField<IAppsSetupBodyForm, 'type'>('type', {
        defaultValue: BodyType.NEW,
    });

    const handlePluginChange = (value: string) => {
        const bodyType = value === externalPluginId ? BodyType.EXTERNAL : BodyType.NEW;
        onTypeChange(bodyType);
        onPluginChange(value);
    };

    return (
        <RadioGroup
            helpText={t('app.createDao.setupAppsBodyDialog.select.plugin.helpText')}
            onValueChange={handlePluginChange}
            {...governanceTypeField}
        >
            {enabledPlugins.map((plugin) => (
                <RadioCard
                    key={plugin.id}
                    label={t(plugin.setup!.nameKey)}
                    description={t(plugin.setup!.descriptionKey)}
                    value={plugin.id}
                />
            ))}
            {isSubPlugin && (
                <RadioCard
                    label={t('app.createDao.setupAppsBodyDialog.select.external.label')}
                    description={t('app.createDao.setupAppsBodyDialog.select.external.description')}
                    value={externalPluginId}
                />
            )}
            {disabledPlugins.map((plugin) => (
                <RadioCard
                    key={plugin.id}
                    label={t(plugin.setup!.nameKey)}
                    description={t(plugin.setup!.descriptionKey)}
                    value={plugin.id}
                    disabled={true}
                    tag={{ variant: 'info', label: t('app.createDao.setupAppsBodyDialog.select.disabled.label') }}
                />
            ))}
        </RadioGroup>
    );
};
