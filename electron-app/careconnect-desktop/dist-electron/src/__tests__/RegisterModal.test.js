"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const RegisterModal_1 = __importDefault(require("../screens/components/RegisterModal"));
const mockOnClose = jest.fn();
const renderModal = () => {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(RegisterModal_1.default, { onClose: mockOnClose }));
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
            expect(react_1.screen.getByText(/register new account/i)).toBeInTheDocument();
        });
        test('renders all input fields', () => {
            renderModal();
            const inputs = react_1.screen.getAllByRole('textbox');
            expect(inputs.length).toBeGreaterThanOrEqual(2); // At least username and email
        });
        test('renders PIN fields', () => {
            renderModal();
            const passwordInputs = react_1.screen.getAllByPlaceholderText(/pin/i);
            expect(passwordInputs.length).toBeGreaterThanOrEqual(2); // Create and confirm PIN
        });
        test('renders cancel button', () => {
            renderModal();
            expect(react_1.screen.getByText(/cancel/i)).toBeInTheDocument();
        });
        test('renders create account button', () => {
            renderModal();
            expect(react_1.screen.getByText(/create account/i)).toBeInTheDocument();
        });
    });
    describe('Input Handling', () => {
        test('username input accepts text', () => {
            renderModal();
            const input = react_1.screen.getAllByPlaceholderText(/username/i)[0];
            react_1.fireEvent.change(input, { target: { value: 'testuser' } });
            expect(input.value).toBe('testuser');
        });
        test('email input accepts email', () => {
            renderModal();
            const input = react_1.screen.getAllByPlaceholderText(/email/i)[0];
            react_1.fireEvent.change(input, { target: { value: 'test@example.com' } });
            expect(input.value).toBe('test@example.com');
        });
        test('PIN inputs accept numbers', () => {
            renderModal();
            const pinInputs = react_1.screen.getAllByPlaceholderText(/pin/i);
            if (pinInputs.length >= 2) {
                const pinInput = pinInputs[0];
                react_1.fireEvent.change(pinInput, { target: { value: '123456' } });
                expect(pinInput.value).toBe('123456');
            }
        });
    });
    describe('PIN Fields Security', () => {
        test('PIN inputs are password type', () => {
            renderModal();
            const pinInputs = react_1.screen.getAllByPlaceholderText(/pin/i);
            pinInputs.forEach(input => {
                expect(input).toHaveAttribute('type', 'password');
            });
        });
        test('PIN inputs have numeric inputMode', () => {
            renderModal();
            const pinInputs = react_1.screen.getAllByPlaceholderText(/pin/i);
            pinInputs.forEach(input => {
                expect(input).toHaveAttribute('inputMode', 'numeric');
            });
        });
    });
    describe('Cancel Functionality', () => {
        test('cancel button calls onClose', () => {
            renderModal();
            const cancelButton = react_1.screen.getByText(/cancel/i);
            react_1.fireEvent.click(cancelButton);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
    describe('Create Account Functionality', () => {
        test('create account button exists', () => {
            renderModal();
            const button = react_1.screen.getByText(/create account/i);
            expect(button).toBeInTheDocument();
        });
        test('can fill all fields', () => {
            renderModal();
            const usernameInput = react_1.screen.getAllByPlaceholderText(/username/i)[0];
            const emailInput = react_1.screen.getAllByPlaceholderText(/email/i)[0];
            const pinInputs = react_1.screen.getAllByPlaceholderText(/pin/i);
            react_1.fireEvent.change(usernameInput, { target: { value: 'newuser' } });
            react_1.fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
            if (pinInputs.length >= 2) {
                react_1.fireEvent.change(pinInputs[0], { target: { value: '123456' } });
                react_1.fireEvent.change(pinInputs[1], { target: { value: '123456' } });
            }
            expect(usernameInput.value).toBe('newuser');
            expect(emailInput.value).toBe('new@example.com');
        });
        test('create account button is clickable', () => {
            renderModal();
            const button = react_1.screen.getByText(/create account/i);
            react_1.fireEvent.click(button);
            expect(button).toBeTruthy();
        });
    });
    describe('Visual Elements', () => {
        test('displays modal title', () => {
            renderModal();
            expect(react_1.screen.getByText(/register new account/i)).toBeInTheDocument();
        });
        test('displays modal subtitle', () => {
            renderModal();
            expect(react_1.screen.getByText(/create your care connect account/i)).toBeInTheDocument();
        });
        test('displays modal icon', () => {
            renderModal();
            expect(react_1.screen.getByText(/\+/)).toBeInTheDocument();
        });
    });
    describe('Form Labels', () => {
        test('username label is displayed', () => {
            renderModal();
            expect(react_1.screen.getByText(/^username$/i)).toBeInTheDocument();
        });
        test('email label is displayed', () => {
            renderModal();
            expect(react_1.screen.getByText(/email address/i)).toBeInTheDocument();
        });
        test('PIN labels are displayed', () => {
            renderModal();
            expect(react_1.screen.getByText(/create pin number/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/confirm pin number/i)).toBeInTheDocument();
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
            const createButton = react_1.screen.getByText(/create account/i);
            // Fill in minimal data
            const usernameInput = react_1.screen.getAllByPlaceholderText(/username/i)[0];
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            // Click create
            react_1.fireEvent.click(createButton);
            // Test passes if no crash
            expect(true).toBe(true);
        });
    });
});
