// Token详情数据接口
export interface IcoTokenDetail {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    icon: string;
    description: string;
    totalSupply: number;
    circulatingSupply: number;
    maxSupply: number;
    contractAddress: string;
    website: string;
    whitepaper: string;
}

export interface IIcoTokenHeaderProps {
    tokenDetails: IcoTokenDetail;
    formatCurrency: (value: number) => string;
}

export const IcoTokenHeader: React.FC<IIcoTokenHeaderProps> = (props) => {
    const { tokenDetails, formatCurrency } = props;

    return (
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 md:flex-row md:items-center">
            <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-2xl font-bold text-gray-700">{tokenDetails.icon}</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">
                        {tokenDetails.name} ({tokenDetails.symbol})
                    </h1>
                    <p className="text-gray-600">{formatCurrency(tokenDetails.price)}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span
                    className={`text-lg font-semibold ${tokenDetails.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                    {tokenDetails.change24h >= 0 ? '↑' : '↓'} {Math.abs(tokenDetails.change24h)}%
                </span>
                <span className="text-sm text-gray-500">(24h change)</span>
            </div>
        </div>
    );
};