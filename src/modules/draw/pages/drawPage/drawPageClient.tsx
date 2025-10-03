'use client';

import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { daoUtils } from '@/shared/utils/daoUtils';
import type React from 'react';
import { NftCollectionList } from '@/plugins/drawPlugin/components/nftCollectionList/nftCollectionList';
import type { INftCollection } from '@/plugins/drawPlugin/components/nftCollectionList/nftCollectionList';
import { useRouter } from '@/shared/lib/nextNavigation';

export interface IDrawPageClientProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const DrawPageClient: React.FC<IDrawPageClientProps> = (props) => {
    const { daoId } = props;
    const { t } = useTranslations();
    const router = useRouter();

    // 解析daoId以获取network和addressOrEns
    const parsedDaoInfo = daoUtils.parseDaoId(daoId);
    // 使用变量但不直接访问属性以避免 ESLint 警告
    void parsedDaoInfo;

    // 这里应该显示Draw实例化抽奖合约列表
    // 由于这是一个示例实现，我们显示一些模拟数据
    const drawContracts: INftCollection[] = [
        {
            id: '1',
            contractAddress: '0x1234567890123456789012345678901234567890',
            name: 'Summer Collection Draw',
            description: 'Exclusive summer collection NFTs with unique designs',
            imageUrl: 'https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png',
            itemsCount: 10000,
            ownersCount: 3500,
            floorPrice: '15.5',
            floorPriceCurrency: 'ETH',
            volume: '25000',
            volumeCurrency: 'ETH',
            symbol: 'SUMMER'
        },
        {
            id: '2',
            contractAddress: '0x1234567890123456789012345678901234567891',
            name: 'Holiday Special Draw',
            description: 'Limited edition holiday NFTs for special occasions',
            imageUrl: 'https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png',
            itemsCount: 5000,
            ownersCount: 1200,
            floorPrice: '22.8',
            floorPriceCurrency: 'ETH',
            volume: '18500',
            volumeCurrency: 'ETH',
            symbol: 'HOLIDAY'
        },
        {
            id: '3',
            contractAddress: '0x1234567890123456789012345678901234567892',
            name: 'Limited Edition Draw',
            description: 'Rare and limited edition NFTs for collectors',
            imageUrl: 'https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png',
            itemsCount: 1000,
            ownersCount: 850,
            floorPrice: '89.5',
            floorPriceCurrency: 'ETH',
            volume: '125000',
            volumeCurrency: 'ETH',
            symbol: 'LIMITED'
        },
    ];

    return (
        <Page.Content>
            <Page.Main title={t('app.plugins.draw.mainPage.title')}>
                <NftCollectionList 
                    collections={drawContracts} 
                    onCollectionClick={(collection: INftCollection) => {
                        // 处理集合点击事件，跳转到详情页
                        const { network, address } = parsedDaoInfo;
                        router.push(`/dao/${network}/${address}/draw/${collection.id}`);
                    }}
                />
            </Page.Main>
        </Page.Content>
    );
};