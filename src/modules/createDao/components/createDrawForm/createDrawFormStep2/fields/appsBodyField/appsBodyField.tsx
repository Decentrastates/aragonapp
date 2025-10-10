// import safeWallet from '@/assets/images/safeWallet.png';
import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { type ISetupBodyForm } from '@/modules/createDao/dialogs/setupBodyDialog';
// import { GovernanceBodyInfo } from '@/shared/components/governanceBodyInfo';
import { PluginSingleComponent } from '@/shared/components/pluginSingleComponent';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import type { IPluginInfo } from '@/shared/types';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { Accordion, Button, Dropdown, IconType } from '@cddao/gov-ui-kit';
import classNames from 'classnames';
import { useWatch } from 'react-hook-form';
import { BodyType } from '../../../../../types/enum';
import { AppsType, type ICreateAppFormData } from '../../../createDrawFormDefinitions';
// import { createDrawFormUtils } from '../../../createDrawFormUtils';
import { AppsBodiesFieldItemDefault } from './appsBodiesFieldItemDefault';
import { DrawBodyInfo } from '@/shared/components/drawBodyInfo';

export interface IAppsBodyFieldProps {
    /**
     * Name of the body field.
     */
    fieldName: string;
    /**
     * ID of the DAO to setup the body for.
     */
    daoId?: string;
    /**
     * Body to display the details for.
     */
    body: ISetupBodyForm;
    /**
     * Callback called on edit button click.
     */
    onEdit?: () => void;
    /**
     * Callback called on delete button click.
     */
    onDelete?: () => void;
    /**
     * If the component field is read-only.
     * @default false
     */
    readOnly?: boolean;
}

export const AppsBodyField: React.FC<IAppsBodyFieldProps> = (props) => {
    const { fieldName, daoId, body, onEdit, onDelete, readOnly = false } = props;
    console.log('AppsBodyField', props)

    const { t } = useTranslations();

    useFormField<Record<string, ISetupBodyForm>, typeof fieldName>(fieldName);

    const appsType = useWatch<ICreateAppFormData, 'appsType'>({ name: 'appsType' });

    const isICO = appsType === AppsType.ICO;

    const plugin = pluginRegistryUtils.getPlugin(body.plugin) as IPluginInfo | undefined;

    const isNew = body.type === BodyType.NEW;
    const isExternal = body.type === BodyType.EXTERNAL;
    const isEditAllowed = onEdit != null;

    return (
        <Accordion.Container isMulti={true} defaultValue={readOnly ? [body.internalId] : undefined}>
            <Accordion.Item value={body.internalId}>
                <Accordion.ItemHeader>
                    <DrawBodyInfo
                        subdomain={isNew ? plugin?.id : body.plugin}
                        name={isExternal ? undefined : body.name}
                        address={isNew ? undefined : body.address}
                        release={
                            isNew ? plugin?.installVersion.release.toString() : isExternal ? undefined : body.release
                        }
                        build={isNew ? plugin?.installVersion.build.toString() : isExternal ? undefined : body.build}
                        // logoSrc={createDrawFormUtils.isBodySafe(body) ? safeWallet.src : undefined}
                    />
                </Accordion.ItemHeader>
                <Accordion.ItemContent className="data-[state=open]:flex data-[state=open]:flex-col data-[state=open]:gap-y-4 data-[state=open]:md:gap-y-6">
                    <PluginSingleComponent
                        pluginId={body.plugin}
                        slotId={CreateDaoSlotId.CREATE_DAO_APPS_BODY_READ_FIELD}
                        daoId={daoId}
                        body={body}
                        isIco={isICO}
                        Fallback={AppsBodiesFieldItemDefault}
                    />
                    {!readOnly && (
                        <div
                            className={classNames(
                                'flex w-full grow',
                                isEditAllowed ? 'justify-between' : 'justify-end',
                            )}
                        >
                            {isEditAllowed && (
                                <Button variant="secondary" size="md" onClick={onEdit}>
                                    {t('app.createDao.createProcessForm.governance.bodyField.action.edit')}
                                </Button>
                            )}
                            <Dropdown.Container
                                constrainContentWidth={false}
                                size="md"
                                customTrigger={
                                    <Button
                                        className="w-fit"
                                        variant="tertiary"
                                        size="md"
                                        iconRight={IconType.DOTS_VERTICAL}
                                    >
                                        {t('app.createDao.createProcessForm.governance.bodyField.action.more')}
                                    </Button>
                                }
                            >
                                <Dropdown.Item onClick={onDelete}>
                                    {t('app.createDao.createProcessForm.governance.bodyField.action.remove')}
                                </Dropdown.Item>
                            </Dropdown.Container>
                        </div>
                    )}
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Container>
    );
};
