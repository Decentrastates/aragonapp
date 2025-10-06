'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { ICreateDrawForm } from '../createDrawFormDefinitions';
import { TokenBSwitch } from './fields/tokenBSwitch';
import { TokenBMetadataFields } from './fields/tokenBMetadataFields';
import { TokenBFields } from './fields/tokenBFields/tokenBFields';

export interface ICreateDrawFormStep2Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
    /**
     * 创建新ERC1155的默认值
     */
    defaultIsCreateNewErc1155?: boolean;
}

export const CreateDrawFormStep2: React.FC<ICreateDrawFormStep2Props> = (props) => {
    const { fieldPrefix, defaultIsCreateNewErc1155 } = props;

    const { t } = useTranslations();

    // 创建新ERC1155的开关字段，使用传入的默认值
    const isCreateNewNftField = useFormField<ICreateDrawForm, 'governance.isCreateNewErc1155'>('governance.isCreateNewErc1155', {
        label: t('app.plugins.draw.createDrawForm.step2.isCreateNewNft.label'),
        fieldPrefix,
        defaultValue: defaultIsCreateNewErc1155 ?? true,
    });

    return (
        <div className="flex w-full flex-col gap-6">
            <TokenBSwitch fieldPrefix={fieldPrefix} defaultIsCreateNewErc1155={defaultIsCreateNewErc1155} />
            <TokenBMetadataFields 
                showFields={isCreateNewNftField.value !== false} 
                fieldPrefix={fieldPrefix} 
            />
            <TokenBFields 
                showField={!(isCreateNewNftField.value !== false)} 
                isCreateNewNft={isCreateNewNftField.value !== false} 
                fieldPrefix={fieldPrefix} 
            />
        </div>
    );
};