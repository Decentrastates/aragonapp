import { useTranslations } from '@/shared/components/translationsProvider';
import { Button, InputContainer, InputNumber, InputText, Switch } from '@cddao/gov-ui-kit';
import { useState } from 'react';
import type { INftCombo, INftComboUnit } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';

export interface INftComboInputProps {
    /**
     * Current value of the NFT combo
     */
    value?: INftCombo;
    /**
     * Callback when the value changes
     */
    onChange: (value: INftCombo) => void;
    /**
     * Prefix to prepend to all the form fields
     */
    fieldPrefix?: string;
    /**
     * Maximum NFT ID allowed (from Step 2)
     */
    maxNftId?: number;
}

export const CreateNftComboForm: React.FC<INftComboInputProps> = (props) => {
    const { value, onChange, maxNftId } = props;

    const { t } = useTranslations();
    const [newNftUnit, setNewNftUnit] = useState<{ nftId?: string; nftUnit?: string }>({
        nftId: '',
        nftUnit: '',
    });

    // Initialize with default combo if not provided
    const comboValue: INftCombo = value ?? {
        comboId: "1",
        nftUnits: [],
        isEnabled: true,
        maxExchangeCount: "0",
        maxSingleBatch: "0",
        currentExchangeCount: "0",
    };

    const handleAddNftUnit = () => {
        if (newNftUnit.nftId && newNftUnit.nftUnit) {
            // Validate NFT ID is within allowed range
            const nftId = BigInt(newNftUnit.nftId);
            if (maxNftId && Number(nftId) > maxNftId) {
                alert(t('app.plugins.draw.createDrawForm.step4.swapRules.nftIdOutOfRange', {
                    maxId: maxNftId
                }));
                return;
            }

            const updatedCombo: INftCombo = {
                ...comboValue,
                nftUnits: [
                    ...comboValue.nftUnits,
                    {
                        id: nftId.toString(),
                        unit: newNftUnit.nftUnit,
                    }
                ]
            };
            
            onChange(updatedCombo);
            
            // Reset the new NFT unit form
            setNewNftUnit({
                nftId: '',
                nftUnit: '',
            });
        }
    };

    const handleRemoveNftUnit = (index: number) => {
        const updatedNftUnits = [...comboValue.nftUnits];
        updatedNftUnits.splice(index, 1);
        
        const updatedCombo: INftCombo = {
            ...comboValue,
            nftUnits: updatedNftUnits
        };
        
        onChange(updatedCombo);
    };

    const handleComboSettingChange = <K extends keyof INftCombo>(field: K, value: INftCombo[K]) => {
        const updatedCombo: INftCombo = {
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
                {comboValue.nftUnits.map((unit: INftComboUnit, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {t('app.plugins.draw.createDrawForm.step4.swapRules.nftUnit', {
                                    id: unit.id, /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
                                    unit: unit.unit /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
                                })}
                            </span>
                        </div>
                        <Button variant="ghost" onClick={() => handleRemoveNftUnit(index)}>
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
                        value={newNftUnit.nftId ?? ''}
                        onChange={(e) => setNewNftUnit({...newNftUnit, nftId: e.target.value})}
                    />
                    <InputText
                        label={t('app.plugins.draw.proposalSettings.nftUnit')}
                        value={newNftUnit.nftUnit ?? ''}
                        onChange={(e) => setNewNftUnit({...newNftUnit, nftUnit: e.target.value})}
                    />
                </div>
                <div className="mt-4">
                    <Button onClick={handleAddNftUnit}>
                        {t('app.plugins.draw.createDrawForm.step4.swapRules.addNftUnitButton')}
                    </Button>
                </div>
            </InputContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxExchangeCount')}
                    value={Number(comboValue.maxExchangeCount)}
                    onChange={(value) => handleComboSettingChange('maxExchangeCount', value.toString()) /* eslint-disable-line @typescript-eslint/no-unnecessary-type-conversion */}
                />
                <InputNumber
                    label={t('app.plugins.draw.proposalSettings.maxSingleBatch')}
                    value={Number(comboValue.maxSingleBatch)}
                    onChange={(value) => handleComboSettingChange('maxSingleBatch', value.toString()) /* eslint-disable-line @typescript-eslint/no-unnecessary-type-conversion */}
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