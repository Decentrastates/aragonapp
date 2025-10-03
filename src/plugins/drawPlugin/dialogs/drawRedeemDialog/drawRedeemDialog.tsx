'use client';

import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { Dialog, InputText, invariant } from '@cddao/gov-ui-kit';
import { useCallback, useState, type ChangeEvent } from 'react';
import { useAccount } from 'wagmi';
import { useNftHoldings, useRedemptionRequirements } from '../../hooks/useRewards';

export interface IDrawRedeemDialogParams {
    /**
     * DAO ID for the redemption.
     */
    daoId: string;
    /**
     * Callback called on redeem transaction success.
     */
    onSuccess: () => void;
}

export interface IDrawRedeemDialogProps extends IDialogComponentProps<IDrawRedeemDialogParams> {}

export const DrawRedeemDialog: React.FC<IDrawRedeemDialogProps> = (props) => {
    const { location } = props;
    invariant(location.params != null, 'DrawRedeemDialog: required parameters must be set.');
    const { daoId, onSuccess } = location.params;

    const { close } = useDialogContext();
    const { address } = useAccount();
    invariant(address != null, 'DrawRedeemDialog: user must be connected.');

    const { t } = useTranslations();

    // 获取用户持有的NFT
    const { nftHoldings } = useNftHoldings(daoId);

    // 获取兑换要求
    const { requirements } = useRedemptionRequirements(daoId);

    // 本次兑换数量状态
    const [redeemAmount, setRedeemAmount] = useState<string>('');

    // 计算可兑换的NFT组合数量
    const calculateAvailableCombos = useCallback(() => {
        // 根据用户持有的NFT和兑换要求计算可兑换的组合数量
        if (requirements.length === 0) {return 0;}

        // 简化实现：找到满足要求的最小倍数
        let minCombos = Infinity;
        for (const req of requirements) {
            const holding = nftHoldings.find((h) => h.id === req.nftId);
            if (!holding) {
                return 0; // 如果缺少必需的NFT，无法兑换
            }
            const possibleCombos = Math.floor((holding.quantity || 0) / req.requiredQuantity);
            minCombos = Math.min(minCombos, possibleCombos);
        }

        return isFinite(minCombos) ? minCombos : 0;
    }, [nftHoldings, requirements]);

    // 计算可兑换的token数量
    const calculateRedeemableTokens = useCallback(() => {
        // 假设每个组合可以兑换固定数量的token
        const availableCombos = calculateAvailableCombos();
        // 简化实现：每个组合兑换100个token
        return availableCombos * 100;
    }, [calculateAvailableCombos]);

    const availableCombos = calculateAvailableCombos();
    const redeemableTokens = calculateRedeemableTokens();

    // 处理兑换提交
    const handleSubmit = () => {
        // 这里应该处理实际的兑换逻辑
        console.log('兑换数量:', redeemAmount);
        // 调用成功回调
        onSuccess();
        // 关闭对话框
        close();
    };

    const handleClose = () => {
        close();
    };

    return (
        <Dialog.Root open={true} onOpenChange={(open) => {
            if (!open) {
                handleClose();
            }
        }}>
            <Dialog.Header
                title={t('app.plugins.draw.drawRedeemDialog.title')}
                onClose={handleClose}
            />
            <Dialog.Content className="max-w-md">
                <div className="space-y-4">
                    {/* 可兑换的NFT组合数量（只读） */}
                    <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                        <span className="font-medium">{t('app.plugins.draw.drawRedeemDialog.availableCombos')}</span>
                        <span className="font-bold">{availableCombos}</span>
                    </div>

                    {/* 本次兑换数量（输入框） */}
                    <div>
                        <InputText
                            value={redeemAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value;
                                // 只允许输入数字，并且不能超过可兑换数量
                                if (value === '' || /^\d+$/.test(value)) {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue <= availableCombos) {
                                        setRedeemAmount(value);
                                    } else if (value === '') {
                                        setRedeemAmount(value);
                                    }
                                }
                            }}
                            placeholder={t('app.plugins.draw.drawRedeemDialog.redeemAmountPlaceholder')}
                        />
                    </div>

                    {/* 可兑换token的数量（只读） */}
                    <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                        <span className="font-medium">{t('app.plugins.draw.drawRedeemDialog.redeemableTokens')}</span>
                        <span className="font-bold">{redeemableTokens} TOKEN</span>
                    </div>
                </div>
            </Dialog.Content>
            <Dialog.Footer
                primaryAction={{
                    label: t('app.plugins.draw.drawRedeemDialog.submit'),
                    onClick: handleSubmit,
                    disabled: !redeemAmount || parseInt(redeemAmount, 10) <= 0 || parseInt(redeemAmount, 10) > availableCombos
                }}
                secondaryAction={{
                    label: t('app.plugins.draw.drawRedeemDialog.cancel'),
                    onClick: handleClose
                }}
            />
        </Dialog.Root>
    );
};
