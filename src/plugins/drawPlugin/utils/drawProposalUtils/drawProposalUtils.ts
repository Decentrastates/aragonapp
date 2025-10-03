import { proposalStatusUtils } from '@/shared/utils/proposalStatusUtils';
import { type ProposalStatus } from '@cddao/gov-ui-kit';
import type { IProposal } from '@/modules/governance/api/governanceService/domain/proposal';

interface IDrawProposal extends IProposal {
    executed: {
        status: boolean;
    };
    startDate: number;
    endDate: number;
    hasActions: boolean;
}

class DrawProposalUtils {
    getProposalStatus = (proposal: IDrawProposal): ProposalStatus => {
        console.log('DrawProposalUtils: getProposalStatus called with proposal:', proposal);
        const { executed, startDate, endDate, hasActions } = proposal;
        
        const isExecuted = executed.status;
        const isVetoed = false; // Draw proposals don't have veto mechanism
        const endDateSeconds = endDate;
        const executionExpiryDate = undefined; // Draw proposals don't have execution expiry
        const hasAdvanceableStages = false; // Draw proposals don't have stages
        const hasExpiredStagesBool = false; // Draw proposals don't have stages
        const paramsMet = true; // Draw proposals don't have specific parameters
        const canExecuteEarly = false; // Draw proposals don't have early execution

        const result = proposalStatusUtils.getProposalStatus({
            isExecuted,
            isVetoed,
            startDate,
            endDate: endDateSeconds,
            executionExpiryDate,
            hasAdvanceableStages,
            hasExpiredStages: hasExpiredStagesBool,
            paramsMet,
            hasActions,
            canExecuteEarly,
        });
        
        console.log('DrawProposalUtils: getProposalStatus result:', result);
        return result;
    };
}

export const drawProposalUtils = new DrawProposalUtils();