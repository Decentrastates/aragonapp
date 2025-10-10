'use client';

import { GovernanceDialogId } from '@/modules/governance/constants/governanceDialogId';
import type { IPublishProposalDialogParams } from '@/modules/governance/dialogs/publishProposalDialog';
import { PluginInterfaceType, useDao } from '@/shared/api/daoService';
import { usePinJson } from '@/shared/api/ipfsService/mutations';
import { type IDialogComponentProps, useDialogContext } from '@/shared/components/dialogProvider';
import {
    type ITransactionDialogActionParams,
    type ITransactionDialogStepMeta,
    TransactionDialog,
    type TransactionDialogStep,
} from '@/shared/components/transactionDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useDaoPlugins } from '@/shared/hooks/useDaoPlugins';
import { useStepper } from '@/shared/hooks/useStepper';
import { invariant } from '@cddao/gov-ui-kit';
import { useCallback, useMemo, useState } from 'react';
import type { TransactionReceipt } from 'viem';
import { useAccount } from 'wagmi';
import type { IPrepareDrawDialogParams } from './prepareDrawDialog.api';
import { prepareDrawDialogUtils } from './prepareDrawDialogUtils';
import type { IBuildDrawTransactionParams, IPrepareDrawMetadata } from './prepareDrawDialogUtils.api';

export enum PrepareDrawStep {
    PIN_METADATA = 'PIN_METADATA',
}

export interface IPrepareDrawDialogProps extends IDialogComponentProps<IPrepareDrawDialogParams> {}

export const PrepareDrawDialog: React.FC<IPrepareDrawDialogProps> = (props) => {
    const { location } = props;
    // console.log('PrepareDrawDialog', props);

    invariant(location.params != null, 'PrepareDrawDialog: required parameters must be set.');
    const { daoId, values, pluginAddress } = location.params;

    const { address } = useAccount();
    invariant(address != null, 'PrepareDrawDialog: user must be connected.');

    const { t } = useTranslations();
    const { status, mutateAsync: pinJson } = usePinJson();
    const { open } = useDialogContext();

    const [drawMetadata, setDrawMetadata] = useState<IPrepareDrawMetadata>();

    const { data: dao } = useDao({ urlParams: { id: daoId } });
    const [plugin] = useDaoPlugins({ daoId, pluginAddress }) ?? [];
    invariant(!!plugin, `PrepareDrawDialog: plugin with address "${pluginAddress}" not found.`);

    const isAdmin = plugin.meta.interfaceType === PluginInterfaceType.ADMIN;

    const stepper = useStepper<ITransactionDialogStepMeta, PrepareDrawStep | TransactionDialogStep>({
        initialActiveStep: PrepareDrawStep.PIN_METADATA,
    });
    const { nextStep } = stepper;
    // 交易数据
    const handlePrepareTransaction = async () => {
        invariant(drawMetadata != null, 'PrepareDrawDialog: metadata not pinned');
        invariant(dao != null, 'PrepareDrawDialog: DAO cannot be fetched');

        const params: IBuildDrawTransactionParams = { values, drawMetadata, dao };
        const transaction = await prepareDrawDialogUtils.buildPrepareDrawTransaction(params);

        return transaction;
    };
    // 插件元数据转换为CID
    const handlePinJson = useCallback(
        async (params: ITransactionDialogActionParams) => {
            const { pluginsMetadata } = prepareDrawDialogUtils.preparePluginsMetadata(values);

            const pinMetadataPromises = pluginsMetadata.map((body) => pinJson({ body }, params));
            const pluginMetadataResults = await Promise.all(pinMetadataPromises);
            const pluginMetadata = pluginMetadataResults.map(({ IpfsHash }) => IpfsHash);

            const metadata: IPrepareDrawMetadata = { plugins: pluginMetadata };

            setDrawMetadata(metadata);
            nextStep();
        },
        [pinJson, nextStep, values],
    );

    const handlePrepareInstallationSuccess = (txReceipt: TransactionReceipt) => {
        invariant(dao != null, 'PrepareDrawDialog: DAO cannot be fetched');

        const setupData = prepareDrawDialogUtils.getPluginInstallationSetupData(txReceipt);

        // 验证setupData
        if (setupData.length === 0) {
            throw new Error('No setup data found in transaction receipt');
        }

        const proposalActions = prepareDrawDialogUtils.buildPublishDrawProposalActions({
            values,
            dao,
            setupData,
        });

        // 验证提案操作
        if (proposalActions.length === 0) {
            throw new Error('No proposal actions generated');
        }

        const proposalMetadata = prepareDrawDialogUtils.preparePublishDrawProposalMetadata();

        const translationNamespace = `app.plugins.draw.publishDrawDialog.${isAdmin ? 'admin' : 'default'}`;

        const txInfo = { title: t(`${translationNamespace}.transactionInfoTitle`), current: 2, total: 2 };

        const params: IPublishProposalDialogParams = {
            proposal: {
                ...proposalMetadata,
                resources: [],
                actions: proposalActions,
            },
            daoId,
            plugin: plugin.meta,
            translationNamespace,
            transactionInfo: txInfo,
        };

        console.log('handlePrepareInstallationSuccess ---- ', {
            params,
        });

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
                    state: status,
                    action: handlePinJson,
                    auto: true,
                },
            },
        ],
        [status, handlePinJson, pinMetadataNamespace, t],
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
