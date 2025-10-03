'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Dialog, InputContainer, InputText } from '@cddao/gov-ui-kit';
import { useEffect, useState } from 'react';

export interface IAddNftUnitDialogProps {
    /**
     * Whether the dialog is open
     */
    isOpen: boolean;
    /**
     * Callback when the dialog is closed
     */
    onClose: () => void;
    /**
     * Callback when a new NFT unit is added
     */
    onAdd: (nftId: string, nftUnit: string) => void;
    /**
     * Maximum NFT ID allowed (from Step 2)
     */
    maxNftId?: number;
}

export const AddNftUnitDialog: React.FC<IAddNftUnitDialogProps> = (props) => {
    const { isOpen, onClose, onAdd, maxNftId } = props;

    const { t } = useTranslations();
    const [nftId, setNftId] = useState<string>('');
    const [nftUnit, setNftUnit] = useState<string>('1'); // Default NFT unit to 1

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setNftId('');
            setNftUnit('1'); // Reset to default value of 1
        }
    }, [isOpen]);

    const handleAdd = (e: React.FormEvent) => {
        // 阻止事件冒泡，防止触发父级表单提交
        e.preventDefault();
        e.stopPropagation();
        
        // Validate inputs
        if (!nftId || !nftUnit) {
            alert(t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdAndUnitRequired'));
            return;
        }

        // Validate NFT ID is within allowed range
        const nftIdNum = BigInt(nftId);
        if (maxNftId && Number(nftIdNum) > maxNftId) {
            alert(
                t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdOutOfRange', {
                    maxId: maxNftId,
                }),
            );
            return;
        }

        // Validate NFT ID is at least 1
        if (Number(nftIdNum) < 1) {
            alert(
                t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdOutOfRange', {
                    maxId: maxNftId ? `1-${String(maxNftId)}` : '>= 1',
                }),
            );
            return;
        }

        onAdd(nftId, nftUnit);
        // Reset form
        setNftId('');
        setNftUnit('1'); // Reset to default value of 1
        onClose();
    };

    const handleCancel = () => {
        // Reset form
        setNftId('');
        setNftUnit('1'); // Reset to default value of 1
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Header
                onClose={onClose}
                title={t('app.plugins.draw.createDrawForm.step4.swapRules.addNftUnit')}
            />
            <Dialog.Content>
                <form onSubmit={handleAdd}>
                    <div className="flex flex-col gap-4">
                        <InputContainer id="nft-id" label={t('app.plugins.draw.proposalSettings.nftId')}>
                            <InputText
                                value={nftId}
                                onChange={(e) => setNftId(e.target.value)}
                                placeholder={maxNftId ? `1-${String(maxNftId)}` : '>= 1'}
                            />
                        </InputContainer>

                        <InputContainer id="nft-unit" label={t('app.plugins.draw.proposalSettings.nftUnit')}>
                            <InputText value={nftUnit} onChange={(e) => setNftUnit(e.target.value)} placeholder="1" />
                        </InputContainer>
                    </div>
                </form>
            </Dialog.Content>
            <Dialog.Footer
                primaryAction={{
                    label: t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnitAddButton'),
                    onClick: handleAdd,
                }}
                secondaryAction={{
                    label: t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnitCancelButton'),
                    onClick: handleCancel,
                }}
            />
        </Dialog.Root>
    );
};