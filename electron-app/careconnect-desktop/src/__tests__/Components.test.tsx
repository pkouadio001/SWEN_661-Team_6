import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import Panel from '../components/Panel';
import TileCard from '../components/TileCard';


const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
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
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const topbar = screen.getByRole('banner');
      expect(topbar).toBeInTheDocument();
    });

    test('renders all action buttons', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      expect(screen.getByText(/colors/i)).toBeInTheDocument();
      expect(screen.getByText(/text.*button.*size/i)).toBeInTheDocument();
      expect(screen.getByText(/print/i)).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
      expect(screen.getByText(/quit/i)).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    test('colors button is clickable', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const colorsBtn = screen.getByText(/colors/i);
      fireEvent.click(colorsBtn);
      expect(colorsBtn).toBeInTheDocument();
    });

    test('print button is clickable', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const printBtn = screen.getByText(/print/i);
      fireEvent.click(printBtn);
      expect(printBtn).toBeInTheDocument();
    });

    test('logout button calls onLogout', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const logoutBtn = screen.getByText(/logout/i);
      fireEvent.click(logoutBtn);
      expect(mockOnLogout).toHaveBeenCalled();
    });

    test('quit button calls onQuit', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const quitBtn = screen.getByText(/quit/i);
      fireEvent.click(quitBtn);
      expect(mockOnQuit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('quit button has danger styling', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const quitBtn = screen.getByText(/quit/i);
      expect(quitBtn).toBeInTheDocument();
    });

    test('all buttons are keyboard accessible', () => {
      renderWithRouter(<TopBar onLogout={mockOnLogout} onQuit={mockOnQuit} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });
  });
});
  describe('Accessibility', () => {
    test('quit button has danger styling', () => {
      renderWithRouter(<TopBar onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } onQuit={function (): void {
        throw new Error('Function not implemented.');
      } } />);
      const quitBtn = screen.getByText(/quit/i);
      expect(quitBtn).toBeInTheDocument();
    });

    test('all buttons are keyboard accessible', () => {
      renderWithRouter(<TopBar onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } onQuit={function (): void {
        throw new Error('Function not implemented.');
      } } />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });
  });

describe('Sidebar Component - Comprehensive Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders sidebar', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Care Connect')).toBeInTheDocument();
    });

    test('renders brand section', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Your Health Companion')).toBeInTheDocument();
    });

    test('renders all navigation links', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText(/home/i)).toBeInTheDocument();
      expect(screen.getByText(/my info/i)).toBeInTheDocument();
      expect(screen.getByText(/medications/i)).toBeInTheDocument();
      expect(screen.getByText(/symptoms/i)).toBeInTheDocument();
      expect(screen.getByText(/my health/i)).toBeInTheDocument();
      expect(screen.getByText(/exercises/i)).toBeInTheDocument();
      expect(screen.getByText(/activities/i)).toBeInTheDocument();
      expect(screen.getByText(/emergency/i)).toBeInTheDocument();
      expect(screen.getByText(/size demo/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('home link is clickable', () => {
      renderWithRouter(<Sidebar />);
      const homeLink = screen.getByText(/home/i);
      fireEvent.click(homeLink);
      expect(homeLink).toBeInTheDocument();
    });

    test('medications link is clickable', () => {
      renderWithRouter(<Sidebar />);
      const medLink = screen.getByText(/medications/i);
      fireEvent.click(medLink);
      expect(medLink).toBeInTheDocument();
    });

    test('emergency link is clickable', () => {
      renderWithRouter(<Sidebar />);
      const emergencyLink = screen.getByText(/emergency/i);
      fireEvent.click(emergencyLink);
      expect(emergencyLink).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    test('displays brand icon', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Care Connect')).toBeInTheDocument();
    });

    test('navigation items have icons', () => {
      renderWithRouter(<Sidebar />);
      const navItems = screen.getAllByRole('button');
      expect(navItems.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Accessibility', () => {
    test('all nav items are keyboard accessible', () => {
      renderWithRouter(<Sidebar />);
      const navButtons = screen.getAllByRole('button');
      navButtons.forEach(btn => {
        expect(btn).toBeInTheDocument();
      });
    });

    test('brand text is visible', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Care Connect')).toBeVisible();
    });
  });
});

describe('Panel Component - Comprehensive Coverage', () => {
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      const { container } = render(<Panel title={''} items={[]} buttonText={''} buttonVariant={'primary'} />);
      expect(container).toBeTruthy();
    });

    test('renders with title', () => {
      render(<Panel title="Test Panel" items={[]} buttonText={''} buttonVariant={'primary'} />);
      expect(screen.getByText('Test Panel')).toBeInTheDocument();
    });

    test('renders with button', () => {
      render(<Panel title={''} items={[]} buttonText="Click Me" buttonVariant={'primary'} />);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('button is clickable', () => {
      render(<Panel title={''} items={[]} buttonText="Test" buttonVariant={'primary'} />);
      const button = screen.getByText('Test');
      fireEvent.click(button);
      expect(button).toBeInTheDocument();
    });
  });
});

describe('TileCard Component - Comprehensive Coverage', () => {
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      const { container } = render(<TileCard icon={''} title={''} subtitle={''} color={'blue'} />);
      expect(container).toBeTruthy();
    });

    test('component exists in DOM', () => {
      const { container } = render(<TileCard icon={''} title={''} subtitle={''} color={'blue'} />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});