import dynamic from 'next/dynamic';

export const DrawProposalListItem = dynamic(() =>
    import('./drawProposalListItem').then((mod) => mod.DrawProposalListItem),
);
export type { IDrawProposalListItemProps } from './drawProposalListItem';