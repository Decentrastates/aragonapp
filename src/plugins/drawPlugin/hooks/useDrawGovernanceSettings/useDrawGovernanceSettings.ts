import type { IUseGovernanceSettingsParams } from '@/modules/settings/types';
import { useTranslations } from '@/shared/components/translationsProvider';
import { dateUtils } from '@/shared/utils/dateUtils';
import { formatterUtils, type IDefinitionSetting, NumberFormat } from '@cddao/gov-ui-kit';
import { formatUnits } from 'viem';
import type { IDrawPluginSettings } from '../../types';

export interface IUseDrawGovernanceSettingsParams extends IUseGovernanceSettingsParams<IDrawPluginSettings> {}

export const useDrawGovernanceSettings = (params: IUseDrawGovernanceSettingsParams): IDefinitionSetting[] => {
    const { settings } = params;

    const { t } = useTranslations();
    
    const {
        tokenA,
        tokenB,
        eligibleToken,
        minTokenAmount,
        isErc1155Eligible,
        eligibleNftId,
        drawInterval,
        nftCombos
    } = settings;

    // Format minTokenAmount by converting from bigint to string
    const parsedMinTokenAmount = formatUnits(minTokenAmount, 18); // Assuming 18 decimals
    const formattedMinTokenAmount = formatterUtils.formatNumber(parsedMinTokenAmount, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
    }) ?? '0';

    // Convert draw interval from seconds to a more readable format using dateUtils
    const duration = dateUtils.secondsToDuration(Number(drawInterval));
    const formattedDuration = t('app.plugins.draw.drawGovernanceSettings.duration', {
        days: duration.days,
        hours: duration.hours,
        minutes: duration.minutes,
    });

    return [
        {
            term: t('app.plugins.draw.drawGovernanceSettings.tokenA'),
            definition: tokenA,
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.tokenB'),
            definition: tokenB,
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.eligibleToken'),
            definition: eligibleToken,
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.minTokenAmount'),
            definition: formattedMinTokenAmount,
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.isErc1155Eligible'),
            definition: isErc1155Eligible 
                ? t('app.plugins.draw.drawGovernanceSettings.yes') 
                : t('app.plugins.draw.drawGovernanceSettings.no'),
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.eligibleNftId'),
            definition: isErc1155Eligible ? eligibleNftId?.toString() : t('app.plugins.draw.drawGovernanceSettings.notApplicable'),
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.drawInterval'),
            definition: formattedDuration,
        },
        {
            term: t('app.plugins.draw.drawGovernanceSettings.nftCombosCount'),
            definition: nftCombos.length.toString(),
        },
    ];
};