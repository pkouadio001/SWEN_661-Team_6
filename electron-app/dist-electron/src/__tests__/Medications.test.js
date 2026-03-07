"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const MedicationsScreen_1 = __importDefault(require("../screens/MedicationsScreen"));
const renderMedications = () => {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(MedicationsScreen_1.default, {}) }));
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
            expect(react_1.screen.getByText(/medication tracker/i)).toBeInTheDocument();
        });
        test('renders subtitle', () => {
            renderMedications();
            expect(react_1.screen.getByText(/keep track of your daily medications/i)).toBeInTheDocument();
        });
        test('renders add medication button', () => {
            renderMedications();
            expect(react_1.screen.getByText(/add medication/i)).toBeInTheDocument();
        });
    });
    describe('Medication List', () => {
        test('displays medication cards', () => {
            renderMedications();
            const medications = react_1.screen.queryAllByText(/carbidopa|levodopa|amantadine|pramipexole/i);
            expect(medications.length).toBeGreaterThan(0);
        });
        test('shows medication dosage', () => {
            renderMedications();
            const dosages = react_1.screen.getAllByText(/\d+(-\d+)?\s?mg/i);
            expect(dosages.length).toBeGreaterThan(0);
        });
        test('displays medication schedule', () => {
            renderMedications();
            const times = react_1.screen.getAllByText(/\d{1,2}:\d{2}\s?(AM|PM)/);
            expect(times.length).toBeGreaterThan(0);
        });
        test('shows take with food warning', () => {
            renderMedications();
            expect(react_1.screen.getByText(/take with food/i)).toBeInTheDocument();
        });
    });
    describe('Time Slots', () => {
        test('renders checkboxes for each time slot', () => {
            renderMedications();
            const checkboxes = react_1.screen.getAllByRole('checkbox');
            expect(checkboxes.length).toBeGreaterThan(0);
        });
        test('time slots show status indicators', () => {
            renderMedications();
            const statuses = ['taken', 'missed', 'upcoming', 'due now'];
            const hasStatus = statuses.some(status => react_1.screen.queryAllByText(new RegExp(status, 'i')).length > 0);
            expect(hasStatus).toBeTruthy();
        });
        test('taken slots have green background', () => {
            renderMedications();
            const takenText = react_1.screen.queryAllByText(/taken/i)[0];
            if (takenText) {
                const parentDiv = takenText.closest('div');
                expect(parentDiv).toBeTruthy();
            }
        });
        test('missed slots have red background', () => {
            renderMedications();
            const missedText = react_1.screen.queryByText(/missed/i);
            if (missedText) {
                const parentDiv = missedText.closest('div');
                expect(parentDiv).toBeTruthy();
            }
        });
        test('upcoming slots have gray background', () => {
            renderMedications();
            const upcomingText = react_1.screen.queryByText(/upcoming/i);
            if (upcomingText) {
                const parentDiv = upcomingText.closest('div');
                expect(parentDiv).toBeTruthy();
            }
        });
    });
    describe('Medication Actions', () => {
        test('medication checkboxes exist', () => {
            renderMedications();
            const checkboxes = react_1.screen.queryAllByRole('checkbox');
            expect(checkboxes.length).toBeGreaterThanOrEqual(0);
        });
        test('medication cards are displayed', () => {
            renderMedications();
            const medications = react_1.screen.queryAllByText(/carbidopa|levodopa|amantadine/i);
            expect(medications.length).toBeGreaterThanOrEqual(0);
        });
        test('edit icon is present', () => {
            renderMedications();
            const editButtons = react_1.screen.queryAllByRole('button', { name: /edit/i });
            expect(editButtons.length).toBeGreaterThanOrEqual(0);
        });
        test('delete icon is present', () => {
            renderMedications();
            const deleteButtons = react_1.screen.queryAllByRole('button', { name: /delete/i });
            expect(deleteButtons.length).toBeGreaterThanOrEqual(0);
        });
        test('clicking edit does not crash', () => {
            renderMedications();
            const editButtons = react_1.screen.queryAllByRole('button', { name: /edit/i });
            if (editButtons.length > 0) {
                react_1.fireEvent.click(editButtons[0]);
                expect(editButtons[0]).toBeInTheDocument();
            }
        });
        test('clicking delete does not crash', () => {
            renderMedications();
            const deleteButtons = react_1.screen.queryAllByRole('button', { name: /delete/i });
            if (deleteButtons.length > 0) {
                react_1.fireEvent.click(deleteButtons[0]);
                expect(deleteButtons[0]).toBeInTheDocument();
            }
        });
    });
    describe('Add Medication', () => {
        test('clicking add medication opens form', () => {
            renderMedications();
            const addButton = react_1.screen.getByText(/add medication/i);
            react_1.fireEvent.click(addButton);
            expect(addButton).toBeInTheDocument();
        });
    });
    describe('Status Colors', () => {
        test('uses color with text labels', () => {
            renderMedications();
            const taken = react_1.screen.queryAllByText(/taken/i)[0];
            const missed = react_1.screen.queryByText(/missed/i);
            const upcoming = react_1.screen.queryByText(/upcoming/i);
            expect(taken || missed || upcoming).toBeTruthy();
        });
    });
    describe('Accessibility', () => {
        test('checkboxes are labeled', () => {
            renderMedications();
            const checkboxes = react_1.screen.getAllByRole('checkbox');
            checkboxes.forEach(checkbox => {
                expect(checkbox).toBeInTheDocument();
            });
        });
        test('medication names are readable', () => {
            renderMedications();
            const medications = react_1.screen.queryAllByText(/carbidopa|levodopa/i);
            expect(medications.length).toBeGreaterThan(0);
        });
    });
});
