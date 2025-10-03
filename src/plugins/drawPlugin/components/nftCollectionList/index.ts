import dynamic from 'next/dynamic';

export const NftCollectionList = dynamic(() => import('./nftCollectionList').then((mod) => mod.NftCollectionList));
export { NftCollectionItem } from './nftCollectionItem';
export { type INftCollectionListProps } from './nftCollectionList';
export { type INftCollectionItemProps, type INftCollection } from './nftCollectionItem';
