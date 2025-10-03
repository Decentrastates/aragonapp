import type { TranslationFunction } from '@/shared/components/translationsProvider';
import { formatterUtils, type IDefinitionSetting, NumberFormat } from '@cddao/gov-ui-kit';
import { formatUnits } from 'viem';
import type { IDrawPluginSettings } from '../../types';

export interface IParseDrawSettingsParams {
    /**
     * Settings passed into the function either from the DAO or the proposal.
     */
    settings: IDrawPluginSettings;
    /**
     * The translation function for internationalization.
     */
    t: TranslationFunction;
}

class DrawSettingsUtils {
    parseSettings = (params: IParseDrawSettingsParams): IDefinitionSetting[] => {
        const { settings, t } = params;
        const { tokenA, tokenB, eligibleToken, minTokenAmount, drawInterval } = settings;

        // Format minTokenAmount by converting from bigint to string
        const parsedMinTokenAmount = formatUnits(minTokenAmount, 18); // Assuming 18 decimals
        const formattedMinTokenAmount = formatterUtils.formatNumber(parsedMinTokenAmount, {
            format: NumberFormat.TOKEN_AMOUNT_SHORT,
        }) ?? '0';

        const duration = parseInt(drawInterval.toString());
        const days = Math.floor(duration / 86400);
        const formattedDuration = `${days.toString()} days`;

        return [
            {
                term: t('app.plugins.draw.drawSettings.tokenA'),
                definition: tokenA,
            },
            {
                term: t('app.plugins.draw.drawSettings.tokenB'),
                definition: tokenB,
            },
            {
                term: t('app.plugins.draw.drawSettings.eligibleToken'),
                definition: eligibleToken,
            },
            {
                term: t('app.plugins.draw.drawSettings.minTokenAmount'),
                definition: formattedMinTokenAmount,
            },
            {
                term: t('app.plugins.draw.drawSettings.drawInterval'),
                definition: formattedDuration,
            },
        ];
    };
}

export const drawSettingsUtils = new DrawSettingsUtils();