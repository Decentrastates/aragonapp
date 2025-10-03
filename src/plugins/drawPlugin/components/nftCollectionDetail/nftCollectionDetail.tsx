'use client';

import type React from 'react';
import { NftList } from './nftList';
import { INftItemData } from './nftList/nftItem/nftItem';
import { NftCollectionHeader } from './nftCollectionHeader';

export interface INftCollectionDetailProps {
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
    /**
     * Standard of the collection (ERC-721 or ERC-1155)
     */
    standard: string;
    /**
     * Array of NFT items in the collection
     */
    nftItems: INftItemData[];
    /**
     * Grid layout class name for NFT items
     */
    gridLayoutClassName?: string;
    /**
     * Whether to show the lottery button
     */
    showLotteryButton?: boolean;
    /**
     * Whether to show the redemption button
     */
    showRedemptionButton?: boolean;
    /**
     * Click handler for the lottery button
     */
    onLotteryClick?: () => void;
    /**
     * Click handler for the redemption button
     */
    onRedemptionClick?: () => void;
}

export const NftCollectionDetail: React.FC<INftCollectionDetailProps> = (props) => {
    const {
        contractAddress,
        name,
        description,
        imageUrl,
        itemsCount,
        ownersCount,
        floorPrice,
        floorPriceCurrency,
        volume,
        volumeCurrency,
        symbol,
        standard,
        nftItems,
        gridLayoutClassName,
        showLotteryButton = false,
        showRedemptionButton = false,
        onLotteryClick,
        onRedemptionClick
    } = props;

    return (
        <div className="space-y-8">
            {/* Collection Header */}
            <NftCollectionHeader 
                contractAddress={contractAddress}
                name={name}
                description={description}
                imageUrl={imageUrl}
                itemsCount={itemsCount}
                ownersCount={ownersCount}
                floorPrice={floorPrice}
                floorPriceCurrency={floorPriceCurrency}
                volume={volume}
                volumeCurrency={volumeCurrency}
                symbol={symbol}
                standard={standard}
                showLotteryButton={showLotteryButton}
                showRedemptionButton={showRedemptionButton}
                onLotteryClick={onLotteryClick}
                onRedemptionClick={onRedemptionClick}
            />
            
            {/* NFT Items Section */}
            <NftList 
                nftItems={nftItems} 
                gridLayoutClassName={gridLayoutClassName}
            />
        </div>
    );
};