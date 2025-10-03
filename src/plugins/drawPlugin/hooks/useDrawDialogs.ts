import { useDialogContext } from '@/shared/components/dialogProvider';
import { DrawPluginDialogId } from '../constants/drawPluginDialogId';
import type { IDrawParticipateDialogParams } from '../dialogs/drawParticipateDialog';
import type { IDrawRedeemDialogParams } from '../dialogs/drawRedeemDialog';
import type { IDrawProposal } from '../types';
import { Network } from '@/shared/api/daoService';

export const useDrawDialogs = () => {
    const { open } = useDialogContext();

    const openParticipateDrawDialog = (params: IDrawParticipateDialogParams) => {
        open(DrawPluginDialogId.PARTICIPATE_DRAW, { params });
    };

    const openParticipateDrawDialogWithDaoId = (daoId: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        // TODO: 这里需要根据 daoId 获取相应的提案信息
        // 由于缺少实际的提案数据获取逻辑，暂时使用一个占位符
        const mockProposal: IDrawProposal = {
            // 使用 Partial 和类型断言来简化示例
        } as IDrawProposal;
        
        const params: IDrawParticipateDialogParams = {
            proposal: mockProposal,
            network: Network.ETHEREUM_MAINNET, // 默认网络，实际应该根据 daoId 获取
            onSuccess: () => {
                // 成功回调
                console.log('Draw participation successful');
            },
            transactionInfo: {
                title: 'Draw Participation',
                // description: 'Participating in the draw', // ITransactionInfo 类型不包含 description 属性
            }
        };
        
        open(DrawPluginDialogId.PARTICIPATE_DRAW, { params });
    };

    const openDrawHistoryDialog = () => {
        open(DrawPluginDialogId.DRAW_HISTORY);
    };

    const openRedeemRewardsDialog = (params: IDrawRedeemDialogParams) => {
        open(DrawPluginDialogId.REDEEM_REWARDS, { params });
    };

    return {
        openParticipateDrawDialog,
        openParticipateDrawDialogWithDaoId,
        openDrawHistoryDialog,
        openRedeemRewardsDialog,
    };
};