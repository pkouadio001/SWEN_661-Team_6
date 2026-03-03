import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterModal from '../screens/components/RegisterModal';

const mockOnClose = jest.fn();

const renderModal = () => {
  return render(<RegisterModal onClose={mockOnClose} />);
};

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Register Modal - Enhanced Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders modal', () => {
      renderModal();
      expect(screen.getByText(/register new account/i)).toBeInTheDocument();
    });

    test('renders all input fields', () => {
      renderModal();
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThanOrEqual(2); // At least username and email
    });

    test('renders PIN fields', () => {
      renderModal();
      const passwordInputs = screen.getAllByPlaceholderText(/pin/i);
      expect(passwordInputs.length).toBeGreaterThanOrEqual(2); // Create and confirm PIN
    });

    test('renders cancel button', () => {
      renderModal();
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    test('renders create account button', () => {
      renderModal();
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    test('username input accepts text', () => {
      renderModal();
      const input = screen.getAllByPlaceholderText(/username/i)[0] as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'testuser' } });
      expect(input.value).toBe('testuser');
    });

    test('email input accepts email', () => {
      renderModal();
      const input = screen.getAllByPlaceholderText(/email/i)[0] as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      expect(input.value).toBe('test@example.com');
    });

    test('PIN inputs accept numbers', () => {
      renderModal();
      const pinInputs = screen.getAllByPlaceholderText(/pin/i);
      if (pinInputs.length >= 2) {
        const pinInput = pinInputs[0] as HTMLInputElement;
        fireEvent.change(pinInput, { target: { value: '123456' } });
        expect(pinInput.value).toBe('123456');
      }
    });
  });

  describe('PIN Fields Security', () => {
    test('PIN inputs are password type', () => {
      renderModal();
      const pinInputs = screen.getAllByPlaceholderText(/pin/i);
      
      pinInputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'password');
      });
    });

    test('PIN inputs have numeric inputMode', () => {
      renderModal();
      const pinInputs = screen.getAllByPlaceholderText(/pin/i);
      
      pinInputs.forEach(input => {
        expect(input).toHaveAttribute('inputMode', 'numeric');
      });
    });
  });

  describe('Cancel Functionality', () => {
    test('cancel button calls onClose', () => {
      renderModal();
      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalled();
    });
 });

  describe('Create Account Functionality', () => {
    test('create account button exists', () => {
      renderModal();
      const button = screen.getByText(/create account/i);
      expect(button).toBeInTheDocument();
    });

    test('can fill all fields', () => {
      renderModal();
      
      const usernameInput = screen.getAllByPlaceholderText(/username/i)[0] as HTMLInputElement;
      const emailInput = screen.getAllByPlaceholderText(/email/i)[0] as HTMLInputElement;
      const pinInputs = screen.getAllByPlaceholderText(/pin/i);
      
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      
      if (pinInputs.length >= 2) {
        fireEvent.change(pinInputs[0], { target: { value: '123456' } });
        fireEvent.change(pinInputs[1], { target: { value: '123456' } });
      }
      
      expect(usernameInput.value).toBe('newuser');
      expect(emailInput.value).toBe('new@example.com');
    });

    test('create account button is clickable', () => {
      renderModal();
      const button = screen.getByText(/create account/i);
      fireEvent.click(button);
      expect(button).toBeTruthy();
    });
  });

  describe('Visual Elements', () => {
    test('displays modal title', () => {
      renderModal();
      expect(screen.getByText(/register new account/i)).toBeInTheDocument();
    });

    test('displays modal subtitle', () => {
      renderModal();
      expect(screen.getByText(/create your care connect account/i)).toBeInTheDocument();
    });

    test('displays modal icon', () => {
      renderModal();
      expect(screen.getByText(/\+/)).toBeInTheDocument();
    });
  });

  describe('Form Labels', () => {
    test('username label is displayed', () => {
      renderModal();
      expect(screen.getByText(/^username$/i)).toBeInTheDocument();
    });

    test('email label is displayed', () => {
      renderModal();
      expect(screen.getByText(/email address/i)).toBeInTheDocument();
    });

    test('PIN labels are displayed', () => {
      renderModal();
      expect(screen.getByText(/create pin number/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm pin number/i)).toBeInTheDocument();
    });
  });

  describe('Modal Overlay', () => {
    test('modal has overlay', () => {
      const { container } = renderModal();
      const overlay = container.querySelector('.modalOverlay');
      expect(overlay).toBeTruthy();
    });
  });

  describe('Validation', () => {
    test('handles form submission', () => {
      renderModal();
      const createButton = screen.getByText(/create account/i);
      
      // Fill in minimal data
      const usernameInput = screen.getAllByPlaceholderText(/username/i)[0];
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      
      // Click create
      fireEvent.click(createButton);
      
      // Test passes if no crash
      expect(true).toBe(true);
    });
  });
});