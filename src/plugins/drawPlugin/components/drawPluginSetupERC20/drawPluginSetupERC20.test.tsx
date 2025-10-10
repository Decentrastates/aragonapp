import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { DrawPluginSetupERC20 } from './drawPluginSetupERC20';

// Mock the useToken hook
jest.mock('@/shared/hooks/useToken', () => ({
  useToken: () => ({
    data: null,
    isLoading: false,
    isError: false,
  }),
}));

// Mock the useDao hook
jest.mock('@/shared/api/daoService', () => ({
  useDao: () => ({
    data: null,
    isLoading: false,
    isError: false,
  }),
  Network: {
    ETHEREUM_MAINNET: 'ETHEREUM_MAINNET',
  },
}));

// Mock the useDialogContext hook
jest.mock('@/shared/components/dialogProvider', () => ({
  useDialogContext: () => ({
    open: jest.fn(),
    close: jest.fn(),
  }),
}));

// Create a test wrapper component with form context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      testField: {
        members: [
          { address: '', name: '' },
        ],
      },
    },
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

describe('DrawPluginSetupERC20', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <DrawPluginSetupERC20 
          formPrefix="testField" 
          onAddClick={jest.fn()} 
        />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('displays the correct label and help text', () => {
    render(
      <TestWrapper>
        <DrawPluginSetupERC20 
          formPrefix="testField" 
          onAddClick={jest.fn()} 
        />
      </TestWrapper>
    );

    // These texts will be translated by the useTranslations hook
    // We're just checking that the component renders
    expect(screen.getByText('ERC20 Token Address')).toBeInTheDocument();
  });
});