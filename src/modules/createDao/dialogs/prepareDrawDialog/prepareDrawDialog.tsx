'use client';

import { GovernanceDialogId } from '@/modules/governance/constants/governanceDialogId';
import type { IPublishProposalDialogParams } from '@/modules/governance/dialogs/publishProposalDialog';
import { PluginInterfaceType, useDao } from '@/shared/api/daoService';
import { usePinJson } from '@/shared/api/ipfsService/mutations';
import { type IDialogComponentProps, useDialogContext } from '@/shared/components/dialogProvider';
import {
    type ITransactionDialogActionParams,
    TransactionDialog,
    type TransactionDialogStep,
} from '@/shared/components/transactionDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useDaoPlugins } from '@/shared/hooks/useDaoPlugins';
import { useStepper } from '@/shared/hooks/useStepper';
import { invariant } from '@cddao/gov-ui-kit';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { IPrepareDrawDialogParams } from './prepareDrawDialog.api';
import type { TransactionReceipt } from 'viem';
import { prepareDrawDialogUtils } from './prepareDrawDialogUtils';
import type { IPrepareDrawMetadata } from './prepareDrawDialogUtils.api';

export enum PrepareDrawStep {
    PIN_METADATA = 'PIN_METADATA',
}

export interface IPrepareDrawDialogProps extends IDialogComponentProps<IPrepareDrawDialogParams> {}

export const PrepareDrawDialog: React.FC<IPrepareDrawDialogProps> = (props) => {
    const { location } = props;

    invariant(location.params != null, 'PrepareDrawDialog: required parameters must be set.');
    const { daoId, values, pluginAddress } = location.params;

    const { address } = useAccount();
    invariant(address != null, 'PrepareDrawDialog: user must be connected.');

    const { t } = useTranslations();
    const { status: pinJsonStatus, mutateAsync: pinJson } = usePinJson();
    const { open } = useDialogContext();

    const [drawMetadata, setDrawMetadata] = useState<IPrepareDrawMetadata>();
    
    // 添加防重复提交的ref
    const isSubmittingRef = useRef(false);
    // 添加步骤完成状态跟踪
    const [isPinMetadataStepCompleted, setIsPinMetadataStepCompleted] = useState(false);

    const { data: dao } = useDao({ urlParams: { id: daoId } });
    const [plugin] = useDaoPlugins({ daoId, pluginAddress }) ?? [];
    invariant(!!plugin, `PrepareDrawDialog: plugin with address "${pluginAddress}" not found.`);

    const isAdmin = plugin.meta.interfaceType === PluginInterfaceType.ADMIN;

    const stepper = useStepper<PrepareDrawStep | TransactionDialogStep>({
        initialActiveStep: PrepareDrawStep.PIN_METADATA,
    });
    const { nextStep, activeStep } = stepper;

    const handlePrepareTransaction = async () => {
        invariant(drawMetadata != null, 'PrepareDrawDialog: metadata not pinned');
        invariant(dao != null, 'PrepareDrawDialog: DAO cannot be fetched');

        const transaction = await prepareDrawDialogUtils.buildPrepareDrawTransaction({
            values,
            drawMetadata,
            dao,
        });

        return transaction;
    };

    const handlePinJson = useCallback(
        async (params: ITransactionDialogActionParams) => {
            // 检查是否正在提交，防止重复提交
            if (isSubmittingRef.current) {
                return;
            }
            
            isSubmittingRef.current = true;
            
            try {
                const { pluginsMetadata, drawMetadata } = prepareDrawDialogUtils.preparePluginsMetadata(values);
                
                // 按照 prepareProcessDialog.tsx 的方式处理元数据
                const pinMetadataPromises = pluginsMetadata.map((body) => pinJson({ body }, params));
                const pluginMetadata = (await Promise.all(pinMetadataPromises)).map(({ IpfsHash }) => IpfsHash);

                // 正确初始化 drawMetadataResult，包含所有必要字段
                const drawMetadataResult: IPrepareDrawMetadata = {
                    plugins: pluginMetadata,
                    draw: '', // 初始化为空字符串而不是 undefined
                    name: drawMetadata.name,
                    description: drawMetadata.description,
                    resources: drawMetadata.resources,
                    processKey: drawMetadata.processKey,
                    contracts: drawMetadata.contracts
                };
                
                // 处理 drawMetadata
                const { IpfsHash: drawMetadataHash } = await pinJson({ body: drawMetadata }, params);
                drawMetadataResult.draw = drawMetadataHash;

                setDrawMetadata(drawMetadataResult);
                setIsPinMetadataStepCompleted(true); // 标记步骤已完成
            } finally {
                // 确保在完成后重置提交状态
                isSubmittingRef.current = false;
            }
        },
        [pinJson, values],
    );

    // 当PIN_METADATA步骤完成后，自动切换到下一步
    useEffect(() => {
        if (isPinMetadataStepCompleted && activeStep === PrepareDrawStep.PIN_METADATA) {
            nextStep();
        }
    }, [isPinMetadataStepCompleted, activeStep, nextStep]);

    const handlePrepareInstallationSuccess = (txReceipt: TransactionReceipt) => {
        // 执行成功处理逻辑
        handleSuccessLogic(txReceipt);
    };

    const handleSuccessLogic = (txReceipt: TransactionReceipt) => {
        invariant(dao != null, 'PrepareDrawDialog: DAO cannot be fetched');

        const executeConditionAddress = undefined; // Draw plugin doesn't use execute condition like process plugin
        
        const setupData = prepareDrawDialogUtils.getPluginInstallationSetupData(txReceipt);
        
        // 验证setupData
        if (setupData.length === 0) {
            throw new Error('No setup data found in transaction receipt');
        }

        const proposalActions = prepareDrawDialogUtils.buildPublishDrawProposalActions({
            values,
            dao,
            setupData,
            executeConditionAddress,
        });
        
        // 验证提案操作
        if (proposalActions.length === 0) {
            throw new Error('No proposal actions generated');
        }

        const proposalMetadata = prepareDrawDialogUtils.preparePublishDrawProposalMetadata();
        
        const translationNamespace = `app.plugins.draw.publishDrawDialog.${isAdmin ? 'admin' : 'default'}`;

        const txInfo = { title: t('app.plugins.draw.prepareDrawDialog.transactionInfoTitle'), current: 2, total: 2 };
        
        const params: IPublishProposalDialogParams = {
            proposal: { 
                ...proposalMetadata, 
                resources: [], 
                actions: proposalActions
            },
            daoId,
            plugin: plugin.meta,
            translationNamespace,
            transactionInfo: txInfo,
        };
        
        open(GovernanceDialogId.PUBLISH_PROPOSAL, { params });
    };

    const pinMetadataNamespace = `app.plugins.draw.prepareDrawDialog.step.${PrepareDrawStep.PIN_METADATA}`;
    const customSteps = useMemo(
        () => [
            {
                id: PrepareDrawStep.PIN_METADATA,
                order: 0,
                meta: {
                    label: t(`${pinMetadataNamespace}.label`),
                    errorLabel: t(`${pinMetadataNamespace}.errorLabel`),
                    // 使用usePinJson的status状态，并结合完成状态
                    state: isPinMetadataStepCompleted ? 'success' : pinJsonStatus,
                    action: handlePinJson,
                    auto: true, // 自动执行
                },
            },
        ],
        [handlePinJson, pinMetadataNamespace, t, isPinMetadataStepCompleted, pinJsonStatus],
    );

    return (
        <TransactionDialog<PrepareDrawStep | TransactionDialogStep>
            title={t('app.plugins.draw.prepareDrawDialog.title')}
            description={t('app.plugins.draw.prepareDrawDialog.description')}
            submitLabel={t('app.plugins.draw.prepareDrawDialog.button.submit')}
            onSuccess={handlePrepareInstallationSuccess}
            transactionInfo={{
                title: t('app.plugins.draw.prepareDrawDialog.transactionInfoTitle'),
                current: 1,
                total: 2,
            }}
            stepper={stepper}
            customSteps={customSteps}
            prepareTransaction={handlePrepareTransaction}
            network={dao?.network}
        />
    );
};