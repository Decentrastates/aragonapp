import { useConnectedWalletGuard } from '@/modules/application/hooks/useConnectedWalletGuard';
import type { Network } from '@/shared/api/daoService';
import { TransactionDialog, TransactionDialogStep } from '@/shared/components/transactionDialog';
import { useStepper } from '@/shared/hooks/useStepper';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils/transactionUtils.api';
import {
    Dialog,
    InputText,
} from '@cddao/gov-ui-kit';
import { Select } from '@/shared/components/select';
import type React from 'react';
import { useState, type ChangeEvent } from 'react';
import { encodeFunctionData, type Hex } from 'viem';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { ApplicationDialogId } from '@/modules/application/constants/applicationDialogId';

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

export interface ITokenPurchaseDialogProps {
    /**
     * Whether the dialog is open.
     */
    isOpen: boolean;
    /**
     * Callback when the dialog is closed.
     */
    onClose: () => void;
    /**
     * Token name to display in the dialog.
     */
    tokenName: string;
    /**
     * Token symbol to display in the dialog.
     */
    tokenSymbol: string;
    /**
     * Current price of the token in USD.
     */
    tokenPrice: number;
    /**
     * ICO plugin address
     */
    pluginAddress: Hex;
    /**
     * Network used for the transaction.
     */
    network: Network;
    /**
     * Callback when the purchase is confirmed.
     */
    onConfirm: (amount: number, paymentToken: string) => void;
}

export const TokenPurchaseDialog: React.FC<ITokenPurchaseDialogProps> = (props) => {
    const { isOpen, onClose, tokenName, tokenSymbol, tokenPrice, pluginAddress, network, onConfirm } = props;

    // State for form inputs
    const [tokenAmount, setTokenAmount] = useState<string>('');
    const [paymentToken, setPaymentToken] = useState<string>('USDT');

    // Transaction dialog state
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [pendingPurchase, setPendingPurchase] = useState<{ amount: number; paymentToken: string } | null>(null);

    // Calculate total cost based on token amount and price
    const totalCost = tokenAmount ? (parseFloat(tokenAmount) * tokenPrice).toFixed(2) : '0.00';

    // Available payment tokens
    const paymentTokens = [
        { value: 'USDT', label: 'USDT' },
        { value: 'USDC', label: 'USDC' },
    ];

    // Wallet connection guard
    const { result: isConnected } = useConnectedWalletGuard();
    const { open } = useDialogContext();

    // Transaction stepper
    const stepper = useStepper<TransactionDialogStep>({ initialActiveStep: TransactionDialogStep.PREPARE });

    // Handle purchase confirmation
    const handleConfirm = () => {
        const amount = parseFloat(tokenAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('请输入有效的代币数量');
            return;
        }

        // Store pending purchase info
        setPendingPurchase({ amount, paymentToken });

        // Close the current dialog
        onClose();
        
        // Check wallet connection before proceeding
        if (!isConnected) {
            // If wallet is not connected, open the connect wallet dialog
            open(ApplicationDialogId.CONNECT_WALLET, {
                params: {
                    onSuccess: () => {
                        // After successful connection, notify parent to open transaction dialog
                        onConfirm(amount, paymentToken);
                    },
                    onError: () => {
                        // User cancelled wallet connection
                        setPendingPurchase(null);
                    },
                },
            });
        } else {
            // Wallet is already connected, notify parent to open transaction dialog directly
            onConfirm(amount, paymentToken);
        }
    };

    // Prepare transaction
    const handlePrepareTransaction = (): Promise<ITransactionRequest> => {
        if (!pendingPurchase) {
            throw new Error('No pending purchase');
        }

        // Encode the purchase function call based on the ICO contract ABI
        const transactionData = encodeFunctionData({
            abi: icoPluginAbi,
            functionName: 'purchaseTokens',
            args: [BigInt(pendingPurchase.amount), pendingPurchase.paymentToken],
        });

        return Promise.resolve({
            to: pluginAddress,
            data: transactionData,
            value: BigInt(0), // 根据实际需要调整value
        });
    };

    // Handle transaction success
    const handleTransactionSuccess = () => {
        if (pendingPurchase) {
            onConfirm(pendingPurchase.amount, pendingPurchase.paymentToken);
        }
        setIsTransactionDialogOpen(false);
        setPendingPurchase(null);
    };

    // Handle token amount change
    const handleTokenAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTokenAmount(e.target.value);
    };

    // Handle payment token change
    const handlePaymentTokenChange = (value: string) => {
        setPaymentToken(value);
    };

    // Handle transaction dialog close
    const handleTransactionDialogClose = () => {
        setIsTransactionDialogOpen(false);
        setPendingPurchase(null);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Header title={`购买 ${tokenName} (${tokenSymbol})`} onClose={onClose} />
            <Dialog.Content className="max-w-md">
                <div className="space-y-4 py-6">
                    <div className="space-y-2">
                        <label htmlFor="tokenAmount" className="text-sm font-medium text-gray-700">
                            购买数量
                        </label>
                        <InputText
                            id="tokenAmount"
                            placeholder="输入购买数量"
                            value={tokenAmount}
                            onChange={handleTokenAmountChange}
                        />
                        <p className="text-sm text-gray-500">
                            当前价格:{' '}
                            {tokenPrice.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{' '}
                            per {tokenSymbol}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="paymentToken" className="text-sm font-medium text-gray-700">
                            支付代币
                        </label>
                        <Select
                            id="paymentToken"
                            options={paymentTokens.map(token => ({ value: token.value, label: token.label }))}
                            value={paymentToken}
                            onValueChange={handlePaymentTokenChange}
                            placeholder="选择支付代币"
                        />
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="flex justify-between">
                            <span className="font-medium">总计:</span>
                            <span className="font-semibold">
                                {totalCost} {paymentToken}
                            </span>
                        </div>
                    </div>
                </div>
            </Dialog.Content>

            <Dialog.Footer
                primaryAction={{
                    label: '确认购买',
                    onClick: handleConfirm,
                }}
                secondaryAction={{
                    label: '取消',
                    onClick: onClose,
                }}
            />
            
            {/* Transaction Dialog */}
            {isTransactionDialogOpen && pendingPurchase && (
                <TransactionDialog
                    title={`购买 ${tokenName} (${tokenSymbol})`}
                    description={`确认购买 ${String(pendingPurchase.amount)} ${tokenSymbol}，使用 ${pendingPurchase.paymentToken} 支付`}
                    submitLabel="确认并签名"
                    stepper={stepper}
                    prepareTransaction={handlePrepareTransaction}
                    network={network}
                    onSuccess={handleTransactionSuccess}
                    onCancelClick={handleTransactionDialogClose}
                />
            )}
        </Dialog.Root>
    );
};