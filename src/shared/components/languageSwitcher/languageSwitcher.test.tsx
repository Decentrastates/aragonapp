import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from './languageSwitcher';

// Mock the gov-ui-kit components
jest.mock('@cddao/gov-ui-kit', () => ({
  Button: ({ children, onClick, variant, 'aria-label': ariaLabel, className }: 
    { children: React.ReactNode; onClick: () => void; variant: string; 'aria-label': string; className?: string }) => (
    <button onClick={onClick} aria-label={ariaLabel} data-variant={variant} className={className}>
      {children}
    </button>
  ),
  Dropdown: {
    Container: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div className={className} data-testid="dropdown-container">
        {children}
      </div>
    ),
    Item: ({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
      <div onClick={onClick} className={className} data-testid="dropdown-item">
        {children}
      </div>
    )
  }
}));

// Mock the translations context
jest.mock('../translationsProvider/translationsProvider', () => ({
  useTranslations: () => ({
    t: (key: string) => {
      // Return the key itself for testing purposes
      return key;
    },
    language: 'en'
  })
}));

describe('LanguageSwitcher', () => {
  it('renders without crashing', () => {
    render(<LanguageSwitcher />);
    // Check that the component renders without throwing errors
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays the language switcher button with correct aria-label', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByLabelText('app.shared.languageSwitcher.selectLanguage')).toBeInTheDocument();
  });
});