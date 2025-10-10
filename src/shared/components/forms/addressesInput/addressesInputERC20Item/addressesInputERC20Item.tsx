import { Network, useDao } from '@/shared/api/daoService';
import { useToken } from '@/shared/hooks/useToken';
import { addressUtils, Button, Card } from '@cddao/gov-ui-kit';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { IAddressInputResolvedValue } from '@cddao/gov-ui-kit';
import type { Hex } from 'viem';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { FinanceDialogId } from '@/modules/finance/constants/financeDialogId';
import type { IAsset } from '@/modules/finance/api/financeService';
import type { IAssetSelectionDialogParams } from '@/modules/finance/dialogs/assetSelectionDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import type { IAddressesInputERC20ItemProps } from './addressesInputERC20Item.types';

export const AddressesInputERC20Item: React.FC<IAddressesInputERC20ItemProps> = (props) => {
    const { disabled, network, formPrefix, daoId } = props;
    
    const { t } = useTranslations();
    const { setValue, watch } = useFormContext();
    const { open, close } = useDialogContext();
    
    const [addressInput, setAddressInput] = useState<string>('');
    
    // Watch the address field to fetch token info
    const addressField = `${formPrefix}.address`;
    const watchedAddress = watch(addressField) as string;
    
    // Get network ID from network enum
    let networkId: number | undefined;
    if (network) {
        switch (network) {
            case Network.ETHEREUM_MAINNET:
                networkId = 1;
                break;
            case Network.ETHEREUM_SEPOLIA:
                networkId = 11155111;
                break;
            case Network.POLYGON_MAINNET:
                networkId = 137;
                break;
            case Network.BASE_MAINNET:
                networkId = 8453;
                break;
            case Network.ARBITRUM_MAINNET:
                networkId = 42161;
                break;
            case Network.OPTIMISM_MAINNET:
                networkId = 10;
                break;
            case Network.ZKSYNC_MAINNET:
                networkId = 324;
                break;
            case Network.ZKSYNC_SEPOLIA:
                networkId = 300;
                break;
            case Network.PEAQ_MAINNET:
                networkId = 3338;
                break;
            case Network.CORN_MAINNET:
                networkId = 7545;
                break;
            case Network.CHILIZ_MAINNET:
                networkId = 88888;
                break;
            default:
                networkId = undefined;
        }
    }
    
    // Fetch DAO data to get the address
    const { data: dao } = useDao({ urlParams: { id: daoId! } }, { enabled: !!daoId });
    
    // Fetch token information
    const isValidAddress = addressUtils.isAddress(watchedAddress);
    const tokenAddress: Hex = isValidAddress ? (watchedAddress as Hex) : '0x0000000000000000000000000000000000000000';
    
    const { data: token, isLoading, isError } = useToken({
        address: tokenAddress,
        chainId: networkId ?? 1, // Default to mainnet if undefined
        enabled: !!networkId && isValidAddress,
    });
    
    // Update token name when token data is fetched
    useEffect(() => {
        if (token?.name && isValidAddress) {
            const fieldName = `${formPrefix}.name`;
            setValue(fieldName, token.name);
        }
    }, [token, formPrefix, setValue, isValidAddress]);
    
    // Handle address input change
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddressInput(value);
        setValue(addressField, value);
    };
    
    // Handle opening asset selection dialog
    const handleOpenAssetDialog = () => {
        if (!daoId || !network || !dao) return;
        
        const params: IAssetSelectionDialogParams = {
            initialParams: {
                queryParams: { 
                    address: dao.address, 
                    network 
                }
            },
            onAssetClick: (asset: IAsset) => {
                const address = asset.token.address;
                setValue(addressField, address);
                setAddressInput(address);
                
                // Set the token name
                const nameField = `${formPrefix}.name`;
                setValue(nameField, asset.token.name);
                close();
            },
            close,
        };
        
        open(FinanceDialogId.ASSET_SELECTION, { params });
    };
    
    // Custom validator to check if address is a valid ERC20 token
    const customValidator = (member: IAddressInputResolvedValue) => {
        const address = member.address ?? '';
        if (!addressUtils.isAddress(address)) {
            return 'app.plugins.draw.drawPluginSetupERC20.item.invalidAddress';
        }
        
        if (isLoading) {
            return true; // Allow while loading
        }
        
        if (isError) {
            return 'app.plugins.draw.drawPluginSetupERC20.item.invalidToken';
        }
        
        if (watchedAddress && !token) {
            return 'app.plugins.draw.drawPluginSetupERC20.item.notERC20';
        }
        
        return true;
    };
    
    // Get validation error message
    const validationError = customValidator({ address: watchedAddress });
    const hasError = typeof validationError === 'string';
    
    return (
        <Card className="shadow-neutral-sm flex flex-col gap-3 border border-neutral-100 p-6 md:flex-row md:gap-2">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <div className="flex w-full flex-col">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={addressInput}
                            onChange={handleAddressChange}
                            placeholder={t('app.shared.addressesInput.item.input.placeholder')}
                            disabled={disabled}
                            className={`w-full rounded-xl border px-4 py-3 text-base leading-tight ${
                                hasError 
                                    ? 'border-critical-400 focus:border-critical-600 focus:ring-critical-100' 
                                    : 'border-neutral-100 focus:border-primary-400 focus:ring-primary-100'
                            } focus:outline-none focus:ring-4`}
                        />
                        {daoId && network && dao && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleOpenAssetDialog}
                                disabled={disabled}
                                className="md:self-end"
                            >
                                {t('app.shared.addressesInput.item.selectAsset')}
                            </Button>
                        )}
                    </div>
                    {hasError && (
                        <p className="mt-1 text-sm text-critical-600">
                            {t(validationError as string)}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};