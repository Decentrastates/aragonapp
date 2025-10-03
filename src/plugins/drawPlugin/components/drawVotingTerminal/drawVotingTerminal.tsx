'use client';

import { ProposalVoting } from '@cddao/gov-ui-kit';
import type { IDrawProposal } from '../../types';

export interface IDrawVotingTerminalProps {
    /**
     * Proposal to display the voting terminal for.
     */
    proposal: IDrawProposal;
}

export const DrawVotingTerminal: React.FC<IDrawVotingTerminalProps> = (props) => {
    const { proposal } = props;

    const { totalParticipants } = proposal.metrics;

    return (
        <ProposalVoting.BreakdownToken
            title={proposal.title}
            totalYes={totalParticipants.toString()}
            totalNo="0"
            totalAbstain="0"
            minParticipation={100}
            supportThreshold={100}
            tokenSymbol="Participants"
            tokenTotalSupply={totalParticipants.toString()}
        />
    );
};