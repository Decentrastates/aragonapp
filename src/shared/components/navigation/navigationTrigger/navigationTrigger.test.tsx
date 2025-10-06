import { IconType } from '@cddao/gov-ui-kit';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NavigationTrigger, type INavigationTriggerProps } from './navigationTrigger';

// Mock the useTranslations hook
jest.mock('@/shared/components/translationsProvider', () => ({
    useTranslations: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'app.application.navigationDao.a11y.title': 'DAO navigation menu'
            };
            return translations[key] || key;
        }
    })
}));

describe('<Navigation.Trigger /> component', () => {
    const createTestComponent = (props?: Partial<INavigationTriggerProps>) => {
        const completeProps: INavigationTriggerProps = { ...props };

        return <NavigationTrigger {...completeProps} />;
    };

    it('renders a button with a menu icon', async () => {
        const onClick = jest.fn();
        render(createTestComponent({ onClick }));
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByTestId(IconType.MENU)).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'DAO navigation menu');
        await userEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });
});