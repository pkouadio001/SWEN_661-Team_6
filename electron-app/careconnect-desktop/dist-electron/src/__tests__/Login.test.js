"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const LoginScreen_1 = __importDefault(require("../screens/LoginScreen"));
// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
const renderLoginScreen = () => {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(LoginScreen_1.default, {}) }));
};
afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
});
afterAll(() => {
    jest.restoreAllMocks();
});
describe('Login Screen - Comprehensive Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // RENDERING TESTS
    describe('Component Rendering', () => {
        test('renders all UI elements', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Care Connect')).toBeInTheDocument();
            expect(react_1.screen.getByText('Your Personal Health Companion')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('Enter 6-digit PIN')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
            expect(react_1.screen.getByText(/quit/i)).toBeInTheDocument();
        });
        test('renders username label and hint', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Username')).toBeInTheDocument();
            expect(react_1.screen.getByText('Username is not case sensitive')).toBeInTheDocument();
        });
        test('renders PIN label and hint', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('PIN Number')).toBeInTheDocument();
            expect(react_1.screen.getByText('Enter your 6 digit PIN number')).toBeInTheDocument();
        });
        test('renders welcome message', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Welcome to Care Connect')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Manage your medications, track symptoms/i)).toBeInTheDocument();
        });
        test('renders today date', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText(/Today:/i)).toBeInTheDocument();
        });
        test('renders recover credentials link', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Recover credentials')).toBeInTheDocument();
        });
        test('renders register now button', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Register Now')).toBeInTheDocument();
        });
        test('logo icon is displayed', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('♡')).toBeInTheDocument();
        });
    });
    // INPUT HANDLING TESTS
    describe('Input Handling', () => {
        test('username input accepts text', () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            expect(usernameInput.value).toBe('testuser');
        });
        test('username input handles spaces', () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            react_1.fireEvent.change(usernameInput, { target: { value: '  spaceduser  ' } });
            expect(usernameInput.value).toBe('  spaceduser  ');
        });
        test('PIN input accepts numbers', () => {
            renderLoginScreen();
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            react_1.fireEvent.change(pinInput, { target: { value: '123456' } });
            expect(pinInput.value).toBe('123456');
        });
        test('PIN input accepts any characters (validation happens on submit)', () => {
            renderLoginScreen();
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            react_1.fireEvent.change(pinInput, { target: { value: 'abcdef' } });
            expect(pinInput.value).toBe('abcdef');
        });
        test('PIN input is password type', () => {
            renderLoginScreen();
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            expect(pinInput).toHaveAttribute('type', 'password');
        });
        test('PIN input has numeric inputMode', () => {
            renderLoginScreen();
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            expect(pinInput).toHaveAttribute('inputMode', 'numeric');
        });
    });
    // VALIDATION TESTS - HAPPY PATHS
    describe('Validation - Happy Paths', () => {
        test('valid username and PIN navigates to dashboard', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: 'validuser' } });
            react_1.fireEvent.change(pinInput, { target: { value: '123456' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
                    state: { username: 'validuser' }
                });
            });
        });
        test('trims whitespace from username', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: '  trimmeduser  ' } });
            react_1.fireEvent.change(pinInput, { target: { value: '123456' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
                    state: { username: 'trimmeduser' }
                });
            });
        });
        test('accepts all numeric PINs', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            const validPins = ['000000', '123456', '999999', '111111'];
            for (const pin of validPins) {
                react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
                react_1.fireEvent.change(pinInput, { target: { value: pin } });
                react_1.fireEvent.click(signInButton);
                await (0, react_1.waitFor)(() => {
                    expect(mockNavigate).toHaveBeenCalled();
                });
                mockNavigate.mockClear();
            }
        });
    });
    // VALIDATION TESTS - ERROR CASES
    describe('Validation - Error Cases', () => {
        test('shows error when username is empty', async () => {
            renderLoginScreen();
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Username is required.')).toBeInTheDocument();
            });
        });
        test('shows error when username is only spaces', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: '     ' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Username is required.')).toBeInTheDocument();
            });
        });
        test('shows error when PIN is empty', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('PIN is required.')).toBeInTheDocument();
            });
        });
        test('shows error when PIN is only spaces', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            react_1.fireEvent.change(pinInput, { target: { value: '      ' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('PIN is required.')).toBeInTheDocument();
            });
        });
        test('shows error when both username and PIN are empty', async () => {
            renderLoginScreen();
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Username is required.')).toBeInTheDocument();
                // Note: Only first error shown due to validation order
            });
        });
        test('shows error for PIN less than 6 digits', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            const invalidPins = ['1', '12', '123', '1234', '12345'];
            for (const pin of invalidPins) {
                react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
                react_1.fireEvent.change(pinInput, { target: { value: pin } });
                react_1.fireEvent.click(signInButton);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('PIN must be exactly 6 digits.')).toBeInTheDocument();
                });
            }
        });
        test('shows error for PIN more than 6 digits', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            react_1.fireEvent.change(pinInput, { target: { value: '1234567' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('PIN must be exactly 6 digits.')).toBeInTheDocument();
            });
        });
        test('shows error for PIN with letters', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            const invalidPins = ['abcdef', '12345a', 'a12345', '123a45'];
            for (const pin of invalidPins) {
                react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
                react_1.fireEvent.change(pinInput, { target: { value: pin } });
                react_1.fireEvent.click(signInButton);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('PIN must be exactly 6 digits.')).toBeInTheDocument();
                });
            }
        });
        test('shows error for PIN with special characters', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            const invalidPins = ['123-45', '12.456', '12 456', '12@456', '12#456'];
            for (const pin of invalidPins) {
                react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
                react_1.fireEvent.change(pinInput, { target: { value: pin } });
                react_1.fireEvent.click(signInButton);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('PIN must be exactly 6 digits.')).toBeInTheDocument();
                });
            }
        });
        test('error styling applied to username field when empty', async () => {
            renderLoginScreen();
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
                expect(usernameInput).toHaveClass('inputError');
            });
        });
        test('error styling applied to PIN field when invalid', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            react_1.fireEvent.change(pinInput, { target: { value: '123' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(pinInput).toHaveClass('inputError');
            });
        });
    });
    // FORM SUBMISSION TESTS
    describe('Form Submission', () => {
        test('prevents default form submission', () => {
            renderLoginScreen();
            const form = react_1.screen.getByRole('button', { name: 'Sign In' }).closest('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form?.dispatchEvent(submitEvent);
            expect(submitEvent.defaultPrevented).toBe(true);
        });
        test('does not navigate when validation fails', async () => {
            renderLoginScreen();
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Username is required.')).toBeInTheDocument();
            });
            expect(mockNavigate).not.toHaveBeenCalled();
        });
        test('clears previous errors when valid input provided', async () => {
            renderLoginScreen();
            const usernameInput = react_1.screen.getByPlaceholderText('Enter your username');
            const pinInput = react_1.screen.getByPlaceholderText('Enter 6-digit PIN');
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            // First submit with errors
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Username is required.')).toBeInTheDocument();
            });
            // Fix errors and submit again
            react_1.fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            react_1.fireEvent.change(pinInput, { target: { value: '123456' } });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('Username is required.')).not.toBeInTheDocument();
                expect(mockNavigate).toHaveBeenCalled();
            });
        });
    });
    // REGISTER MODAL TESTS
    describe('Register Modal', () => {
        test('opens register modal when Register Now clicked', () => {
            renderLoginScreen();
            const registerButton = react_1.screen.getByText('Register Now');
            react_1.fireEvent.click(registerButton);
            expect(react_1.screen.getByText('Register New Account')).toBeInTheDocument();
        });
        test('register button is type button (not submit)', () => {
            renderLoginScreen();
            const registerButton = react_1.screen.getByText('Register Now');
            expect(registerButton).toHaveAttribute('type', 'button');
        });
    });
    // QUIT BUTTON TESTS
    describe('Quit Button', () => {
        test('quit button calls quitApp function', () => {
            renderLoginScreen();
            const quitButton = react_1.screen.getByText(/quit/i);
            react_1.fireEvent.click(quitButton);
            expect(window.careconnect.quitApp).toHaveBeenCalled();
        });
        test('quit button is visible', () => {
            renderLoginScreen();
            const quitButton = react_1.screen.getByText(/quit/i);
            expect(quitButton).toBeVisible();
        });
        test('quit button has danger styling', () => {
            renderLoginScreen();
            const quitButton = react_1.screen.getByText(/quit/i);
            expect(quitButton).toHaveClass('btnDanger');
        });
    });
    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        test('form inputs have labels displayed', () => {
            renderLoginScreen();
            expect(react_1.screen.getByText('Username')).toBeInTheDocument();
            expect(react_1.screen.getByText('PIN Number')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('Enter 6-digit PIN')).toBeInTheDocument();
        });
        test('submit button has accessible name', () => {
            renderLoginScreen();
            expect(react_1.screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
        });
        test('error messages are displayed when validation fails', async () => {
            renderLoginScreen();
            const signInButton = react_1.screen.getByRole('button', { name: 'Sign In' });
            react_1.fireEvent.click(signInButton);
            await (0, react_1.waitFor)(() => {
                const errorMessage = react_1.screen.getByText('Username is required.');
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveClass('error');
            });
        });
    });
    // DATE DISPLAY TESTS
    describe('Date Display', () => {
        test('displays formatted date', () => {
            renderLoginScreen();
            const todayText = react_1.screen.getByText(/Today:/i);
            expect(todayText).toBeInTheDocument();
            // Should contain year, month, day
            expect(todayText.textContent).toMatch(/\d{4}/); // Year
        });
        test('date is in readable format', () => {
            renderLoginScreen();
            const todayText = react_1.screen.getByText(/Today:/i);
            // Should be long format like "Monday, March 1, 2026"
            expect(todayText.textContent).toMatch(/[A-Z][a-z]+,.*\d{4}/);
        });
    });
});
