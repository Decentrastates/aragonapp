import type { IDao } from '@/shared/api/daoService';
import type { IDateDuration } from '@/shared/utils/dateUtils';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { Hex } from 'viem';
import type { ISetupBodyFormExisting, ISetupBodyFormMembership, ISetupBodyFormNew } from '../dialogs/setupBodyDialog';

export interface IBuildPreparePluginInstallDataParams<
    TGovernance = unknown,
    TMember extends ICompositeAddress = ICompositeAddress,
    TMembership extends ISetupBodyFormMembership<TMember> = ISetupBodyFormMembership<TMember>,
> {
    /**
     * 安装流程所需的主体表单数据
     */
    body:
        | ISetupBodyFormNew<TGovernance, TMember, TMembership>
        | ISetupBodyFormExisting<TGovernance, TMember, TMembership>
    /**
     * 流程的十六进制格式元数据
     */
    metadata: Hex;
    /**
     * 要安装流程的DAO
     */
    dao: IDao;
    /**
     * 插件阶段的投票期，仅在设置高级治理流程时设置。该参数还用于正确设置插件的执行器目标配置：
     * - 当插件设置为高级治理流程时，目标是全局执行器（定义了stageVotingPeriod）
     * - 当插件设置为简单治理流程时，目标是DAO地址（未定义stageVotingPeriod）
     */
    stageVotingPeriod?: IDateDuration;
}