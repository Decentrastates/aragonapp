import { Network, PluginInterfaceType } from '@/shared/api/daoService';
import { PluginType, PluginCategory, type IPluginInfo } from '@/shared/types';

export const icoPlugin: IPluginInfo = {
    id: PluginInterfaceType.TOKEN_ICO,
    subdomain: 'token-ico',
    name: 'Token Ico',
    installVersion: {
        release: 1,
        build: 1,
        releaseNotes: 'https://github.com/decentrastates/ico-plugin/releases/tag/v1.0.1',
        description: 'NFT抽奖和批量兑换插件',
    },
    repositoryAddresses: {
        [Network.ARBITRUM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.BASE_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ETHEREUM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ETHEREUM_SEPOLIA]: '0x75E5f0c46789c6ec68F7A3991332FE03d4E9af6c',
        [Network.POLYGON_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ZKSYNC_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ZKSYNC_SEPOLIA]: '0x0000000000000000000000000000000000000000',
        [Network.PEAQ_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.OPTIMISM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.CORN_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.CHILIZ_MAINNET]: '0x0000000000000000000000000000000000000000',
    },
    setup: {
        nameKey: 'app.plugins.ico.meta.setup.name',
        descriptionKey: 'app.plugins.ico.meta.setup.description',
        isActive: true,
    },
    type: PluginType.FEARTURE,
    category: PluginCategory.ICO,
};