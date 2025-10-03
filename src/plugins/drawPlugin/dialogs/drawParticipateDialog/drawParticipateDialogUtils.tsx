import type { ITransactionRequest } from '@/shared/utils/transactionUtils/transactionUtils.api';

export interface IBuildParticipateTransactionParams {
    /**
     * Address of the draw plugin contract.
     */
    pluginAddress: string;
    /**
     * Index of the proposal to participate in.
     */
    proposalIndex: bigint;
    /**
     * Option selected for participation.
     */
    option: bigint;
}

export class DrawParticipateDialogUtils {
    buildParticipateTransaction = (params: IBuildParticipateTransactionParams): ITransactionRequest => {
        const { pluginAddress } = params;

        // This would encode the actual participate function call
        // The actual implementation would depend on the draw contract ABI
        const data = '0x'; // This should be the encoded function call

        return {
            to: pluginAddress as `0x${string}`,
            data,
            value: BigInt(0),
        };
    };
}

export const drawParticipateDialogUtils = new DrawParticipateDialogUtils();