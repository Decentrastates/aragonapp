import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { RadioCard, RadioGroup } from '@cddao/gov-ui-kit';
import { useFormContext } from 'react-hook-form';
import { AppsType, type ICreateAppFormData } from '../createDrawFormDefinitions';
import { DrawBodyField } from './fields/drawBodyField';
// import { TokenBFields } from './fields/tokenBFields/tokenBFields';
// import { TokenBMetadataFields } from './fields/tokenBMetadataFields';
// import { createDrawFormUtils } from '../createDrawFormUtils';

export interface ICreateAppFormProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const CreateDrawFormStep2: React.FC<ICreateAppFormProps> = (props) => {
    const { daoId } = props;

    const { t } = useTranslations();
    const { setValue } = useFormContext();

    const {
        value: appsType,
        onChange: onAppTypeChange,
        ...appsTypeField
    } = useFormField<ICreateAppFormData, 'appsType'>('appsType', {
        label: t('app.createDao.createAppsForm.apps.type.label'),
        defaultValue: AppsType.DRAW,
        rules: { required: true },
    });

    const handleAppTypeChange = (value: string) => {
        setValue('body', undefined);
        onAppTypeChange(value);
    };

    const isICO = appsType === AppsType.ICO;
    const isDraw = appsType === AppsType.DRAW;

    return (
        <div className="flex w-full flex-col gap-6">
            <RadioGroup
                helpText={t('app.createDao.createAppsForm.apps.type.helpText')}
                onValueChange={handleAppTypeChange}
                className="w-full gap-4 md:flex-row"
                value={appsType}
                {...appsTypeField}
            >
                {Object.values(AppsType).map((type) => (
                    <RadioCard
                        key={type}
                        label={t(`app.createDao.createAppsForm.apps.type.${type}.label`)}
                        description={t(`app.createDao.createAppsForm.apps.type.${type}.description`)}
                        value={type}
                    />
                ))}
            </RadioGroup>

            {isDraw && <DrawBodyField daoId={daoId} appsCategory={appsType} />}
            {isICO && <DrawBodyField daoId={daoId} appsCategory={appsType} />}

            {/* {isICO && <IcoBodyField daoId={daoId} />} */}

            {/* <TokenBSwitch fieldPrefix={fieldPrefix} defaultIsCreateNewErc1155={defaultIsCreateNewErc1155} /> */}
            {/* <TokenBMetadataFields showFields={isCreateNewNftField.value !== false} fieldPrefix={fieldPrefix} />
            <TokenBFields
                showField={!(isCreateNewNftField.value !== false)}
                isCreateNewNft={isCreateNewNftField.value !== false}
                fieldPrefix={fieldPrefix}
            /> */}
        </div>
    );
};
