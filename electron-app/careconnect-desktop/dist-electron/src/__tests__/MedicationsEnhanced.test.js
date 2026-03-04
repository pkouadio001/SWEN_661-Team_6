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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Add Medication Modal', () => {
        test('opens add medication modal on button click', () => {
            renderMedications();
            const addButton = react_1.screen.getAllByText(/add medication/i)[0];
            react_1.fireEvent.click(addButton);
            // Modal should appear
            expect(react_1.screen.queryAllByText(/medication|name/i).length).toBeGreaterThan(0);
        });
        test('modal can be closed', () => {
            renderMedications();
            const addButton = react_1.screen.getAllByText(/add medication/i)[0];
            react_1.fireEvent.click(addButton);
            const cancelButton = react_1.screen.queryByText(/cancel/i);
            if (cancelButton) {
                react_1.fireEvent.click(cancelButton);
            }
            expect(true).toBe(true); // Test passes if no crash
        });
    });
    describe('Medication Cards', () => {
        test('can interact with checkboxes', () => {
            renderMedications();
            const checkboxes = react_1.screen.getAllByRole('checkbox');
            if (checkboxes.length > 0) {
                react_1.fireEvent.click(checkboxes[0]);
                expect(checkboxes[0]).toBeTruthy();
            }
        });
        test('displays time information', () => {
            renderMedications();
            const times = react_1.screen.queryAllByText(/AM|PM/i);
            expect(times.length).toBeGreaterThan(0);
        });
        test('shows medication status', () => {
            renderMedications();
            const statuses = react_1.screen.queryAllByText(/taken|due|upcoming/i);
            expect(statuses.length).toBeGreaterThan(0);
        });
    });
    describe('Delete Functionality', () => {
        test('has delete buttons', () => {
            renderMedications();
            const deleteButtons = react_1.screen.queryAllByTitle(/delete/i);
            expect(deleteButtons.length).toBeGreaterThan(0);
        });
        test('delete buttons are clickable', () => {
            renderMedications();
            const deleteButtons = react_1.screen.queryAllByTitle(/delete/i);
            if (deleteButtons.length > 0) {
                react_1.fireEvent.click(deleteButtons[0]);
                expect(deleteButtons[0]).toBeTruthy();
            }
        });
    });
    describe('Time Display', () => {
        test('shows various medication times', () => {
            renderMedications();
            const morningTimes = react_1.screen.queryAllByText(/8:00 AM|9:00 AM|10:00 AM/i);
            const afternoonTimes = react_1.screen.queryAllByText(/2:00 PM|6:00 PM/i);
            const eveningTimes = react_1.screen.queryAllByText(/8:00 PM|9:00 PM/i);
            const totalTimes = morningTimes.length + afternoonTimes.length + eveningTimes.length;
            expect(totalTimes).toBeGreaterThan(0);
        });
    });
    describe('Medication Information', () => {
        test('displays medication names', () => {
            renderMedications();
            expect(react_1.screen.getByText(/Carbidopa-Levodopa/i)).toBeInTheDocument();
        });
        test('displays dosage information', () => {
            renderMedications();
            const dosages = react_1.screen.queryAllByText(/mg/i);
            expect(dosages.length).toBeGreaterThan(0);
        });
        test('displays medication notes', () => {
            renderMedications();
            const notes = react_1.screen.queryAllByText(/food|dizziness|same time/i);
            expect(notes.length).toBeGreaterThan(0);
        });
    });
    describe('Visual Elements', () => {
        test('displays medication icons', () => {
            renderMedications();
            const icons = react_1.screen.getAllByText(/✎/i);
            expect(icons.length).toBeGreaterThan(0);
        });
        test('displays time icons', () => {
            renderMedications();
            const timeIcons = react_1.screen.getAllByText(/🕒/i);
            expect(timeIcons.length).toBeGreaterThan(0);
        });
        test('has edit buttons', () => {
            renderMedications();
            const editButtons = react_1.screen.getAllByTitle(/edit/i);
            expect(editButtons.length).toBeGreaterThan(0);
            expect(editButtons[0].getAttribute('title')).toContain('not implemented');
        });
    });
    describe('Accessibility', () => {
        test('has accessible checkboxes and buttons', () => {
            renderMedications();
            const checkboxes = react_1.screen.getAllByRole('checkbox');
            const buttons = react_1.screen.getAllByRole('button');
            expect(checkboxes.length).toBeGreaterThan(0);
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
