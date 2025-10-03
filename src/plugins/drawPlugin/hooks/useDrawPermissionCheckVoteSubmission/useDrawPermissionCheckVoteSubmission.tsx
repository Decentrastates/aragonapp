'use client';

import type { IPermissionCheckGuardParams, IPermissionCheckGuardResult } from '@/modules/governance/types';
import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { ChainEntityType, DateFormat, formatterUtils, useBlockExplorer } from '@cddao/gov-ui-kit';
import type { Hex } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import type { IDrawPluginSettings } from '../../types';

// ABI for the draw plugin canParticipate function
const drawPluginAbi = [
    {
        type: 'function',
        inputs: [
            { name: '_proposalId', internalType: 'uint256', type: 'uint256' },
            { name: '_participant', internalType: 'address', type: 'address' },
        ],
        name: 'canParticipate',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
] as const;

export interface IDrawPermissionCheckVoteSubmissionParams
    extends IPermissionCheckGuardParams<IDaoPlugin<IDrawPluginSettings>> {}

export const useDrawPermissionCheckVoteSubmission = (
    params: IDrawPermissionCheckVoteSubmissionParams,
): IPermissionCheckGuardResult => {
    const { proposal } = params;

    const { address } = useAccount();
    const { t } = useTranslations();

    const { blockTimestamp, network, transactionHash, proposalIndex, pluginAddress } = proposal!;

    // Check if user can participate in the draw
    const { data: hasPermission, isLoading } = useReadContract({
        address: pluginAddress as Hex,
        chainId: networkDefinitions[network].id,
        abi: drawPluginAbi,
        functionName: 'canParticipate',
        args: [BigInt(proposalIndex), address as Hex],
        query: { enabled: address != null },
    });

    const creationDate = blockTimestamp * 1000;
    const formattedCreationDate = formatterUtils.formatDate(creationDate, { format: DateFormat.YEAR_MONTH_DAY });

    const { id: chainId } = networkDefinitions[network];

    const { buildEntityUrl } = useBlockExplorer({ chainId });
    const proposalCreationUrl = buildEntityUrl({ type: ChainEntityType.TRANSACTION, id: transactionHash });

    const settings = [
        {
            term: t('app.plugins.draw.drawPermissionCheckVoteSubmission.createdAt'),
            definition: formattedCreationDate!,
            link: { href: proposalCreationUrl, textClassName: 'first-letter:capitalize' },
        },
        {
            term: t('app.plugins.draw.drawPermissionCheckVoteSubmission.membership'),
            definition: t('app.plugins.draw.drawPermissionCheckVoteSubmission.eligibleToParticipate'),
        },
    ];

    return {
        hasPermission: !!hasPermission,
        settings: [settings],
        isLoading,
        isRestricted: true,
    };
};