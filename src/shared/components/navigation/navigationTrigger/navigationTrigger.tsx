import { AvatarIcon, IconType } from '@cddao/gov-ui-kit';
import classNames from 'classnames';
import type { ComponentProps } from 'react';
import { useTranslations } from '@/shared/components/translationsProvider';

export interface INavigationTriggerProps extends ComponentProps<'button'> {}

export const NavigationTrigger: React.FC<INavigationTriggerProps> = (props) => {
    const { className, ...otherProps } = props;
    const { t } = useTranslations();

    return (
        <button
            className={classNames(
                'bg-neutral-0 focus-ring-primary rounded-full border border-neutral-100 p-[3px] outline-none', // Default
                'hover:border-neutral-200 active:border-neutral-200 active:bg-neutral-50', // Hover / Active states
                className,
            )}
            aria-label={t('app.application.navigationDao.a11y.title')}
            {...otherProps}
        >
            <AvatarIcon icon={IconType.MENU} size="lg" />
        </button>
    );
};