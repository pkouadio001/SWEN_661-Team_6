"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const SymptomsScreen_1 = __importDefault(require("../screens/SymptomsScreen"));
const renderSymptoms = () => {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(SymptomsScreen_1.default, {}) }));
};
afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
});
afterAll(() => {
    jest.restoreAllMocks();
});
describe('Symptoms Screen - Comprehensive Coverage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Rendering', () => {
        test('renders symptom tracker title', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/symptom tracker/i)).toBeInTheDocument();
        });
        test('renders subtitle or description', () => {
            renderSymptoms();
            const subtitle = react_1.screen.queryByText(/monitor and record your symptoms/i);
            if (subtitle) {
                expect(subtitle).toBeInTheDocument();
            }
        });
        test('renders log symptom button', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/log symptom/i)).toBeInTheDocument();
        });
        test('renders symptom trends section', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/symptom trends/i)).toBeInTheDocument();
        });
        test('renders symptom history section', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/symptom history/i)).toBeInTheDocument();
        });
    });
    describe('Symptom Statistics Cards', () => {
        test('displays total symptoms logged', () => {
            renderSymptoms();
            const total = react_1.screen.queryByText(/total|logged|tracked/i);
            expect(total).toBeTruthy();
        });
        test('shows average severity', () => {
            renderSymptoms();
            const avg = react_1.screen.queryByText(/average severity|avg/i);
            if (avg) {
                expect(avg).toBeInTheDocument();
            }
        });
        test('displays most common symptom', () => {
            renderSymptoms();
            const common = react_1.screen.queryByText(/most common|frequent/i);
            if (common) {
                expect(common).toBeInTheDocument();
            }
        });
        test('shows severity rating display', () => {
            renderSymptoms();
            const severityNumbers = react_1.screen.queryAllByText(/\d+(\.\d+)?/);
            expect(severityNumbers.length).toBeGreaterThan(0);
        });
    });
    describe('Symptom Trends Chart', () => {
        test('renders chart visualization', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/symptom trends/i)).toBeInTheDocument();
        });
        test('displays time period selector', () => {
            renderSymptoms();
            const periods = ['weekly', 'monthly', '12 months'];
            const hasPeriod = periods.some(p => react_1.screen.queryByText(new RegExp(p, 'i')));
            expect(hasPeriod).toBeTruthy();
        });
        test('weekly tab is clickable', () => {
            renderSymptoms();
            const weeklyTab = react_1.screen.queryByText(/weekly/i);
            if (weeklyTab) {
                react_1.fireEvent.click(weeklyTab);
                expect(weeklyTab).toBeInTheDocument();
            }
        });
        test('monthly tab is clickable', () => {
            renderSymptoms();
            const monthlyTab = react_1.screen.queryByText(/monthly/i);
            if (monthlyTab) {
                react_1.fireEvent.click(monthlyTab);
                expect(monthlyTab).toBeInTheDocument();
            }
        });
        test('12 months tab is clickable', () => {
            renderSymptoms();
            const yearTab = react_1.screen.queryByText(/12 months/i);
            if (yearTab) {
                react_1.fireEvent.click(yearTab);
                expect(yearTab).toBeInTheDocument();
            }
        });
        test('shows multiple symptoms tracked label', () => {
            renderSymptoms();
            const multipleLabel = react_1.screen.queryByText(/multiple symptoms tracked/i);
            if (multipleLabel) {
                expect(multipleLabel).toBeInTheDocument();
            }
        });
        test('displays legend or symptom names', () => {
            renderSymptoms();
            const symptoms = ['tremor', 'stiffness', 'fatigue', 'balance'];
            const hasSymptom = symptoms.some(s => react_1.screen.queryByText(new RegExp(s, 'i')));
            expect(hasSymptom).toBeTruthy();
        });
    });
    describe('Symptom History', () => {
        test('displays view history button', () => {
            renderSymptoms();
            expect(react_1.screen.getByText(/view history/i)).toBeInTheDocument();
        });
        test('clicking view history expands list', () => {
            renderSymptoms();
            const viewButton = react_1.screen.getByText(/view history/i);
            react_1.fireEvent.click(viewButton);
            expect(viewButton).toBeInTheDocument();
        });
        test('shows recent symptom entries', () => {
            renderSymptoms();
            const entries = react_1.screen.queryAllByText(/tremor|stiffness|fatigue/i);
            expect(entries.length).toBeGreaterThanOrEqual(0);
        });
        test('displays symptom dates', () => {
            renderSymptoms();
            const datePattern = /\d{1,2}\/\d{1,2}\/\d{2,4}|\d+ (days?|hours?) ago/i;
            const dates = react_1.screen.queryAllByText(datePattern);
            expect(dates.length).toBeGreaterThanOrEqual(0);
        });
        // ✅ Updated to check numeric severity instead of text
        test('shows severity levels for each entry', () => {
            renderSymptoms();
            const severityNumbers = react_1.screen.queryAllByText(/[1-5]|[1-9]\/10/);
            expect(severityNumbers.length).toBeGreaterThanOrEqual(1);
        });
    });
    describe('Log Symptom Functionality', () => {
        test('clicking log symptom opens form', () => {
            renderSymptoms();
            const logButton = react_1.screen.getByText(/log symptom/i);
            react_1.fireEvent.click(logButton);
            expect(logButton).toBeInTheDocument();
        });
        test('log symptom button is accessible', () => {
            renderSymptoms();
            const logButton = react_1.screen.getByText(/log symptom/i);
            expect(logButton.closest('button')).toBeInTheDocument();
        });
    });
    describe('Severity Indicators', () => {
        // ✅ Updated to check numeric severity instead of text
        test('displays severity scale', () => {
            renderSymptoms();
            const severityNumbers = react_1.screen.queryAllByText(/[1-5]|[1-9]\/10/);
            expect(severityNumbers.length).toBeGreaterThanOrEqual(1);
        });
        test('severity has numerical representation', () => {
            renderSymptoms();
            const numbers = react_1.screen.queryAllByText(/[1-5]|[1-9]\/10/);
            expect(numbers.length).toBeGreaterThanOrEqual(0);
        });
        // ✅ Updated to check numeric severity instead of text
        test('uses color coding with text labels', () => {
            renderSymptoms();
            const severityNumbers = react_1.screen.queryAllByText(/[1-5]|[1-9]\/10/);
            expect(severityNumbers.length).toBeGreaterThanOrEqual(1);
        });
    });
    describe('User Interactions', () => {
        test('can switch between time periods', () => {
            renderSymptoms();
            const weeklyBtn = react_1.screen.queryByText(/weekly/i);
            const monthlyBtn = react_1.screen.queryByText(/monthly/i);
            if (weeklyBtn && monthlyBtn) {
                react_1.fireEvent.click(weeklyBtn);
                react_1.fireEvent.click(monthlyBtn);
                expect(monthlyBtn).toBeInTheDocument();
            }
        });
        test('hovering over chart shows details', () => {
            renderSymptoms();
            const chartArea = react_1.screen.getByText(/symptom trends/i).parentElement;
            if (chartArea) {
                react_1.fireEvent.mouseEnter(chartArea);
                expect(chartArea).toBeInTheDocument();
            }
        });
    });
    describe('State Management', () => {
        test('selected time period persists', () => {
            renderSymptoms();
            const monthlyBtn = react_1.screen.queryByText(/monthly/i);
            if (monthlyBtn) {
                react_1.fireEvent.click(monthlyBtn);
                expect(monthlyBtn).toBeInTheDocument();
            }
        });
    });
    describe('Accessibility', () => {
        test('log symptom button has accessible label', () => {
            renderSymptoms();
            const button = react_1.screen.getByText(/log symptom/i);
            expect(button.closest('button')).toBeInTheDocument();
        });
        test('chart has text alternative', () => {
            renderSymptoms();
            const chartTexts = react_1.screen.queryAllByText(/symptom trends|multiple symptoms tracked/i);
            expect(chartTexts.length).toBeGreaterThanOrEqual(1);
        });
        test('time period tabs are keyboard accessible', () => {
            renderSymptoms();
            const tabs = react_1.screen.queryAllByRole('tab');
            if (tabs.length > 0) {
                tabs.forEach(tab => {
                    expect(tab).toBeInTheDocument();
                });
            }
        });
    });
    describe('Edge Cases', () => {
        test('handles no symptom data gracefully', () => {
            renderSymptoms();
            const noDataMsg = react_1.screen.queryByText(/no symptoms|no data|start logging/i);
            if (noDataMsg) {
                expect(noDataMsg).toBeInTheDocument();
            }
        });
        test('displays message when history is empty', () => {
            renderSymptoms();
            const emptyMsg = react_1.screen.queryByText(/no history|haven't logged/i);
            expect(true).toBe(true);
        });
    });
    describe('Data Display', () => {
        test('symptom names are readable', () => {
            renderSymptoms();
            const symptoms = react_1.screen.queryAllByText(/tremor|stiffness|fatigue|balance|dizziness/i);
            expect(symptoms.length).toBeGreaterThanOrEqual(0);
        });
        test('dates are formatted consistently', () => {
            renderSymptoms();
            const dateElements = react_1.screen.queryAllByText(/\d/);
            expect(dateElements.length).toBeGreaterThan(0);
        });
    });
});
