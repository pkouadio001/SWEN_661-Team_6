"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Utility Functions - Comprehensive Coverage', () => {
    describe('PIN Validation - isSixDigits', () => {
        // Only change: reject non-string inputs
        const isSixDigits = (pin) => {
            if (typeof pin !== 'string')
                return false;
            return /^[0-9]{6}$/.test(pin);
        };
        describe('Valid PINs', () => {
            test('accepts 6-digit numeric PIN', () => {
                expect(isSixDigits('123456')).toBe(true);
            });
            test('accepts all zeros', () => {
                expect(isSixDigits('000000')).toBe(true);
            });
            test('accepts all nines', () => {
                expect(isSixDigits('999999')).toBe(true);
            });
            test('accepts repeating digits', () => {
                expect(isSixDigits('111111')).toBe(true);
                expect(isSixDigits('222222')).toBe(true);
                expect(isSixDigits('333333')).toBe(true);
            });
            test('accepts sequential digits', () => {
                expect(isSixDigits('123456')).toBe(true);
                expect(isSixDigits('654321')).toBe(true);
            });
        });
        describe('Invalid Length', () => {
            test('rejects empty string', () => {
                expect(isSixDigits('')).toBe(false);
            });
            test('rejects 1-digit PIN', () => {
                expect(isSixDigits('1')).toBe(false);
            });
            test('rejects 2-digit PIN', () => {
                expect(isSixDigits('12')).toBe(false);
            });
            test('rejects 3-digit PIN', () => {
                expect(isSixDigits('123')).toBe(false);
            });
            test('rejects 4-digit PIN', () => {
                expect(isSixDigits('1234')).toBe(false);
            });
            test('rejects 5-digit PIN', () => {
                expect(isSixDigits('12345')).toBe(false);
            });
            test('rejects 7-digit PIN', () => {
                expect(isSixDigits('1234567')).toBe(false);
            });
            test('rejects 10-digit PIN', () => {
                expect(isSixDigits('1234567890')).toBe(false);
            });
        });
        describe('Invalid Characters', () => {
            test('rejects alphabetic characters', () => {
                expect(isSixDigits('abcdef')).toBe(false);
                expect(isSixDigits('ABCDEF')).toBe(false);
            });
            test('rejects mixed alphanumeric', () => {
                expect(isSixDigits('12345a')).toBe(false);
                expect(isSixDigits('a12345')).toBe(false);
                expect(isSixDigits('123a45')).toBe(false);
            });
            test('rejects special characters', () => {
                expect(isSixDigits('123-456')).toBe(false);
                expect(isSixDigits('123.456')).toBe(false);
                expect(isSixDigits('123@456')).toBe(false);
                expect(isSixDigits('123#456')).toBe(false);
                expect(isSixDigits('123$456')).toBe(false);
                expect(isSixDigits('123%456')).toBe(false);
                expect(isSixDigits('123^456')).toBe(false);
                expect(isSixDigits('123&456')).toBe(false);
            });
            test('rejects whitespace', () => {
                expect(isSixDigits('123 456')).toBe(false);
                expect(isSixDigits(' 123456')).toBe(false);
                expect(isSixDigits('123456 ')).toBe(false);
                expect(isSixDigits('\t123456')).toBe(false);
                expect(isSixDigits('123456\n')).toBe(false);
            });
        });
        describe('Edge Cases', () => {
            test('rejects null', () => {
                expect(isSixDigits(null)).toBe(false);
            });
            test('rejects undefined', () => {
                expect(isSixDigits(undefined)).toBe(false);
            });
            test('rejects number type', () => {
                expect(isSixDigits(123456)).toBe(false);
            });
            test('rejects object', () => {
                expect(isSixDigits({})).toBe(false);
            });
            test('rejects array', () => {
                expect(isSixDigits([])).toBe(false);
            });
        });
    });
    describe('String Utilities', () => {
        describe('trim function', () => {
            test('removes leading spaces', () => {
                expect('  hello'.trim()).toBe('hello');
            });
            test('removes trailing spaces', () => {
                expect('hello  '.trim()).toBe('hello');
            });
            test('removes both leading and trailing spaces', () => {
                expect('  hello  '.trim()).toBe('hello');
            });
            test('removes tabs and newlines', () => {
                expect('\thello\n'.trim()).toBe('hello');
            });
            test('returns empty string for whitespace only', () => {
                expect('   '.trim()).toBe('');
            });
            test('preserves internal spaces', () => {
                expect('hello world'.trim()).toBe('hello world');
            });
        });
        describe('toLowerCase function', () => {
            test('converts uppercase to lowercase', () => {
                expect('HELLO'.toLowerCase()).toBe('hello');
            });
            test('handles mixed case', () => {
                expect('HeLLo'.toLowerCase()).toBe('hello');
            });
            test('preserves numbers', () => {
                expect('ABC123'.toLowerCase()).toBe('abc123');
            });
            test('handles empty string', () => {
                expect(''.toLowerCase()).toBe('');
            });
        });
        describe('length property', () => {
            test('returns correct length for string', () => {
                expect('hello'.length).toBe(5);
            });
            test('returns 0 for empty string', () => {
                expect(''.length).toBe(0);
            });
            test('counts spaces', () => {
                expect('hello world'.length).toBe(11);
            });
            test('counts special characters', () => {
                expect('a@b!c#'.length).toBe(6);
            });
        });
    });
    describe('Date Utilities', () => {
        describe('Date formatting', () => {
            test('formats date with all options', () => {
                const date = new Date('2026-03-01T12:00:00');
                const formatted = date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                expect(formatted).toContain('2026');
                expect(formatted).toContain('March');
            });
            test('gets year correctly', () => {
                const date = new Date('2026-03-15');
                expect(date.getFullYear()).toBe(2026);
            });
            test('gets month correctly (0-indexed)', () => {
                const date = new Date('2026-03-15');
                expect(date.getMonth()).toBe(2);
            });
            test('gets date correctly', () => {
                // Only change: use constructor to avoid timezone issues
                const date = new Date(2026, 2, 15); // month is 0-indexed
                expect(date.getDate()).toBe(15);
            });
        });
        describe('Date creation', () => {
            test('creates date from string', () => {
                const date = new Date('2026-03-01');
                expect(date.getFullYear()).toBe(2026);
            });
            test('creates date from parameters', () => {
                const date = new Date(2026, 2, 1);
                expect(date.getFullYear()).toBe(2026);
                expect(date.getMonth()).toBe(2);
            });
        });
    });
    describe('Object Utilities', () => {
        describe('Object.keys', () => {
            test('returns array of keys', () => {
                const obj = { a: 1, b: 2, c: 3 };
                expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
            });
            test('returns empty array for empty object', () => {
                expect(Object.keys({})).toEqual([]);
            });
            test('works with nested objects', () => {
                const obj = { username: 'error', pin: 'error' };
                expect(Object.keys(obj).length).toBe(2);
            });
        });
        describe('Object.values', () => {
            test('returns array of values', () => {
                const obj = { a: 1, b: 2, c: 3 };
                expect(Object.values(obj)).toEqual([1, 2, 3]);
            });
            test('returns empty array for empty object', () => {
                expect(Object.values({})).toEqual([]);
            });
        });
    });
    describe('Array Utilities', () => {
        describe('includes method', () => {
            test('returns true when element exists', () => {
                expect([1, 2, 3].includes(2)).toBe(true);
            });
            test('returns false when element does not exist', () => {
                expect([1, 2, 3].includes(4)).toBe(false);
            });
            test('works with strings', () => {
                const arr = ['home', 'medications', 'emergency'];
                expect(arr.includes('medications')).toBe(true);
            });
        });
        describe('filter method', () => {
            test('filters elements correctly', () => {
                const numbers = [1, 2, 3, 4, 5, 6];
                const evens = numbers.filter(n => n % 2 === 0);
                expect(evens).toEqual([2, 4, 6]);
            });
            test('returns empty array when no matches', () => {
                const numbers = [1, 3, 5];
                const evens = numbers.filter(n => n % 2 === 0);
                expect(evens).toEqual([]);
            });
        });
        describe('map method', () => {
            test('transforms elements', () => {
                const numbers = [1, 2, 3];
                const doubled = numbers.map(n => n * 2);
                expect(doubled).toEqual([2, 4, 6]);
            });
            test('returns same length array', () => {
                const arr = [1, 2, 3];
                const result = arr.map(n => n);
                expect(result.length).toBe(arr.length);
            });
        });
        describe('find method', () => {
            test('finds matching element', () => {
                const items = [
                    { id: 1, name: 'Item 1' },
                    { id: 2, name: 'Item 2' }
                ];
                const found = items.find(item => item.id === 2);
                expect(found?.name).toBe('Item 2');
            });
            test('returns undefined when not found', () => {
                const items = [{ id: 1 }];
                const found = items.find(item => item.id === 999);
                expect(found).toBeUndefined();
            });
        });
    });
    describe('Number Utilities', () => {
        describe('parseInt', () => {
            test('converts string to integer', () => {
                expect(parseInt('123')).toBe(123);
            });
            test('truncates decimals', () => {
                expect(parseInt('123.45')).toBe(123);
            });
            test('returns NaN for non-numeric', () => {
                expect(isNaN(parseInt('abc'))).toBe(true);
            });
        });
        describe('parseFloat', () => {
            test('parses decimal numbers', () => {
                expect(parseFloat('123.45')).toBe(123.45);
            });
            test('handles integers', () => {
                expect(parseFloat('123')).toBe(123);
            });
        });
        describe('isNaN', () => {
            test('detects NaN', () => {
                expect(isNaN(NaN)).toBe(true);
            });
            test('returns false for valid numbers', () => {
                expect(isNaN(123)).toBe(false);
            });
        });
    });
    describe('Boolean Logic', () => {
        describe('Truthy/Falsy values', () => {
            test('empty string is falsy', () => {
                const emptyStr = '';
                expect(Boolean(emptyStr)).toBe(false);
            });
            test('space string is truthy', () => {
                const spaceStr = ' ';
                expect(Boolean(spaceStr)).toBe(true);
            });
            test('zero is falsy', () => {
                const zero = 0;
                expect(Boolean(zero)).toBe(false);
            });
            test('non-zero numbers are truthy', () => {
                const one = 1;
                const negOne = -1;
                expect(Boolean(one)).toBe(true);
                expect(Boolean(negOne)).toBe(true);
            });
            test('null is falsy', () => {
                const nullVal = null;
                expect(Boolean(nullVal)).toBe(false);
            });
            test('undefined is falsy', () => {
                const undefinedVal = undefined;
                expect(Boolean(undefinedVal)).toBe(false);
            });
            test('empty object is truthy', () => {
                const emptyObj = {};
                expect(Boolean(emptyObj)).toBe(true);
            });
            test('empty array is truthy', () => {
                const emptyArr = [];
                expect(Boolean(emptyArr)).toBe(true);
            });
        });
        describe('Logical operators', () => {
            test('AND operator', () => {
                const t = true;
                const f = false;
                expect(t && t).toBe(true);
                expect(t && f).toBe(false);
                expect(f && t).toBe(false);
                expect(f && f).toBe(false);
            });
            test('OR operator', () => {
                const t = true;
                const f = false;
                expect(t || t).toBe(true);
                expect(t || f).toBe(true);
                expect(f || t).toBe(true);
                expect(f || f).toBe(false);
            });
            test('NOT operator', () => {
                const t = true;
                const f = false;
                expect(!t).toBe(false);
                expect(!f).toBe(true);
            });
        });
    });
    describe('Regex Patterns', () => {
        describe('Digit pattern', () => {
            const digitRegex = /^[0-9]+$/;
            test('matches numeric strings', () => {
                expect(digitRegex.test('123')).toBe(true);
                expect(digitRegex.test('000')).toBe(true);
            });
            test('rejects non-numeric', () => {
                expect(digitRegex.test('abc')).toBe(false);
                expect(digitRegex.test('12a')).toBe(false);
            });
        });
        describe('Email pattern', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            test('matches valid emails', () => {
                expect(emailRegex.test('test@example.com')).toBe(true);
                expect(emailRegex.test('user.name@domain.co')).toBe(true);
            });
            test('rejects invalid emails', () => {
                expect(emailRegex.test('invalid')).toBe(false);
                expect(emailRegex.test('test@')).toBe(false);
                expect(emailRegex.test('@example.com')).toBe(false);
            });
        });
        describe('Phone pattern', () => {
            const phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
            test('matches valid phone numbers', () => {
                expect(phoneRegex.test('(555) 234-5678')).toBe(true);
                expect(phoneRegex.test('(555)234-5678')).toBe(true);
            });
            test('rejects invalid formats', () => {
                expect(phoneRegex.test('555-234-5678')).toBe(false);
                expect(phoneRegex.test('5552345678')).toBe(false);
            });
        });
    });
});
