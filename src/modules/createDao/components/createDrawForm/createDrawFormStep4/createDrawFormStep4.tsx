'use client';

import { DrawRewardRules, EligibilityRules, SwapRules } from './fields';

export interface ICreateDrawFormStep4Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const CreateDrawFormStep4: React.FC<ICreateDrawFormStep4Props> = (props) => {
    const { fieldPrefix } = props;
    // console.log('CreateDrawFormStep4', props);

    return (
        <div className="flex w-full flex-col gap-6">
            <EligibilityRules fieldPrefix={fieldPrefix} />

            <DrawRewardRules fieldPrefix={fieldPrefix} />

            <SwapRules fieldPrefix={fieldPrefix} />
        </div>
    );
};
