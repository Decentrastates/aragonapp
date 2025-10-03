import type { IDaoPlugin } from '@/shared/api/daoService';
import type { IDrawPluginSettings } from '@/plugins/drawPlugin/types/drawPluginSettings';

export interface IDrawPlugin extends IDaoPlugin<IDrawPluginSettings> {
    /**
     * The draw plugin specific properties.
     */
    // Add any draw plugin specific properties here if needed
}