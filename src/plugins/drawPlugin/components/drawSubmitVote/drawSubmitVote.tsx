'use client';

import { GovernanceDialogId } from '@/modules/governance/constants/governanceDialogId';
import { GovernanceSlotId } from '@/modules/governance/constants/moduleSlots';
import type { IVoteDialogParams } from '@/modules/governance/dialogs/voteDialog';
import { usePermissionCheckGuard } from '@/modules/governance/hooks/usePermissionCheckGuard';
import { useUserVote } from '@/modules/governance/hooks/useUserVote';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useDaoPlugins } from '@/shared/hooks/useDaoPlugins';
import { Button, Card, ChainEntityType, IconType, useBlockExplorer, type VoteIndicator } from '@cddao/gov-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import type { IDrawProposal, IDrawVote } from '../../types';
import { DrawVotingOptions } from './components/drawVotingOptions';

export interface IDrawSubmitVoteProps {
    /**
     * ID of the DAO to create the proposal for.
     */
    daoId: string;
    /**
     * Proposal to submit the vote for.
     */
    proposal: IDrawProposal;
}

export const DrawSubmitVote: React.FC<IDrawSubmitVoteProps> = (props) => {
    const { daoId, proposal } = props;
    const { pluginAddress, network } = proposal;

    const { t } = useTranslations();
    const { open } = useDialogContext();

    const latestVote = useUserVote<IDrawVote>({ proposal, network });
    const { meta: plugin } = useDaoPlugins({ daoId, pluginAddress, includeSubPlugins: true })![0];

    const { id: chainId } = networkDefinitions[network];
    const { buildEntityUrl } = useBlockExplorer({ chainId });
    const latestVoteTxHref = buildEntityUrl({ type: ChainEntityType.TRANSACTION, id: latestVote?.transactionHash });

    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | undefined>(latestVote?.isParticipating ? '1' : undefined);

    const openTransactionDialog = () => {
        const voteLabel = 'participate' as VoteIndicator;
        const vote = {
            value: 1, // Using 1 for participate
            label: voteLabel,
            labelDescription: t('app.plugins.draw.drawSubmitVote.voteDescription.participate'),
        };
        const params: IVoteDialogParams = { daoId, proposal, vote, plugin };

        open(GovernanceDialogId.VOTE, { params });
    };

    const resetVoteOptions = useCallback(() => {
        setSelectedOption(latestVote?.isParticipating ? '1' : undefined);
        setShowOptions(false);
    }, [latestVote]);

    const { check: submitVoteGuard, result: canSubmitVote } = usePermissionCheckGuard({
        permissionNamespace: 'vote',
        slotId: GovernanceSlotId.GOVERNANCE_PERMISSION_CHECK_VOTE_SUBMISSION,
        plugin,
        daoId,
        proposal,
        onSuccess: () => setShowOptions(true),
    });

    const handleVoteClick = () => (canSubmitVote ? setShowOptions(true) : submitVoteGuard());

    useEffect(() => {
        setSelectedOption(latestVote?.isParticipating ? '1' : undefined);
    }, [latestVote]);

    useEffect(() => {
        if (!canSubmitVote) {
            setShowOptions(false);
        }
    }, [canSubmitVote, setShowOptions]);

    return (
        <div className="flex flex-col gap-4">
            {!showOptions && latestVote == null && (
                <Button className="w-fit" size="md" onClick={handleVoteClick}>
                    {t('app.plugins.draw.drawSubmitVote.buttons.participate')}
                </Button>
            )}
            {!showOptions && latestVote != null && (
                <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                    <Button
                        href={latestVoteTxHref}
                        target="_blank"
                        variant="secondary"
                        iconLeft={IconType.CHECKMARK}
                        className="w-full md:w-fit"
                        size="md"
                    >
                        {t('app.plugins.draw.drawSubmitVote.buttons.submitted')}
                    </Button>
                </div>
            )}
            {showOptions && (
                <Card className="shadow-neutral-sm border border-neutral-100 p-6">
                    <DrawVotingOptions value={selectedOption} onChange={setSelectedOption} />
                </Card>
            )}
            {showOptions && (
                <div className="flex w-full flex-col items-center gap-y-3 md:flex-row md:gap-x-4">
                    <Button
                        onClick={openTransactionDialog}
                        disabled={!selectedOption || (latestVote?.isParticipating && selectedOption === '1')}
                        size="md"
                        className="w-full md:w-fit"
                        variant="primary"
                    >
                        {latestVote
                            ? t('app.plugins.draw.drawSubmitVote.buttons.change.submit')
                            : t('app.plugins.draw.drawSubmitVote.buttons.submit')}
                    </Button>
                    <Button size="md" variant="tertiary" className="w-full md:w-fit" onClick={resetVoteOptions}>
                        {t('app.plugins.draw.drawSubmitVote.buttons.cancel')}
                    </Button>
                </div>
            )}
        </div>
    );
};