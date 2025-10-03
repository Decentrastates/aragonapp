import type { IDrawPluginSettings } from '../../types';

// Default action definitions for the draw plugin
export const defaultDrawAction = (settings: IDrawPluginSettings) => ({
    type: 'UPDATE_SETTINGS',
    from: '',
    to: settings.pluginAddress,
    data: '',
    value: '0',
    inputData: {
        function: 'updateSettings',
        contract: 'DrawPlugin',
        parameters: [],
    },
});