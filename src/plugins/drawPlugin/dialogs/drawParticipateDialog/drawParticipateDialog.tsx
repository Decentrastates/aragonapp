'use client';

import type { Network } from '@/shared/api/daoService';
import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import {
    TransactionDialog,
    TransactionDialogStep,
} from '@/shared/components/transactionDialog';
import type { ITransactionInfo } from '@/shared/components/transactionStatus';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useStepper } from '@/shared/hooks/useStepper';
import { AssetDataListItem, invariant } from '@cddao/gov-ui-kit';
import { useAccount } from 'wagmi';
import type { IDrawProposal } from '../../types';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils/transactionUtils.api';
import { encodeFunctionData } from 'viem';
import { drawPluginAbi } from '../../utils/drawTransactionUtils';

export interface IDrawParticipateDialogParams {
    /**
     * Proposal to participate in.
     */
    proposal: IDrawProposal;
    /**
     * Network used for the transaction.
     */
    network: Network;
    /**
     * Callback called on participate transaction success.
     */
    onSuccess: () => void;
    /**
     * Transaction info for the dialog.
     */
    transactionInfo: ITransactionInfo;
}

export interface IDrawParticipateDialogProps extends IDialogComponentProps<IDrawParticipateDialogParams> {}

export const DrawParticipateDialog: React.FC<IDrawParticipateDialogProps> = (props) => {
    const { location } = props;
    invariant(location.params != null, 'DrawParticipateDialog: required parameters must be set.');
    const { proposal, network, onSuccess, transactionInfo } = location.params;

    const { address } = useAccount();
    invariant(address != null, 'DrawParticipateDialog: user must be connected.');

    const { t } = useTranslations();

    const initialActiveStep = TransactionDialogStep.PREPARE;
    // 明确指定泛型参数为TransactionDialogStep，与ITransactionDialogProps接口匹配
    const stepper = useStepper<TransactionDialogStep>({ initialActiveStep });

    const handlePrepareTransaction = (): Promise<ITransactionRequest> => {
        // Encode the participate function call based on the draw contract ABI
        // Using drawNFT as the default participation method
        const transactionData = encodeFunctionData({
            abi: drawPluginAbi,
            functionName: 'drawNFT',
            args: ['0x'] // Placeholder for signature, should be replaced with actual signature
        });

        return Promise.resolve({
            to: proposal.pluginAddress as `0x${string}`,
            data: transactionData,
            value: BigInt(0),
        });
    };

    return (
        <TransactionDialog
            title={t('app.plugins.draw.drawParticipateDialog.title')}
            description={t('app.plugins.draw.drawParticipateDialog.description')}
            submitLabel={t('app.plugins.draw.drawParticipateDialog.submit')}
            stepper={stepper}
            prepareTransaction={handlePrepareTransaction}
            network={network}
            onSuccess={onSuccess}
            transactionInfo={transactionInfo}
        >
            <AssetDataListItem.Structure
                name={proposal.title}
                amount="1"
                symbol={t('app.plugins.draw.drawParticipateDialog.entry')}
                hideValue={true}
            />
        </TransactionDialog>
    );
};