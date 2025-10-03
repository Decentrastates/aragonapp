'use client';

import { StatCard } from '@/shared/components/statCard';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Button, Card } from '@cddao/gov-ui-kit';
import type React from 'react';

export interface INftCollectionHeaderProps {
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

export const NftCollectionHeader: React.FC<INftCollectionHeaderProps> = (props) => {
    const {
        contractAddress,
        // name,
        // description,
        // imageUrl,
        itemsCount,
        ownersCount,
        floorPrice,
        floorPriceCurrency,
        volume,
        volumeCurrency,
        symbol,
        standard,
        showLotteryButton = false,
        showRedemptionButton = false,
        onLotteryClick,
        onRedemptionClick,
    } = props;

    const { t } = useTranslations();

    return (
        <Card className="overflow-hidden rounded-lg">
            <div className="md:flex">
                <div className="p-6 md:w-3/3">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            {/* <h1 className="text-2xl font-bold text-neutral-900">{name}</h1> */}
                            <div className="mt-1 flex items-center">
                                <span className="mr-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                                    {symbol}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-800">
                                    {standard}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard
                            value={`${floorPrice} ${floorPriceCurrency}`}
                            label={t('app.plugins.draw.nftCollectionDetail.floorPrice')}
                        />
                        <StatCard value={itemsCount} label={t('app.plugins.draw.nftCollectionDetail.items')} />
                        <StatCard value={ownersCount} label={t('app.plugins.draw.nftCollectionDetail.owners')} />
                        <StatCard
                            value={`${volume} ${volumeCurrency}`}
                            label={t('app.plugins.draw.nftCollectionDetail.volume')}
                        />
                    </div>

                    <div className="mt-4">
                        <p className="mb-1 text-xs text-neutral-500">
                            {t('app.plugins.draw.nftCollectionDetail.contractAddress')}
                        </p>
                        <p className="truncate font-mono text-sm text-neutral-900">{contractAddress}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        {showLotteryButton && (
                            <Button onClick={onLotteryClick} className="bg-primary-600 hover:bg-primary-700 text-white">
                                {/* <Icon icon={IconType.PERSON} className="mr-2" /> */}
                                {t('app.plugins.draw.nftCollectionDetail.lotteryButton')}
                            </Button>
                        )}

                        {showRedemptionButton && (
                            <Button onClick={onRedemptionClick} variant="secondary">
                                {/* <Icon icon={IconType.PERSON} className="mr-2" /> */}
                                {t('app.plugins.draw.nftCollectionDetail.redemptionButton')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
