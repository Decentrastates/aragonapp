'use client';

import { type IcoTokenDetail } from '@/modules/ico/components/icoTokenHeader/icoTokenHeader';
import { StatCard } from '@/modules/ico/components/statCard/statCard';
import { daoService } from '@/shared/api/daoService';
import { DaoPluginInfo } from '@/modules/settings/components/daoPluginInfo';
import { daoServiceKeys } from '@/shared/api/daoService/daoServiceKeys';
import { Page } from '@/shared/components/page';
import { Dialog } from '@cddao/gov-ui-kit';
import { type IPageHeaderStat } from '@/shared/components/page/pageHeader/pageHeaderStat';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Button, Card, MemberAvatar } from '@cddao/gov-ui-kit';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useConnectedWalletGuard } from '@/modules/application/hooks/useConnectedWalletGuard';
import { mockIcoTokenDetails, mockIcoPlugin } from '@/modules/ico/data/mockIcoData';
import { PluginType } from '@/shared/types';
import { TokenPurchaseDialog } from '@/modules/ico/dialogs/tokenPurchaseDialog/tokenPurchaseDialog';
import { TransactionDialog, TransactionDialogStep } from '@/shared/components/transactionDialog';
import { useStepper } from '@/shared/hooks/useStepper';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils/transactionUtils.api';
import { encodeFunctionData } from 'viem';
import type { Hex } from 'viem';

// 这里需要根据实际的ICO合约ABI来定义
const icoPluginAbi = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'paymentToken',
                type: 'string',
            },
        ],
        name: 'purchaseTokens',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
] as const;

export interface IDaoIcoPageDetailClientProps {
    /**
     * DAO identifier.
     */
    id: string;
}

export const DaoIcoPageDetailClient: React.FC<IDaoIcoPageDetailClientProps> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslations();

    const { id } = props;
    const params = useParams();
    const tokenId = params.id as string;

    // 添加钱包连接检查hook
    const { check: checkWalletConnected } = useConnectedWalletGuard();
    
    // 控制购买对话框的显示状态
    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
    
    // 控制交易对话框的显示状态
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [pendingPurchase, setPendingPurchase] = useState<{ amount: number; paymentToken: string; tokenName: string; tokenSymbol: string } | null>(null);
    
    // 交易对话框的步骤管理
    const stepper = useStepper<TransactionDialogStep>({ initialActiveStep: TransactionDialogStep.PREPARE });

    const { data: dao } = useSuspenseQuery({
        queryKey: daoServiceKeys.dao({ urlParams: { id } }),
        queryFn: () => daoService.getDao({ urlParams: { id } }),
    });

    // 根据token ID获取token详情
    const tokenDetails: IcoTokenDetail = mockIcoTokenDetails.find((token) => token.id === tokenId) ?? mockIcoTokenDetails[0];

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

    // 格式化货币显示
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // 格式化供应量显示
    const formatSupply = (value: number): string => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(2)}B ${tokenDetails.symbol}`;
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M ${tokenDetails.symbol}`;
        }
        return `${new Intl.NumberFormat('en-US').format(value)} ${tokenDetails.symbol}`;
    };

    // 定义面包屑导航
    const pageBreadcrumbs = [
        { label: 'ICO', href: `/dao/${dao.network}/${dao.address}/ico` },
        { label: `${tokenDetails.name} (${tokenDetails.symbol})` },
    ];
    const stats: IPageHeaderStat[] | undefined = [];
    const icoName = tokenDetails.contractAddress;

    // 添加购买处理函数
    const handlePurchase = useCallback(() => {
        checkWalletConnected({
            onSuccess: () => {
                // 钱包连接成功后打开购买对话框
                setIsPurchaseDialogOpen(true);
            },
            onError: () => {
                // 用户取消连接或连接失败
                console.log('Wallet connection cancelled or failed');
            }
        });
    }, [checkWalletConnected]);

    // 处理购买确认
    const handlePurchaseConfirm = useCallback((amount: number, paymentToken: string) => {
        // 设置待处理的购买信息并打开交易对话框
        setPendingPurchase({ 
            amount, 
            paymentToken, 
            tokenName: tokenDetails.name, 
            tokenSymbol: tokenDetails.symbol 
        });
        setIsTransactionDialogOpen(true);
    }, [tokenDetails.name, tokenDetails.symbol]);

    // 准备交易
    const handlePrepareTransaction = useCallback((): Promise<ITransactionRequest> => {
        if (!pendingPurchase) {
            throw new Error('No pending purchase');
        }

        // 编码购买函数调用
        const transactionData = encodeFunctionData({
            abi: icoPluginAbi,
            functionName: 'purchaseTokens',
            args: [BigInt(pendingPurchase.amount), pendingPurchase.paymentToken],
        });

        return Promise.resolve({
            to: mockIcoPlugin.address as Hex,
            data: transactionData,
            value: BigInt(0), // 根据实际需要调整value
        });
    }, [pendingPurchase]);

    // 处理交易成功
    const handleTransactionSuccess = useCallback(() => {
        if (pendingPurchase) {
            console.log(`成功购买 ${pendingPurchase.amount.toString()} ${pendingPurchase.tokenSymbol}，使用 ${pendingPurchase.paymentToken} 支付`);
        }
        setIsTransactionDialogOpen(false);
        setPendingPurchase(null);
    }, [pendingPurchase]);

    // 处理交易对话框关闭
    const handleTransactionDialogClose = useCallback(() => {
        setIsTransactionDialogOpen(false);
        setPendingPurchase(null);
    }, []);

    return (
        <>
            <Page.Header
                breadcrumbs={pageBreadcrumbs}
                stats={stats}
                title={icoName}
                avatar={<MemberAvatar size="2xl" />}
            />
            <Page.Content>
                <Page.Main>
                    {/* Token Header */}
                    {/* <Page.MainSection title={tokenDetails.name} description={tokenDetails.description}>
                        <IcoTokenHeader tokenDetails={tokenDetails} formatCurrency={formatCurrency} />
                    </Page.MainSection> */}

                    {/* Action Buttons */}

                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" onClick={handlePurchase}>购买</Button>
                        <Button variant="secondary">关注</Button>
                    </div>

                    {/* Token Metrics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <StatCard title="Market Cap" value={formatCurrency(tokenDetails.marketCap)} />
                        <StatCard title="Volume (24h)" value={formatCurrency(tokenDetails.volume24h)} />
                        <StatCard title="Circulating Supply" value={formatSupply(tokenDetails.circulatingSupply)} />
                        <StatCard
                            title="Max Supply"
                            value={tokenDetails.maxSupply > 0 ? formatSupply(tokenDetails.maxSupply) : 'No Limit'}
                        />
                    </div>
                    {/* ICO Information */}
                    <Page.MainSection title="Information">
                        <Card className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1 text-sm font-medium text-gray-500">Token Contract</h3>
                                <p className="font-mono text-sm break-all">{tokenDetails.contractAddress}</p>
                            </div>
                            <div>
                                <h3 className="mb-1 text-sm font-medium text-gray-500">Website</h3>
                                <a
                                    href={tokenDetails.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {tokenDetails.website}
                                </a>
                            </div>
                            <div>
                                <h3 className="mb-1 text-sm font-medium text-gray-500">Whitepaper</h3>
                                <a
                                    href={tokenDetails.whitepaper}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Download Whitepaper
                                </a>
                            </div>
                            <div>
                                <h3 className="mb-1 text-sm font-medium text-gray-500">Total Supply</h3>
                                <p>{formatSupply(tokenDetails.totalSupply)}</p>
                            </div>
                        </Card>
                    </Page.MainSection>

                    {/* Participation Info */}
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
                        <h2 className="mb-2 text-xl font-bold text-blue-800">How to Participate</h2>
                        <p className="mb-4 text-blue-700">
                            You can participate in the {tokenDetails.name} ICO through {dao.name}. Select the
                            &quot;Participate in ICO&quot; button above to begin the process.
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-blue-700">
                            <li>Connect your wallet</li>
                            <li>Choose your investment amount</li>
                            <li>Confirm transaction</li>
                            <li>Receive tokens after ICO completion</li>
                        </ul>
                    </div>
                </Page.Main>
                <Page.Aside>
                    <Page.AsideCard title={mockIcoActivePlugin.label}>
                        <DaoPluginInfo plugin={mockIcoActivePlugin.meta} daoId={id} type={PluginType.BODY} />
                    </Page.AsideCard>
                </Page.Aside>
            </Page.Content>
            
            {/* 购买代币对话框 */}
            <TokenPurchaseDialog
                isOpen={isPurchaseDialogOpen}
                onClose={() => setIsPurchaseDialogOpen(false)}
                tokenName={tokenDetails.name}
                tokenSymbol={tokenDetails.symbol}
                tokenPrice={tokenDetails.price}
                pluginAddress={mockIcoPlugin.address as Hex}
                network={dao.network}
                onConfirm={handlePurchaseConfirm}
            />
            
            {/* 交易对话框 */}
            <Dialog.Root open={isTransactionDialogOpen} onOpenChange={handleTransactionDialogClose}>
                {pendingPurchase && (
                    <TransactionDialog
                        title={`购买 ${pendingPurchase.tokenName} (${pendingPurchase.tokenSymbol})`}
                        description={`确认购买 ${String(pendingPurchase.amount)} ${pendingPurchase.tokenSymbol}，使用 ${pendingPurchase.paymentToken} 支付`}
                        submitLabel="确认并签名"
                        stepper={stepper}
                        prepareTransaction={handlePrepareTransaction}
                        network={dao.network}
                        onSuccess={handleTransactionSuccess}
                        onCancelClick={handleTransactionDialogClose}
                    />
                )}
            </Dialog.Root>
        </>
    );
};