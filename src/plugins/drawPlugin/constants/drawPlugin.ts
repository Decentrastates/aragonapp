import { Network, PluginInterfaceType } from '@/shared/api/daoService';
import type { IPluginInfo } from '@/shared/types';

export const drawPlugin: IPluginInfo = {
    id: PluginInterfaceType.DRAW_PLUGIN,
    subdomain: 'token-drawing',
    name: 'Token Drawing',
    installVersion: {
        release: 1,
        build: 1,
        releaseNotes: 'https://github.com/decentrastates/draw-plugin/releases/tag/v1.3.1',
        description: 'NFT抽奖和批量兑换插件',
    },
    repositoryAddresses: {
        [Network.ARBITRUM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.BASE_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ETHEREUM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ETHEREUM_SEPOLIA]: '0x0898e649106Cc85A1c13308590Fa6a6Dc3dC9c6d',
        [Network.POLYGON_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ZKSYNC_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.ZKSYNC_SEPOLIA]: '0x0000000000000000000000000000000000000000',
        [Network.PEAQ_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.OPTIMISM_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.CORN_MAINNET]: '0x0000000000000000000000000000000000000000',
        [Network.CHILIZ_MAINNET]: '0x0000000000000000000000000000000000000000',
    },
    setup: {
        nameKey: 'app.plugins.draw.meta.setup.name',
        descriptionKey: 'app.plugins.draw.meta.setup.description',
    },
};