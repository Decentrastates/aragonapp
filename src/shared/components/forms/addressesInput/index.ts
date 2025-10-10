import { AddressesInputContainer } from './addressesInputContainer';
import { AddressesInputItem } from './addressesInputItem';
import { AddressesInputERC20Item } from './addressesInputERC20Item';
import { AddressesInputSelectItem } from './addressesInputSelectItem';

export const AddressesInput = {
    Container: AddressesInputContainer,
    Item: AddressesInputItem,
    ERC20Item: AddressesInputERC20Item,
    SelectItem: AddressesInputSelectItem,
};

export * from './addressesInputContainer';
export * from './addressesInputContext';
export * from './addressesInputItem';
export * from './addressesInputERC20Item';
export * from './addressesInputSelectItem';
