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
    itemsCount?: number;
    /**
     * Standard of the collection (ERC-721 or ERC-1155)
     */
    standard: string;
    /**
     * Blockchain network
     */
    network: string;
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
                </div>
                
                {/* 符号、标准和网络标签 */}
                <div className="mb-3 flex flex-wrap gap-2">
                    
                    {/* ERC-1155标签 */}
                    {collection.standard === 'ERC-1155' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            ERC-1155
                        </span>
                    )}
                    
                    {/* 区块链网络标签 */}
                    {collection.network && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {collection.network}
                        </span>
                    )}
                </div>
                
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{collection.description}</p>
                
            </div>
        </Card>
    );
};