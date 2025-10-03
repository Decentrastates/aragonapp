import { ProposalStatus } from '@cddao/gov-ui-kit';

class AdminProposalUtils {
    getProposalStatus = () => ProposalStatus.EXECUTED;
}

export const adminProposalUtils = new AdminProposalUtils();
