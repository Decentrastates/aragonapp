import { useMember } from '@/modules/governance/api/governanceService';
import type { IPermissionCheckGuardParams, IPermissionCheckGuardResult } from '@/modules/governance/types';
import type { IDrawMember, IDrawPluginSettings } from '@/plugins/drawPlugin/types';
import { type IDaoPlugin, useDao } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils';
import { formatterUtils, NumberFormat } from '@cddao/gov-ui-kit';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { IMemberMetrics } from '@/modules/governance/api/governanceService/domain/memberMetrics';

export interface IDrawPermissionCheckProposalCreationParams
    extends IPermissionCheckGuardParams<IDaoPlugin<IDrawPluginSettings>> {}

export const useDrawPermissionCheckProposalCreation = (
    params: IDrawPermissionCheckProposalCreationParams,
): IPermissionCheckGuardResult => {
    const { plugin, daoId, useConnectedUserInfo = true } = params;

    const { address } = useAccount();
    const { t } = useTranslations();

    // 移除了未使用的 dao 变量
    useDao({ urlParams: { id: daoId } });

    const pluginName = daoUtils.getPluginName(plugin);

    const { minTokenAmount } = plugin.settings;
    const tokenSymbol = 'TOKEN'; // This should be fetched from the token contract

    const parsedMinTokenAmount = formatUnits(BigInt(minTokenAmount), 18); // Assuming 18 decimals
    const formattedMinTokenAmount = formatterUtils.formatNumber(parsedMinTokenAmount, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    });

    const minTokenRequired = `${formattedMinTokenAmount ?? '0'} ${tokenSymbol}`;

    const memberUrlParams: { address: string } = { address: address as string };
    const memberQueryParams: { daoId: string; pluginAddress: string } = { daoId, pluginAddress: plugin.address };
    const { data: member, isLoading } = useMember<IDrawMember & { metrics: IMemberMetrics }>(
        { urlParams: memberUrlParams, queryParams: memberQueryParams },
        { enabled: address != null },
    );

    const userTokenBalance = BigInt(member?.tokenBalance ?? '0');
    const parsedMemberBalance = formatUnits(userTokenBalance, 18); // Assuming 18 decimals
    const formattedMemberBalance = formatterUtils.formatNumber(parsedMemberBalance, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    });

    const defaultSettings = [
        {
            term: t('app.plugins.draw.drawPermissionCheckProposalCreation.pluginNameLabel'),
            definition: pluginName,
        },
        {
            term: t('app.plugins.draw.drawPermissionCheckProposalCreation.function'),
            definition: `≥${minTokenRequired}`,
        },
    ];

    const connectedUserSettings = [
        {
            term: t('app.plugins.draw.drawPermissionCheckProposalCreation.userTokenBalance'),
            definition: `${formattedMemberBalance ?? '0'} ${tokenSymbol}`,
        },
    ];

    const processedSettings = useConnectedUserInfo ? defaultSettings.concat(connectedUserSettings) : defaultSettings;

    const isRestricted = BigInt(minTokenAmount) > 0;

    // Check if user has enough tokens to create a proposal
    const hasPermission = userTokenBalance >= BigInt(minTokenAmount);

    return {
        hasPermission,
        settings: [processedSettings],
        isLoading,
        isRestricted,
    };
};