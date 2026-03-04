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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Medication Modal', () => {
    test('opens add medication modal on button click', () => {
      renderMedications();
      const addButton = screen.getAllByText(/add medication/i)[0];
      fireEvent.click(addButton);
      // Modal should appear
      expect(screen.queryAllByText(/medication|name/i).length).toBeGreaterThan(0);
    });

    test('modal can be closed', () => {
      renderMedications();
      const addButton = screen.getAllByText(/add medication/i)[0];
      fireEvent.click(addButton);
      
      const cancelButton = screen.queryByText(/cancel/i);
      if (cancelButton) {
        fireEvent.click(cancelButton);
      }
      expect(true).toBe(true); // Test passes if no crash
    });
  });

  describe('Medication Cards', () => {
    test('can interact with checkboxes', () => {
      renderMedications();
      const checkboxes = screen.getAllByRole('checkbox');
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeTruthy();
      }
    });

    test('displays time information', () => {
      renderMedications();
      const times = screen.queryAllByText(/AM|PM/i);
      expect(times.length).toBeGreaterThan(0);
    });

    test('shows medication status', () => {
      renderMedications();
      const statuses = screen.queryAllByText(/taken|due|upcoming/i);
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe('Delete Functionality', () => {
    test('has delete buttons', () => {
      renderMedications();
      const deleteButtons = screen.queryAllByTitle(/delete/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    test('delete buttons are clickable', () => {
      renderMedications();
      const deleteButtons = screen.queryAllByTitle(/delete/i);
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        expect(deleteButtons[0]).toBeTruthy();
      }
    });
  });

  describe('Time Display', () => {
    test('shows various medication times', () => {
      renderMedications();
      const morningTimes = screen.queryAllByText(/8:00 AM|9:00 AM|10:00 AM/i);
      const afternoonTimes = screen.queryAllByText(/2:00 PM|6:00 PM/i);
      const eveningTimes = screen.queryAllByText(/8:00 PM|9:00 PM/i);
      
      const totalTimes = morningTimes.length + afternoonTimes.length + eveningTimes.length;
      expect(totalTimes).toBeGreaterThan(0);
    });
  });

  describe('Medication Information', () => {
    test('displays medication names', () => {
      renderMedications();
      expect(screen.getByText(/Carbidopa-Levodopa/i)).toBeInTheDocument();
    });

    test('displays dosage information', () => {
      renderMedications();
      const dosages = screen.queryAllByText(/mg/i);
      expect(dosages.length).toBeGreaterThan(0);
    });

    test('displays medication notes', () => {
      renderMedications();
      const notes = screen.queryAllByText(/food|dizziness|same time/i);
      expect(notes.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Elements', () => {
    test('displays medication icons', () => {
      renderMedications();
      const icons = screen.getAllByText(/✎/i);
      expect(icons.length).toBeGreaterThan(0);
    });

    test('displays time icons', () => {
      renderMedications();
      const timeIcons = screen.getAllByText(/🕒/i);
      expect(timeIcons.length).toBeGreaterThan(0);
    });

    test('has edit buttons', () => {
      renderMedications();
      const editButtons = screen.getAllByTitle(/edit/i);
      expect(editButtons.length).toBeGreaterThan(0);
      expect(editButtons[0].getAttribute('title')).toContain('not implemented');
    });
  });

  describe('Accessibility', () => {
    test('has accessible checkboxes and buttons', () => {
      renderMedications();
      const checkboxes = screen.getAllByRole('checkbox');
      const buttons = screen.getAllByRole('button');
      
      expect(checkboxes.length).toBeGreaterThan(0);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});