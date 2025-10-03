'use client';

import type { IGetVoteListParams } from '@/modules/governance/api/governanceService';
import type { IVoteListProps } from '@/modules/governance/components/voteList';
import { VoteProposalListItem } from '@/modules/governance/components/voteList';
import { useVoteListData } from '@/modules/governance/hooks/useVoteListData';
import { useDao } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils';
import {
    DataListContainer,
    DataListPagination,
    DataListRoot,
    VoteDataListItem,
    type VoteIndicator,
    VoteProposalDataListItem,
} from '@cddao/gov-ui-kit';
import type { IDrawVote } from '../../types';

export interface IDrawVoteListProps extends IVoteListProps {
    /**
     * Parameters to use for fetching votes.
     */
    initialParams: IGetVoteListParams;
}

const voteOptionToIndicator: Record<string, VoteIndicator> = {
    '1': 'yes',
};

export const DrawVoteList: React.FC<IDrawVoteListProps> = (props) => {
    const { initialParams, daoId } = props;

    const { t } = useTranslations();

    const { onLoadMore, state, pageSize, itemsCount, errorState, emptyState, voteList } =
        useVoteListData<IDrawVote>(initialParams);
    const { data: dao } = useDao({ urlParams: { id: daoId } });

    return (
        <DataListRoot
            entityLabel={t('app.plugins.draw.drawVoteList.entity')}
            onLoadMore={onLoadMore}
            state={state}
            pageSize={pageSize}
            itemsCount={itemsCount}
        >
            <DataListContainer
                SkeletonElement={
                    initialParams.queryParams.includeInfo === true
                        ? VoteProposalDataListItem.Skeleton
                        : VoteDataListItem.Skeleton
                }
                emptyState={emptyState}
                errorState={errorState}
            >
                {voteList?.map((vote) => {
                    const voteIndicator = voteOptionToIndicator[vote.isParticipating ? '1' : '0'] || 'yes';
                    const voteIndicatorDescription = t('app.plugins.draw.drawVoteList.description.participate');

                    return initialParams.queryParams.includeInfo === true ? (
                        <VoteProposalListItem
                            key={vote.transactionHash}
                            vote={vote}
                            daoId={daoId}
                            voteIndicator={voteIndicator}
                        />
                    ) : (
                        <VoteDataListItem.Structure
                            key={vote.transactionHash}
                            href={daoUtils.getDaoUrl(dao, `members/${vote.member.address}`)}
                            voteIndicator={voteIndicator}
                            voteIndicatorDescription={voteIndicatorDescription}
                            voter={{
                                address: vote.member.address,
                                avatarSrc: vote.member.avatar ?? undefined,
                                name: vote.member.ens ?? undefined,
                            }}
                            votingPower={vote.entryCount.toString()}
                            tokenSymbol="Entries"
                        />
                    );
                })}
            </DataListContainer>
            <DataListPagination />
        </DataListRoot>
    );
};