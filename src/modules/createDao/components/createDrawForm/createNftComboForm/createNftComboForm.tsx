import { useTranslations } from '@/shared/components/translationsProvider';
import { Button, InputContainer, InputNumber, InputText, Switch } from '@cddao/gov-ui-kit';
import { useState } from 'react';
import type { IErc1155Combo, IErc1155ComboUnit } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';

export interface IErc1155ComboInputProps {
    /**
     * Current value of the NFT combo
     */
    value?: IErc1155Combo;
    /**
     * Callback when the value changes
     */
    onChange: (value: IErc1155Combo) => void;
    /**
     * Prefix to prepend to all the form fields
     */
    fieldPrefix?: string;
    /**
     * Maximum NFT ID allowed (from Step 2)
     */
    maxNftId?: number;
}

export const CreateNftComboForm: React.FC<IErc1155ComboInputProps> = (props) => {
    const { value, onChange, maxNftId } = props;

    const { t } = useTranslations();
    const [newErc1155Unit, setNewErc1155Unit] = useState<{ nftId?: string; nftUnit?: number }>({
        nftId: '',
        nftUnit: 1,
    });

    // Initialize with default combo if not provided
    const comboValue: IErc1155Combo = value ?? {
        comboId: "1",
        nftUnits: [],
        isEnabled: true,
        maxExchangeCount: 0,
        maxSingleBatch: 0,
        currentExchangeCount: 0,
    };

    const handleAddErc1155Unit = () => {
        if (newErc1155Unit.nftId && newErc1155Unit.nftUnit) {
            // Validate NFT ID is within allowed range
            const nftId = newErc1155Unit.nftId;
            if (maxNftId && Number(nftId) > maxNftId) {
                alert(t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdOutOfRange', {
                    maxId: maxNftId
                }));
                return;
            }

            const updatedCombo: IErc1155Combo = {
                ...comboValue,
                nftUnits: [
                    ...comboValue.nftUnits,
                    {
                        id: nftId,
                        unit: newErc1155Unit.nftUnit,
                    }
                ]
            };
            
            onChange(updatedCombo);
            
            // Reset the new NFT unit form
            setNewErc1155Unit({
                nftId: '1',
                nftUnit: 1,
            });
        }
    };

    const handleRemoveErc1155Unit = (index: number) => {
        const updatedNftUnits = [...comboValue.nftUnits];
        updatedNftUnits.splice(index, 1);
        
        const updatedCombo: IErc1155Combo = {
            ...comboValue,
            nftUnits: updatedNftUnits
        };
        
        onChange(updatedCombo);
    };

    const handleComboSettingChange = <K extends keyof IErc1155Combo>(field: K, value: IErc1155Combo[K]) => {
        const updatedCombo: IErc1155Combo = {
            ...comboValue,
            [field]: value
        };
        onChange(updatedCombo);
    };

    return (
        <div className="flex flex-col gap-4">
            <InputContainer
                id="nft-combo-units"
                label={t('app.plugins.draw.createDrawForm.step4.swapRules.nftComboUnits')}
            >
                {comboValue.nftUnits.map((unit: IErc1155ComboUnit, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnit', {
                                    id: unit.id, /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
                                    unit: unit.unit /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
                                })}
                            </span>
                        </div>
                        <Button variant="ghost" onClick={() => handleRemoveErc1155Unit(index)}>
                            {t('app.plugins.draw.proposalSettings.remove')}
                        </Button>
                    </div>
                ))}
                
                {comboValue.nftUnits.length === 0 && (
                    <p className="text-sm text-neutral-500">
                        {t('app.plugins.draw.createDrawForm.step4.swapRules.noNftUnits')}
                    </p>
                )}
            </InputContainer>
            
            <InputContainer
                id="add-nft-unit"
                label={t('app.plugins.draw.createDrawForm.step4.swapRules.addNftUnit')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputText
                        label={t('app.plugins.draw.proposalSettings.nftId')}
                        value={newErc1155Unit.nftId ?? ''}
                        onChange={(e) => setNewErc1155Unit({...newErc1155Unit, nftId: e.target.value})}
                    />
                    <InputNumber
                        label={t('app.plugins.draw.proposalSettings.nftUnit')}
                        value={newErc1155Unit.nftUnit ?? 0}
                        onChange={(value) => setNewErc1155Unit({...newErc1155Unit, nftUnit: Number(value)})}
                    />
                </div>
                <div className="mt-4">
                    <Button onClick={handleAddErc1155Unit}>
                        {t('app.plugins.draw.createDrawForm.step4.swapRules.addNftUnitButton')}
                    </Button>
                </div>
            </InputContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxExchangeCount')}
                    value={comboValue.maxExchangeCount}
                    onChange={(value) => handleComboSettingChange('maxExchangeCount', Number(value)) /* eslint-disable-line @typescript-eslint/no-unnecessary-type-conversion */}
                />
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxSingleBatch')}
                    value={comboValue.maxSingleBatch}
                    onChange={(value) => handleComboSettingChange('maxSingleBatch', Number(value)) /* eslint-disable-line @typescript-eslint/no-unnecessary-type-conversion */}
                />
                <Switch
                    label={t('app.plugins.draw.proposalSettings.isEnabled')}
                    checked={comboValue.isEnabled}
                    onCheckedChanged={(checked: boolean) => handleComboSettingChange('isEnabled', checked)}
                />
            </div>
        </div>
    );
};