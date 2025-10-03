'use client';

import type { IDaoProposalListDefaultItemProps } from '@/modules/governance/components/daoProposalList';
import { ProposalDataListItem, ProposalStatus } from '@cddao/gov-ui-kit';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { IDrawProposal } from '../../types';

export interface IDrawProposalListItemProps extends IDaoProposalListDefaultItemProps<IDrawProposal> {}

export const DrawProposalListItem: React.FC<IDrawProposalListItemProps> = (props) => {
    const { proposal, dao, proposalSlug } = props;
    const { id, title, summary, executed, endDate, creator } = proposal;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const proposalDate = (executed.blockTimestamp ?? endDate) * 1000;
    const processedEndDate = proposalDate === 0 ? undefined : proposalDate;
    const proposalHref = daoUtils.getDaoUrl(dao, `proposals/${proposalSlug}`);
    const publisherHref = daoUtils.getDaoUrl(dao, `members/${creator.address}`);
    const publisherName = creator.ens ?? undefined;

    // TODO: Replace with proper proposal status logic
    const proposalStatus = ProposalStatus.ACTIVE; // This should be determined by the proposal status logic

    return (
        <ProposalDataListItem.Structure
            className="min-w-0"
            id={proposalSlug}
            status={proposalStatus}
            key={id}
            title={title}
            summary={summary}
            date={processedEndDate}
            href={proposalHref}
            publisher={{ address: creator.address, link: publisherHref, name: publisherName }}
        />
    );
};