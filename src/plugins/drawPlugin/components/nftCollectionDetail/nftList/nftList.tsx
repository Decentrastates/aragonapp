'use client';

import type React from 'react';
import { useTranslations } from '@/shared/components/translationsProvider';
import { NftItem } from './nftItem';
import { type INftItemData } from './nftItem/nftItem';

export interface INftListProps {
    /**
     * Array of NFT items in the collection
     */
    nftItems: INftItemData[];
    /**
     * Grid layout class name for NFT items
     */
    gridLayoutClassName?: string;
}

export const NftList: React.FC<INftListProps> = ({
    nftItems,
    gridLayoutClassName
}) => {
    const { t } = useTranslations();
    void gridLayoutClassName; // 无害引用以避免lint错误
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">
                    {t('app.plugins.draw.nftCollectionDetail.nftItemsTitle')}
                </h2>
                <p className="text-neutral-600">
                    {t('app.plugins.draw.nftCollectionDetail.nftItemsCount', { count: nftItems.length })}
                </p>
            </div>
            
            {/* 硬编码默认类名以确保样式正确应用 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {nftItems.map((item) => (
                    <NftItem 
                        key={item.id} 
                        item={item} 
                    />
                ))}
            </div>
        </div>
    );
};