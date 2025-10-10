import { Select } from '@/shared/components/select';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useEffect, useState, type ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';

export interface IAddressesInputSelectItemProps extends ComponentProps<'div'> {
    /**
     * The index of the item.
     */
    index: number;
    /**
     * Flag indicating if the input should be disabled.
     */
    disabled?: boolean;
    /**
     * Form field prefix.
     */
    formPrefix: string;
    /**
     * List of addresses to select from.
     */
    addressOptions: Array<{ label: string; value: string }>;
    /**
     * Callback when an address is selected.
     */
    onAddressSelect?: (address: string) => void;
}

export const AddressesInputSelectItem: React.FC<IAddressesInputSelectItemProps> = (props) => {
    const { disabled, formPrefix, addressOptions, onAddressSelect } = props;

    const { t } = useTranslations();
    const { setValue, watch } = useFormContext();

    // Watch the address field to fetch token info
    const addressField = `${formPrefix}.address`;
    const nameField = `${formPrefix}.name`;
    
    // Get the current value from the form
    const currentValue = watch(addressField) as string | undefined;

    const [selectedAddress, setSelectedAddress] = useState<string>(currentValue ?? '');

    // Update the selected address when the form value changes
    useEffect(() => {
        if (currentValue !== selectedAddress) {
            setSelectedAddress(currentValue ?? '');
        }
    }, [currentValue, selectedAddress]);

    const handleAddressSelect = (value: string) => {
        setSelectedAddress(value);
        setValue(addressField, value);

        // Find the selected option to get the label/name
        const selectedOption = addressOptions.find((option) => option.value === value);
        if (selectedOption) {
            setValue(nameField, selectedOption.label);
        }

        // Call the callback if provided
        if (onAddressSelect) {
            onAddressSelect(value);
        }
    };

    return (
        <Select
            value={selectedAddress}
            onValueChange={handleAddressSelect}
            placeholder={t('app.shared.addressesInput.select.placeholder')}
            options={addressOptions}
            disabled={disabled}
            className="w-full mt-4 mb-4"
        />
    );
};