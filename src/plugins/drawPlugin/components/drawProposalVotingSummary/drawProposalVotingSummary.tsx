'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { formatterUtils, NumberFormat } from '@cddao/gov-ui-kit';
import type { IDrawProposal } from '../../types';

export interface IDrawProposalVotingSummaryProps {
    /**
     * Proposal to be used to display the breakdown.
     */
    proposal?: IDrawProposal;
    /**
     * Name of the plugin.
     */
    name: string;
    /**
     * Defines if the voting is to veto or not.
     */
    isVeto: boolean;
    /**
     * Additional executed status when plugin is a sub-plugin.
     */
    isExecuted?: boolean;
}

export const DrawProposalVotingSummary: React.FC<IDrawProposalVotingSummaryProps> = (props) => {
    const { proposal, name, isExecuted } = props;

    const { t } = useTranslations();

    if (!proposal) {
        return <p className="text-base leading-tight font-normal text-neutral-800 md:text-lg">{name}</p>;
    }

    const { totalParticipants } = proposal.metrics;
    // const status = ProposalStatus.ACTIVE; // For draw proposals, we can set a default status

    const formattedTotalParticipants = formatterUtils.formatNumber(totalParticipants.toString(), {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    });

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-base leading-tight font-normal text-neutral-800 md:text-lg">{name}</p>
                {isExecuted === true && (
                    <span className="text-xs font-semibold leading-normal px-2 py-1 rounded-full bg-success-50 text-success-800">
                        {t('app.proposal.status.executed')}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="overflow-hidden rounded-full bg-neutral-100 h-2">
                    <div
                        className="h-full rounded-full bg-primary-500 transition-all duration-300 ease-out"
                        style={{ width: `${String(Math.min(100, totalParticipants))}%` }}
                    />
                </div>
                <div className="text-xs font-semibold text-neutral-500">
                    {t('app.plugins.draw.drawProposalVotingSummary.participants', {
                        participants: formattedTotalParticipants,
                    })}
                </div>
            </div>
        </div>
    );
};