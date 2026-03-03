import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../app/App';

// Mock router to prevent navigation errors
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: () => <div>Route</div>,
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
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  test('App renders children', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });

  test('App component exists', () => {
    expect(App).toBeDefined();
  });
});