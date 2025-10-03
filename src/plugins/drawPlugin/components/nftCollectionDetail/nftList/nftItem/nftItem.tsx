'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Card, Tag } from '@cddao/gov-ui-kit';
import type React from 'react';

export interface INftItemData {
    /**
     * Unique identifier for the NFT
     */
    id: string;
    /**
     * Name of the NFT
     */
    name: string;
    /**
     * Description of the NFT
     */
    description: string;
    /**
     * URL of the NFT image
     */
    imageUrl: string;
    /**
     * Current price of the NFT
     */
    currentPrice: string;
    /**
     * Currency of the current price
     */
    currentPriceCurrency: string;
    /**
     * Last sale price of the NFT
     */
    lastSalePrice: string;
    /**
     * Currency of the last sale price
     */
    lastSaleCurrency: string;
    /**
     * Number of favorites for the NFT
     */
    favoritesCount: number;
    /**
     * Owner information
     */
    owner: {
        /**
         * Owner address
         */
        address: string;
        /**
         * Owner name
         */
        name: string;
    };
    /**
     * Quantity of the NFT (for ERC-1155)
     */
    quantity?: number;
    /**
     * Standard of the NFT (ERC-721 or ERC-1155)
     */
    standard: string;
    /**
     * collectionName
     */
    collectionName?: string;

    contractAddress: string;
}

export interface INftItemProps {
    /**
     * NFT item to display
     */
    item: INftItemData;
    /**
     * Additional class names for the container
     */
    className?: string;
    /**
     * Click handler for the item
     */
    onClick?: (item: INftItemData) => void;
}

export const NftItem: React.FC<INftItemProps> = (props) => {
    const { item, className = '', onClick } = props;
    const { t } = useTranslations();
    
    // 检查数量是否为零或未定义
    const hasNoNfts = item.quantity === 0 || item.quantity === undefined;

    return (
        <>
            <Card
                className={`overflow-hidden rounded-lg transition-colors ${className} ${
                    hasNoNfts 
                        ? 'bg-gray-300 border-gray-500 cursor-not-allowed opacity-80' 
                        : 'hover:border-primary-300 cursor-pointer border-neutral-200'
                }`}
                onClick={() => !hasNoNfts && onClick?.(item)}
            >
                <div className="relative">
                    <div className={`flex h-48 w-full items-center justify-center rounded-t-lg border-dashed ${
                        hasNoNfts ? 'bg-gray-400' : 'bg-gray-200'
                    }`}>
                        {item.imageUrl ? (
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className={`h-full w-full object-cover ${hasNoNfts ? 'opacity-40' : ''}`} 
                            />
                        ) : (
                            <div className={`text-neutral-400 ${hasNoNfts ? 'text-gray-600' : ''}`}>
                                {t('app.plugins.draw.nftCollectionListItem.noImage')}
                            </div>
                        )}
                        {/* 当数量为零或未定义时添加一个视觉指示器 */}
                        {hasNoNfts && (
                            <div className="absolute top-2 left-2 bg-gray-600 text-gray-100 text-xs px-2 py-1 rounded">
                                {t('app.plugins.draw.nftCollectionListItem.noNfts')}
                            </div>
                        )}
                    </div>

                    {item.quantity !== undefined && item.quantity > 0 && (
                        <div className="absolute top-2 right-2">
                            <Tag label={item.quantity.toString()} variant='primary' className="bg-primary-500 text-white font-bold" />
                        </div>
                    )}
                </div>

                <div className={`p-4 ${hasNoNfts ? 'opacity-80' : ''}`}>
                    <div className="mb-2 flex items-start justify-between">
                        <h3 className={`truncate text-base font-semibold ${
                            hasNoNfts ? 'text-gray-700' : 'text-neutral-900'
                        }`}>
                            {item.name}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            hasNoNfts 
                                ? 'bg-gray-500 text-gray-100' 
                                : 'bg-purple-100 text-purple-800'
                        }`}>
                            {item.standard}
                        </span>
                    </div>

                    <p className={`mb-3 line-clamp-2 text-xs ${
                        hasNoNfts ? 'text-gray-700' : 'text-neutral-600'
                    }`}>
                        {item.description}
                    </p>

                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${hasNoNfts ? 'text-gray-700' : 'text-neutral-500'}`}>
                                {t('app.plugins.draw.nftCollectionListItem.price')}
                            </p>
                            <p className={`text-sm font-medium ${
                                hasNoNfts ? 'text-gray-700' : 'text-neutral-900'
                            }`}>
                                {item.currentPrice} {item.currentPriceCurrency}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className={`text-xs ${hasNoNfts ? 'text-gray-700' : 'text-neutral-500'}`}>
                                {t('app.plugins.draw.nftCollectionListItem.lastSale')}
                            </p>
                            <p className={`text-sm font-medium ${
                                hasNoNfts ? 'text-gray-700' : 'text-neutral-900'
                            }`}>
                                {item.lastSalePrice} {item.lastSaleCurrency}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};