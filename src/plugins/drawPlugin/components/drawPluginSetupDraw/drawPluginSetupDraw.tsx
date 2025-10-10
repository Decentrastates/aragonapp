'use client';

import {  EligibilityRules, SwapRules } from './fields';
import type { IDrawPluginSetupDrawProps } from './drawPluginSetupDraw.api';

export const DrawPluginSetupDraw: React.FC<IDrawPluginSetupDrawProps> = (props) => {
    const { formPrefix } = props;

    return (
        <div className="flex w-full flex-col gap-6">
            <EligibilityRules fieldPrefix={formPrefix} />

            {/* <DrawRewardRules fieldPrefix={formPrefix} /> */}

            <SwapRules fieldPrefix={formPrefix} />
        </div>
    );
};