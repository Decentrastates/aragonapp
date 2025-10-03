import Link from 'next/link';
import React from 'react';

// Token数据接口
export interface IcoToken {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    icon: string;
}

export interface IIcoTokenItemProps {
    token: IcoToken;
    daoNetwork: string;
    daoAddress: string;
    formatCurrency: (value: number) => string;
    formatLargeNumber: (value: number) => string;
}

export const IcoTokenItem: React.FC<IIcoTokenItemProps> = (props) => {
    const { token, daoNetwork, daoAddress, formatCurrency, formatLargeNumber } = props;

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-200">
            <td className="py-4 px-4">
                <Link 
                    href={`/dao/${daoNetwork}/${daoAddress}/ico/${token.id}`} 
                    className="flex items-center space-x-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <span className="font-semibold text-gray-700">{token.icon}</span>
                    </div>
                    <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-sm text-gray-500">{token.symbol}</div>
                    </div>
                </Link>
            </td>
            <td className="py-4 px-4 text-right">
                <Link 
                    href={`/dao/${daoNetwork}/${daoAddress}/ico/${token.id}`} 
                    className="block"
                >
                    <div className="font-semibold">{formatCurrency(token.price)}</div>
                    <div className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.change24h)}%
                    </div>
                </Link>
            </td>
            <td className="py-4 px-4 text-right hidden md:table-cell">
                <Link 
                    href={`/dao/${daoNetwork}/${daoAddress}/ico/${token.id}`} 
                    className="block"
                >
                    <div className="text-gray-900">{formatLargeNumber(token.volume24h)}</div>
                    <div className="text-sm text-gray-500">Volume (24h)</div>
                </Link>
            </td>
            <td className="py-4 px-4 text-right hidden lg:table-cell">
                <Link 
                    href={`/dao/${daoNetwork}/${daoAddress}/ico/${token.id}`} 
                    className="block"
                >
                    <div className="text-gray-900">{formatLargeNumber(token.marketCap)}</div>
                    <div className="text-sm text-gray-500">Market Cap</div>
                </Link>
            </td>
        </tr>
    );
};