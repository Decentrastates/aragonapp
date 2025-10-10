'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import type { IcoPluginSettings } from '../../types/icoTypes';

// ICO操作工具函数
const getIcoActions = ({ plugin, t }: { plugin: IDaoPlugin<IcoPluginSettings>; t: ReturnType<typeof useTranslations>['t'] }) => {
  // ICO插件的操作逻辑
  return [];
};

export const useIcoActions = (plugin: IDaoPlugin<IcoPluginSettings>) => {
    const { t } = useTranslations();

    return getIcoActions({ plugin, t });
};