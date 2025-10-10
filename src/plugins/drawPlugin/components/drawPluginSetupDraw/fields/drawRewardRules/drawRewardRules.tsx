'use client';

import { DrawRewardInfo } from './drawRewardInfo';

export interface IDrawRewardRulesProps {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const DrawRewardRules: React.FC<IDrawRewardRulesProps> = (props) => {
    const { fieldPrefix } = props;

    // const { t } = useTranslations();

    return (
        <>
            <DrawRewardInfo fieldPrefix={fieldPrefix} />
        </>
    );
};
