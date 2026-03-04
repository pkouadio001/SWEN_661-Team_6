"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const App_1 = __importDefault(require("../app/App"));
// Mock router to prevent navigation errors
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    BrowserRouter: ({ children }) => (0, jsx_runtime_1.jsx)("div", { children: children }),
    Routes: ({ children }) => (0, jsx_runtime_1.jsx)("div", { children: children }),
    Route: () => (0, jsx_runtime_1.jsx)("div", { children: "Route" }),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', state: {} }),
}));
// Mock window.careconnect
global.window.careconnect = {
    quitApp: jest.fn(),
    getAppVersion: jest.fn(() => Promise.resolve('1.0.0')),
    onNavigate: jest.fn(() => jest.fn()),
};
describe('Entry Files - Smoke Tests', () => {
    test('App renders without crashing', () => {
        const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(App_1.default, {}));
        expect(container).toBeTruthy();
    });
    test('App renders children', () => {
        const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(App_1.default, {}));
        expect(container.firstChild).toBeTruthy();
    });
    test('App component exists', () => {
        expect(App_1.default).toBeDefined();
    });
});
