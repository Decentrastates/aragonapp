'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { InputContainer, InputNumber } from '@cddao/gov-ui-kit';
import { useEffect, useState } from 'react';
import type { IErc1155Combo } from '../../../../../types/drawPluginSettings';
import { EligibilityRules } from '../../eligibilityRules';
import { AddNftUnitDialog } from './addNftUnitDialog';

export interface IErc1155ComboFormProps {
    /**
     * Current value of the NFT combo
     */
    value?: IErc1155Combo;
    /**
     * Callback when the value changes
     */
    onChange: (value: IErc1155Combo) => void;
    /**
     * Maximum NFT ID allowed (from Step 2)
     */
    maxNftId?: number;
    /**
     * Token A address (from Step 3)
     */
    tokenA?: string;
    formPrefix?: string;
}

export const NftComboForm: React.FC<IErc1155ComboFormProps> = (props) => {
    const { value, onChange, maxNftId, formPrefix } = props;
    // console.log('NftComboForm', props);

    const { t } = useTranslations();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [comboValue, setComboValue] = useState<IErc1155Combo>(
        value?.erc1155Units ? value : {
            erc1155Units: [],
            maxExchangeCount: 0,
            maxSingleBatch: 0,
            currentExchangeCount: 0,
        },
    );

    // 当传入的value变化时，更新内部状态
    useEffect(() => {
        if (value?.erc1155Units) {
            setComboValue(value);
        }
    }, [value]);

    const handleOpenAddDialog = (e: React.MouseEvent | React.KeyboardEvent) => {
        // 阻止事件冒泡，防止触发父级表单提交
        e.preventDefault();
        e.stopPropagation();
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    const handleAddErc1155Unit = (nftId: number, nftUnit: number) => {
        // 不进行任何格式转换，只做基本验证
        // 验证 NFT ID 是否在允许范围内（但不进行类型转换）
        if (maxNftId) {
            if (nftId > maxNftId) {
                alert(
                    t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdOutOfRange', {
                        maxId: maxNftId,
                    }),
                );
                return;
            }
        }

        // Check if NFT ID already exists in the combo
        const existingUnit = comboValue.erc1155Units.find((unit) => unit.id === nftId);
        if (existingUnit) {
            alert(t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdAlreadyExists'));
            return;
        }

        const updatedCombo: IErc1155Combo = {
            ...comboValue,
            erc1155Units: [
                ...comboValue.erc1155Units,
                {
                    id: nftId,
                    unit: nftUnit,
                },
            ],
        };

        setComboValue(updatedCombo);
        onChange(updatedCombo);
    };

    const handleRemoveErc1155Unit = (index: number) => {
        const updatedNftUnits = [...comboValue.erc1155Units];
        updatedNftUnits.splice(index, 1);

        const updatedCombo: IErc1155Combo = {
            ...comboValue,
            erc1155Units: updatedNftUnits,
        };

        setComboValue(updatedCombo);
        onChange(updatedCombo);
    };

    const handleComboSettingChange = <K extends keyof IErc1155Combo>(field: K, value: IErc1155Combo[K]) => {
        const updatedCombo: IErc1155Combo = {
            ...comboValue,
            [field]: value,
        };

        setComboValue(updatedCombo);
        onChange(updatedCombo);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">
                    {t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoTitle')}
                </h4>
                <p className="text-sm text-blue-700">
                    {tokenA 
                        ? t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoWithAddress', { tokenA })
                        : t('app.plugins.draw.createDrawForm.step4.swapRules.tokenAInfoWithoutAddress')}
                </p>
            </div> */}
            <EligibilityRules fieldPrefix={formPrefix} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxExchangeCount')}
                    value={comboValue.maxExchangeCount}
                    onChange={(value: string) => handleComboSettingChange('maxExchangeCount', Number(value))}
                />
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxSingleBatch')}
                    value={comboValue.maxSingleBatch}
                    onChange={(value: string) => handleComboSettingChange('maxSingleBatch', Number(value))}
                />
            </div>

            <InputContainer
                id="nft-combo-units"
                label={t('app.plugins.draw.createDrawForm.step4.swapRules.nftComboUnits')}
            >
                <div className="flex flex-wrap gap-2 p-4">
                    {' '}
                    {/* Changed from space-y-2 to flex-wrap with gap and padding */}
                    {comboValue.erc1155Units.map((unit, index) => (
                        <div
                            key={index}
                            className="relative flex flex-grow-0 items-center rounded-lg border border-neutral-200 bg-white px-3 py-1 transition-colors duration-150 hover:bg-neutral-50"
                        >
                            {' '}
                            {/* Changed to adaptive width with proper padding */}
                            <div className="flex min-w-0 flex-col">
                                {' '}
                                {/* Removed right padding as we're using badge style */}
                                <span className="font-medium break-words">
                                    {t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnit', {
                                        id: unit.id,
                                        unit: unit.unit,
                                    })}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveErc1155Unit(index)}
                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-sm transition-colors duration-150 hover:bg-red-600"
                                aria-label={t('app.plugins.draw.proposalSettings.remove')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {/* Add NFT Unit button always at the end of the list */}
                    <button
                        type="button"
                        className="flex flex-grow-0 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-blue-500 px-3 py-1 transition-colors duration-150 hover:bg-blue-600"
                        onClick={handleOpenAddDialog}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleOpenAddDialog(e);
                            }
                        }}
                        aria-label={t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnitAddButton')}
                    >
                        <div className="my-1 flex min-w-0 flex-col text-center">
                            <span className="font-medium text-white">
                                {t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnitAddButton')}
                            </span>
                        </div>
                    </button>
                </div>
            </InputContainer>

            <AddNftUnitDialog
                isOpen={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                onAdd={handleAddErc1155Unit}
                maxNftId={maxNftId}
            />
        </div>
    );
};
