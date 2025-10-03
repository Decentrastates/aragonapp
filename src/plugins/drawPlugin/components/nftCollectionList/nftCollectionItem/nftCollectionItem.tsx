'use client';

import { Card } from '@cddao/gov-ui-kit';
import type React from 'react';
import { useTranslations } from '@/shared/components/translationsProvider';

export interface INftCollection {
    /**
     * Unique identifier for the NFT collection
     */
    id: string;
    /**
     * Contract address of the NFT collection
     */
    contractAddress: string;
    /**
     * Name of the NFT collection
     */
    name: string;
    /**
     * Description of the NFT collection
     */
    description: string;
    /**
     * URL of the collection image
     */
    imageUrl: string;
    /**
     * Number of items in the collection
     */
    itemsCount: number;
    /**
     * Number of owners of the collection
     */
    ownersCount: number;
    /**
     * Floor price of the collection
     */
    floorPrice: string;
    /**
     * Currency of the floor price
     */
    floorPriceCurrency: string;
    /**
     * Total volume of the collection
     */
    volume: string;
    /**
     * Currency of the volume
     */
    volumeCurrency: string;
    /**
     * Symbol of the collection
     */
    symbol: string;
}

export interface INftCollectionItemProps {
    /**
     * NFT collection to display
     */
    collection: INftCollection;
    /**
     * Additional class names for the container
     */
    className?: string;
    /**
     * Click handler for the collection item
     */
    onClick?: (collection: INftCollection) => void;
}

export const NftCollectionItem: React.FC<INftCollectionItemProps> = (props) => {
    const { collection, className = '', onClick } = props;
    const { t } = useTranslations();

    return (
        <Card 
            className={`overflow-hidden rounded-lg border border-neutral-100 hover:border-primary-500 transition-colors cursor-pointer ${className}`}
            onClick={() => onClick?.(collection)}
        >
            <div className="relative">
                <div className="bg-gray-200 border-dashed rounded-t-lg w-full h-48 flex items-center justify-center">
                    {collection.imageUrl ? (
                        <img 
                            src={collection.imageUrl} 
                            alt={collection.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-neutral-400">{t('app.plugins.draw.nftCollectionList.noImage')}</div>
                    )}
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-neutral-900 truncate">{collection.name}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {collection.symbol}
                    </span>
                </div>
                
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{collection.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-neutral-500">{t('app.plugins.draw.nftCollectionList.floorPrice')}</p>
                        <p className="text-sm font-medium text-neutral-900">
                            {collection.floorPrice} {collection.floorPriceCurrency}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-neutral-500">{t('app.plugins.draw.nftCollectionList.items')}</p>
                        <p className="text-sm font-medium text-neutral-900">{collection.itemsCount}</p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-neutral-500">{t('app.plugins.draw.nftCollectionList.owners')}</p>
                        <p className="text-sm font-medium text-neutral-900">{collection.ownersCount}</p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-neutral-500">{t('app.plugins.draw.nftCollectionList.volume')}</p>
                        <p className="text-sm font-medium text-neutral-900">
                            {collection.volume} {collection.volumeCurrency}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};