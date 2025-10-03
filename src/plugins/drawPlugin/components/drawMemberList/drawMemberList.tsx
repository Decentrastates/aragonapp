'use client';

import type { IDaoMemberListDefaultProps } from '@/modules/governance/components/daoMemberList';
import { useMemberListData } from '@/modules/governance/hooks/useMemberListData';
import { useTranslations } from '@/shared/components/translationsProvider';
import { DataListContainer, DataListPagination, DataListRoot, MemberDataListItem } from '@cddao/gov-ui-kit';
import type { IDrawMember, IDrawPluginSettings } from '../../types';
import { DrawMemberListItem } from './components/drawMemberListItem';

export interface IDrawMemberListProps extends IDaoMemberListDefaultProps<IDrawPluginSettings> {}

export const DrawMemberList: React.FC<IDrawMemberListProps> = (props) => {
    const { initialParams, hidePagination, plugin, children } = props;

    const { t } = useTranslations();

    const { onLoadMore, state, pageSize, itemsCount, errorState, emptyState, memberList } =
        useMemberListData<IDrawMember>(initialParams);
    const { daoId } = initialParams.queryParams;

    return (
        <DataListRoot
            entityLabel={t('app.plugins.draw.drawMemberList.entity')}
            onLoadMore={onLoadMore}
            state={state}
            pageSize={pageSize}
            itemsCount={itemsCount}
        >
            <DataListContainer
                SkeletonElement={MemberDataListItem.Skeleton}
                emptyState={emptyState}
                errorState={errorState}
                layoutClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            >
                {memberList?.map((member) => (
                    <DrawMemberListItem key={member.address} member={member} daoId={daoId} plugin={plugin} />
                ))}
            </DataListContainer>
            {!hidePagination && <DataListPagination />}
            {children}
        </DataListRoot>
    );
};