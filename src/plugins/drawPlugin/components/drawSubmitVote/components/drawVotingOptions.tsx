'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { RadioCard, RadioGroup } from '@cddao/gov-ui-kit';

export interface IDrawVotingOptionsProps {
    /**
     * Current value of the voting options.
     */
    value?: string;
    /**
     * Callback to call when the value changes.
     */
    onChange: (value: string) => void;
}

export const DrawVotingOptions: React.FC<IDrawVotingOptionsProps> = (props) => {
    const { value, onChange } = props;

    const { t } = useTranslations();

    return (
        <RadioGroup
            label={t('app.plugins.draw.drawVotingOptions.title')}
            value={value}
            onValueChange={onChange}
        >
            <RadioCard
                value="1"
                label={t('app.plugins.draw.drawVotingOptions.participate')}
                description={t('app.plugins.draw.drawVotingOptions.participateDescription')}
            />
        </RadioGroup>
    );
};