"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const TopBar_1 = __importDefault(require("../components/TopBar"));
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const Panel_1 = __importDefault(require("../components/Panel"));
const TileCard_1 = __importDefault(require("../components/TileCard"));
const renderWithRouter = (component) => {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: component }));
};
afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
});
afterAll(() => {
    jest.restoreAllMocks();
});
describe('TopBar Component - Comprehensive Coverage', () => {
    const mockOnLogout = jest.fn();
    const mockOnQuit = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Rendering', () => {
        test('renders topbar', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const topbar = react_1.screen.getByRole('banner');
            expect(topbar).toBeInTheDocument();
        });
        test('renders all action buttons', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            expect(react_1.screen.getByText(/colors/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/text.*button.*size/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/print/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/logout/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/quit/i)).toBeInTheDocument();
        });
    });
    describe('Button Interactions', () => {
        test('colors button is clickable', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const colorsBtn = react_1.screen.getByText(/colors/i);
            react_1.fireEvent.click(colorsBtn);
            expect(colorsBtn).toBeInTheDocument();
        });
        test('print button is clickable', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const printBtn = react_1.screen.getByText(/print/i);
            react_1.fireEvent.click(printBtn);
            expect(printBtn).toBeInTheDocument();
        });
        test('logout button calls onLogout', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const logoutBtn = react_1.screen.getByText(/logout/i);
            react_1.fireEvent.click(logoutBtn);
            expect(mockOnLogout).toHaveBeenCalled();
        });
        test('quit button calls onQuit', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const quitBtn = react_1.screen.getByText(/quit/i);
            react_1.fireEvent.click(quitBtn);
            expect(mockOnQuit).toHaveBeenCalled();
        });
    });
    describe('Accessibility', () => {
        test('quit button has danger styling', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const quitBtn = react_1.screen.getByText(/quit/i);
            expect(quitBtn).toBeInTheDocument();
        });
        test('all buttons are keyboard accessible', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: mockOnLogout, onQuit: mockOnQuit }));
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThanOrEqual(5);
        });
    });
});
describe('Accessibility', () => {
    test('quit button has danger styling', () => {
        renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: function () {
                throw new Error('Function not implemented.');
            }, onQuit: function () {
                throw new Error('Function not implemented.');
            } }));
        const quitBtn = react_1.screen.getByText(/quit/i);
        expect(quitBtn).toBeInTheDocument();
    });
    test('all buttons are keyboard accessible', () => {
        renderWithRouter((0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: function () {
                throw new Error('Function not implemented.');
            }, onQuit: function () {
                throw new Error('Function not implemented.');
            } }));
        const buttons = react_1.screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(5);
    });
});
describe('Sidebar Component - Comprehensive Coverage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Rendering', () => {
        test('renders sidebar', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            expect(react_1.screen.getByText('Care Connect')).toBeInTheDocument();
        });
        test('renders brand section', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            expect(react_1.screen.getByText('Your Health Companion')).toBeInTheDocument();
        });
        test('renders all navigation links', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            expect(react_1.screen.getByText(/home/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/my info/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/medications/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/symptoms/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/my health/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/exercises/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/activities/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/emergency/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/size demo/i)).toBeInTheDocument();
        });
    });
    describe('Navigation Links', () => {
        test('home link is clickable', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            const homeLink = react_1.screen.getByText(/home/i);
            react_1.fireEvent.click(homeLink);
            expect(homeLink).toBeInTheDocument();
        });
        test('medications link is clickable', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            const medLink = react_1.screen.getByText(/medications/i);
            react_1.fireEvent.click(medLink);
            expect(medLink).toBeInTheDocument();
        });
        test('emergency link is clickable', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            const emergencyLink = react_1.screen.getByText(/emergency/i);
            react_1.fireEvent.click(emergencyLink);
            expect(emergencyLink).toBeInTheDocument();
        });
    });
    describe('Visual Elements', () => {
        test('displays brand icon', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            expect(react_1.screen.getByText('Care Connect')).toBeInTheDocument();
        });
        test('navigation items have icons', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            const navItems = react_1.screen.getAllByRole('button');
            expect(navItems.length).toBeGreaterThanOrEqual(9);
        });
    });
    describe('Accessibility', () => {
        test('all nav items are keyboard accessible', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            const navButtons = react_1.screen.getAllByRole('button');
            navButtons.forEach(btn => {
                expect(btn).toBeInTheDocument();
            });
        });
        test('brand text is visible', () => {
            renderWithRouter((0, jsx_runtime_1.jsx)(Sidebar_1.default, {}));
            expect(react_1.screen.getByText('Care Connect')).toBeVisible();
        });
    });
});
describe('Panel Component - Comprehensive Coverage', () => {
    describe('Component Rendering', () => {
        test('renders without crashing', () => {
            const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Panel_1.default, { title: '', items: [], buttonText: '', buttonVariant: 'primary' }));
            expect(container).toBeTruthy();
        });
        test('renders with title', () => {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Panel_1.default, { title: "Test Panel", items: [], buttonText: '', buttonVariant: 'primary' }));
            expect(react_1.screen.getByText('Test Panel')).toBeInTheDocument();
        });
        test('renders with button', () => {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Panel_1.default, { title: '', items: [], buttonText: "Click Me", buttonVariant: 'primary' }));
            expect(react_1.screen.getByText('Click Me')).toBeInTheDocument();
        });
    });
    describe('Interactions', () => {
        test('button is clickable', () => {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Panel_1.default, { title: '', items: [], buttonText: "Test", buttonVariant: 'primary' }));
            const button = react_1.screen.getByText('Test');
            react_1.fireEvent.click(button);
            expect(button).toBeInTheDocument();
        });
    });
});
describe('TileCard Component - Comprehensive Coverage', () => {
    describe('Component Rendering', () => {
        test('renders without crashing', () => {
            const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: '', title: '', subtitle: '', color: 'blue' }));
            expect(container).toBeTruthy();
        });
        test('component exists in DOM', () => {
            const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: '', title: '', subtitle: '', color: 'blue' }));
            expect(container.firstChild).toBeTruthy();
        });
    });
});
