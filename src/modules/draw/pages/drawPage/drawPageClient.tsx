'use client';

import { NftCollectionList, type INftCollection } from '@/plugins/drawPlugin/components/nftCollectionList';
import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useRouter } from '@/shared/lib/nextNavigation';
import { daoUtils } from '@/shared/utils/daoUtils';
import type React from 'react';

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
            standard: 'ERC-1155',
            network: 'Ethereum',
        },
        {
            id: '2',
            contractAddress: '0x1234567890123456789012345678901234567891',
            name: 'Holiday Special Draw',
            description: 'Limited edition holiday NFTs for special occasions',
            imageUrl: 'https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png',
            standard: 'ERC-721',
            network: 'Polygon',
        },
        {
            id: '3',
            contractAddress: '0x1234567890123456789012345678901234567892',
            name: 'Art Collection Draw',
            description: 'Unique art pieces as NFTs',
            imageUrl: 'https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png',
            standard: 'ERC-1155',
            network: 'Binance Smart Chain',
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
                        router.push(`/dao/${network}/${address}/draw/${collection.contractAddress}`);
                    }}
                />
            </Page.Main>
        </Page.Content>
    );
};
