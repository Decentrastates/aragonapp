'use client';

import type React from 'react';
import { NftCollectionItem, type INftCollection } from './nftCollectionItem';



export interface INftCollectionListProps {
    id?: string;
    /**
     * Array of NFT collections to display
     */
    collections: INftCollection[];
    /**
     * Additional class names for the container
     */
    className?: string;
    /**
     * Click handler for collection items
     */
    onCollectionClick?: (collection: INftCollection) => void;
}

export const NftCollectionList: React.FC<INftCollectionListProps> = (props) => {
    const { collections, className = '', onCollectionClick } = props;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {collections.map((collection) => (
                <NftCollectionItem
                    key={collection.id}
                    collection={collection}
                    onClick={onCollectionClick}
                />
            ))}
        </div>
    );
};