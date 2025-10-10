import { initialiseAdminPlugin } from './adminPlugin';
import { adminPluginDialogsDefinitions } from './adminPlugin/constants/adminPluginDialogsDefinitions';
import { initialiseCapitalDistributorPlugin } from './capitalDistributorPlugin';
import { capitalDistributorPluginDialogsDefinitions } from './capitalDistributorPlugin/constants/capitalDistributorPluginDialogsDefinitions';
import { initialiseDrawPlugin } from './drawPlugin';
import { drawPluginDialogsDefinitions } from './drawPlugin/constants/drawPluginDialogsDefinitions';
import { initialiseIcoPlugin } from './icoPlugin';
import { icoPluginDialogsDefinitions } from './icoPlugin/constants/icoPluginDialogsDefinitions';
import { initialiseLockToVotePlugin } from './lockToVotePlugin';
import { lockToVotePluginDialogsDefinitions } from './lockToVotePlugin/constants/lockToVotePluginDialogsDefinitions';
import { initialiseMultisigPlugin } from './multisigPlugin';
import { multisigPluginDialogsDefinitions } from './multisigPlugin/constants/multisigPluginDialogsDefinitions';
import { initialiseSppPlugin } from './sppPlugin';
import { sppPluginDialogsDefinitions } from './sppPlugin/constants/sppPluginDialogsDefinitions';
import { initialiseTokenPlugin } from './tokenPlugin';
import { tokenPluginDialogsDefinitions } from './tokenPlugin/constants/tokenPluginDialogsDefinitions';

export const initialisePlugins = () => {
    initialiseMultisigPlugin();
    initialiseTokenPlugin();
    initialiseAdminPlugin();
    initialiseCapitalDistributorPlugin();
    initialiseIcoPlugin();
    initialiseLockToVotePlugin();
    initialiseSppPlugin();
    initialiseDrawPlugin(); // 添加drawPlugin初始化
};

export const pluginDialogsDefinitions = {
    ...adminPluginDialogsDefinitions,
    ...capitalDistributorPluginDialogsDefinitions,
    ...icoPluginDialogsDefinitions,
    ...lockToVotePluginDialogsDefinitions,
    ...multisigPluginDialogsDefinitions,
    ...sppPluginDialogsDefinitions,
    ...tokenPluginDialogsDefinitions,
    ...drawPluginDialogsDefinitions, // 添加drawPlugin对话框定义
};