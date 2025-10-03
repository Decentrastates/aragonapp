'use client';

import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { NftCollectionList, NftCollectionListItem } from '@cddao/gov-ui-kit';
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

    // 解析daoId以获取network和addressOrEns
    const { network, address } = daoUtils.parseDaoId(daoId);

    // 这里应该显示Draw实例化抽奖合约列表
    // 由于这是一个示例实现，我们显示一些模拟数据
    const drawContracts = [
        { id: 1, address: '0x1234567890123456789012345678901234567890', name: 'Summer Collection Draw', status: 'active', participants: 124 },
        { id: 2, address: '0x1234567890123456789012345678901234567891', name: 'Holiday Special Draw', status: 'upcoming', participants: 0 },
        { id: 3, address: '0x1234567890123456789012345678901234567892', name: 'Limited Edition Draw', status: 'completed', participants: 342 },
    ];

    return (
        <Page.Content>
            <Page.Main title={t('app.plugins.draw.mainPage.title')}>
                
                <NftCollectionList entityLabel="NFTs">
                    {drawContracts.map((contract) => (
                        <NftCollectionListItem
                            key={contract.address}
                            description="CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard."
                            floorPrice="15.5"
                            floorPriceCurrency="ETH"
                            href={`/dao/${network}/${address}/draw/${contract.address}`}
                            id={contract.address}
                            imageUrl="https://ipfs.cddao.com/ipfs/QmdRQbSffW3GzctwMdvFnWRCtutsVE2XCq3i4ZZAcU32yT/龙.png"
                            itemsCount={10000}
                            name={contract.name}
                            ownersCount={3500}
                            symbol="PUNK"
                            volume="25000"
                            volumeCurrency="ETH"
                        />
                    ))}
                </NftCollectionList>
            </Page.Main>
        </Page.Content>
    );
};