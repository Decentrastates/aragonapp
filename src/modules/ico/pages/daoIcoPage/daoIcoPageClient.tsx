'use client';

import { IcoTokenItem } from '@/modules/ico/components/icoTokenItem/icoTokenItem';
import { daoService } from '@/shared/api/daoService';
import { DaoPluginInfo } from '@/modules/settings/components/daoPluginInfo';
import { daoServiceKeys } from '@/shared/api/daoService/daoServiceKeys';
import { Page } from '@/shared/components/page';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDaoPluginFilterUrlParam } from '@/shared/hooks/useDaoPluginFilterUrlParam';
import { PluginType } from '@/shared/types';
import { mockIcoTokens, mockIcoPlugin } from '@/modules/ico/data/mockIcoData';
import { useMemo } from 'react';

export interface IDaoIcoPageClientProps {
    /**
     * DAO identifier.
     */
    id: string;
}

export const DaoIcoPageClient: React.FC<IDaoIcoPageClientProps> = (props) => {
    const { id } = props;

    const { data: dao } = useSuspenseQuery({
        queryKey: daoServiceKeys.dao({ urlParams: { id } }),
        queryFn: () => daoService.getDao({ urlParams: { id } }),
    });

    // 获取插件信息
    const { activePlugin } = useDaoPluginFilterUrlParam({
        daoId: id,
        type: PluginType.BODY,
        includeSubPlugins: true,
    });

    // 创建模拟的ICO插件数据
    const mockIcoActivePlugin = useMemo(() => {
        return {
            id: mockIcoPlugin.interfaceType,
            uniqueId: mockIcoPlugin.slug,
            label: mockIcoPlugin.name ?? 'Token ICO',
            meta: mockIcoPlugin,
            props: {},
        }; 
    }, []);

    // 确定当前活动的插件（优先使用实际插件，否则使用模拟插件）
    const currentPlugin = activePlugin ?? mockIcoActivePlugin;

    // 格式化货币显示
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // 格式化大数字显示
    const formatLargeNumber = (value: number): string => {
        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(2)}B`;
        }
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        }
        return formatCurrency(value);
    };

    return (
        <>
            <Page.Main title={`Available Tokens for ${dao.name}`}>
                <div className="flex flex-col gap-6">
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Token</th>
                                    <th scope="col" className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Price</th>
                                    <th scope="col" className="py-3 px-4 text-right text-sm font-semibold text-gray-900 hidden md:table-cell">Volume (24h)</th>
                                    <th scope="col" className="py-3 px-4 text-right text-sm font-semibold text-gray-900 hidden lg:table-cell">Market Cap</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {mockIcoTokens.map((token) => (
                                    <IcoTokenItem
                                        key={token.id}
                                        token={token}
                                        daoNetwork={dao.network}
                                        daoAddress={dao.address}
                                        formatCurrency={formatCurrency}
                                        formatLargeNumber={formatLargeNumber}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                        <h3 className="mb-2 font-semibold text-blue-800">How to participate</h3>
                        <p className="text-blue-700">
                            Select a token from the list above to participate in the ICO for {dao.name}. You can
                            purchase tokens using your preferred cryptocurrency.
                        </p>
                    </div>
                </div>
            </Page.Main>
            <Page.Aside>
                <Page.AsideCard title={currentPlugin.label}>
                    <DaoPluginInfo 
                        plugin={currentPlugin.meta} 
                        daoId={id} 
                        type={PluginType.BODY} 
                    />
                </Page.AsideCard>
            </Page.Aside>
        </>
    );
};