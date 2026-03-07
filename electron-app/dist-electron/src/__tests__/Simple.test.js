"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Simple Test Suite', () => {
    test('basic math works', () => {
        expect(1 + 1).toBe(2);
    });
    test('string contains substring', () => {
        expect('CareConnect').toContain('Care');
    });
    test('array includes item', () => {
        const items = ['Home', 'Medications', 'Emergency'];
        expect(items).toContain('Medications');
    });
    test('boolean logic works', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
    });
    test('object properties work', () => {
        const user = { name: 'Test User', age: 25 };
        expect(user.name).toBe('Test User');
        expect(user.age).toBe(25);
    });
});
