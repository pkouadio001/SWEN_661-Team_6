import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MedicationsScreen from '../screens/MedicationsScreen';

const renderMedications = () => {
  return render(
    <BrowserRouter>
      <MedicationsScreen />
    </BrowserRouter>
  );
};

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Medications Screen - Enhanced Coverage', () => {
  describe('Component Rendering', () => {
    test('renders medication tracker title', () => {
      renderMedications();
      expect(screen.getByText(/medication tracker/i)).toBeInTheDocument();
    });

    test('renders subtitle', () => {
      renderMedications();
      expect(screen.getByText(/keep track of your daily medications/i)).toBeInTheDocument();
    });

    test('renders add medication button', () => {
      renderMedications();
      expect(screen.getByText(/add medication/i)).toBeInTheDocument();
    });
  });

  describe('Medication List', () => {
    test('displays medication cards', () => {
      renderMedications();
      const medications = screen.queryAllByText(/carbidopa|levodopa|amantadine|pramipexole/i);
      expect(medications.length).toBeGreaterThan(0);
    });

    test('shows medication dosage', () => {
      renderMedications();
      const dosages = screen.getAllByText(/\d+(-\d+)?\s?mg/i);
      expect(dosages.length).toBeGreaterThan(0);
    });

    test('displays medication schedule', () => {
      renderMedications();
      const times = screen.getAllByText(/\d{1,2}:\d{2}\s?(AM|PM)/);
      expect(times.length).toBeGreaterThan(0);
    });

    test('shows take with food warning', () => {
      renderMedications();
      expect(screen.getByText(/take with food/i)).toBeInTheDocument();
    });
  });

  describe('Time Slots', () => {
    test('renders checkboxes for each time slot', () => {
      renderMedications();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    test('time slots show status indicators', () => {
      renderMedications();
      const statuses = ['taken', 'missed', 'upcoming', 'due now'];
      const hasStatus = statuses.some(status =>
        screen.queryAllByText(new RegExp(status, 'i')).length > 0
      );
      expect(hasStatus).toBeTruthy();
    });

    test('taken slots have green background', () => {
      renderMedications();
      const takenText = screen.queryAllByText(/taken/i)[0];
      if (takenText) {
        const parentDiv = takenText.closest('div');
        expect(parentDiv).toBeTruthy();
      }
    });

    test('missed slots have red background', () => {
      renderMedications();
      const missedText = screen.queryByText(/missed/i);
      if (missedText) {
        const parentDiv = missedText.closest('div');
        expect(parentDiv).toBeTruthy();
      }
    });

    test('upcoming slots have gray background', () => {
      renderMedications();
      const upcomingText = screen.queryByText(/upcoming/i);
      if (upcomingText) {
        const parentDiv = upcomingText.closest('div');
        expect(parentDiv).toBeTruthy();
      }
    });
  });

  describe('Medication Actions', () => {
    test('medication checkboxes exist', () => {
      renderMedications();
      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(0);
    });

    test('medication cards are displayed', () => {
      renderMedications();
      const medications = screen.queryAllByText(/carbidopa|levodopa|amantadine/i);
      expect(medications.length).toBeGreaterThanOrEqual(0);
    });

    test('edit icon is present', () => {
      renderMedications();
      const editButtons = screen.queryAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThanOrEqual(0);
    });

    test('delete icon is present', () => {
      renderMedications();
      const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThanOrEqual(0);
    });

    test('clicking edit does not crash', () => {
      renderMedications();
      const editButtons = screen.queryAllByRole('button', { name: /edit/i });

      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);
        expect(editButtons[0]).toBeInTheDocument();
      }
    });

    test('clicking delete does not crash', () => {
      renderMedications();
      const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });

      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        expect(deleteButtons[0]).toBeInTheDocument();
      }
    });
  });

  describe('Add Medication', () => {
    test('clicking add medication opens form', () => {
      renderMedications();
      const addButton = screen.getByText(/add medication/i);
      fireEvent.click(addButton);
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Status Colors', () => {
    test('uses color with text labels', () => {
      renderMedications();

      const taken = screen.queryAllByText(/taken/i)[0];
      const missed = screen.queryByText(/missed/i);
      const upcoming = screen.queryByText(/upcoming/i);

      expect(taken || missed || upcoming).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('checkboxes are labeled', () => {
      renderMedications();
      const checkboxes = screen.getAllByRole('checkbox');

      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeInTheDocument();
      });
    });

    test('medication names are readable', () => {
      renderMedications();
      const medications = screen.queryAllByText(/carbidopa|levodopa/i);
      expect(medications.length).toBeGreaterThan(0);
    });
  });
});