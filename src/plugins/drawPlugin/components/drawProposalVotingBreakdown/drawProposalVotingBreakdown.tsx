'use client';

import { ProposalVoting } from '@cddao/gov-ui-kit';
import type { ReactNode } from 'react';
import type { IDrawProposal } from '../../types';

export interface IDrawProposalVotingBreakdownProps {
    /**
     * Proposal to be used to display the breakdown.
     */
    proposal: IDrawProposal;
    /**
     * Defines if the voting is to veto or not.
     */
    isVeto?: boolean;
    /**
     * Additional children to render.
     */
    children?: ReactNode;
}

export const DrawProposalVotingBreakdown: React.FC<IDrawProposalVotingBreakdownProps> = (props) => {
    const { proposal, children, isVeto } = props;

    const { totalParticipants } = proposal.metrics;

    return (
        <ProposalVoting.BreakdownToken
            isVeto={isVeto}
            totalYes={totalParticipants.toString()}
            totalNo="0"
            totalAbstain="0"
            minParticipation={100}
            supportThreshold={100}
            tokenSymbol="Participants"
            tokenTotalSupply={totalParticipants.toString()}
        >
            {children}
        </ProposalVoting.BreakdownToken>
    );
};