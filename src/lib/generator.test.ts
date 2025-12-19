import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PasswordGenerator } from './generator';

describe('PasswordGenerator', () => {
    describe('generateChar', () => {
        it('should return empty string for empty charset', () => {
            const generator = new PasswordGenerator('');
            expect(generator.generateChar()).toBe('');
        });

        it('should return a character from the charset', () => {
            const charset = 'abcdefghij';
            const generator = new PasswordGenerator(charset);

            for (let i = 0; i < 100; i++) {
                const char = generator.generateChar();
                expect(charset).toContain(char);
            }
        });

        it('should return the only character for single-char charset', () => {
            const generator = new PasswordGenerator('x');
            expect(generator.generateChar()).toBe('x');
        });

        it('should use crypto.getRandomValues', () => {
            const spy = vi.spyOn(crypto, 'getRandomValues');
            const generator = new PasswordGenerator('ab');
            generator.generateChar();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('generate', () => {
        it('should throw TypeError for length <= 0', () => {
            const generator = new PasswordGenerator('abc');
            expect(() => generator.generate(0)).toThrow(TypeError);
            expect(() => generator.generate(0)).toThrow('length must be positive');
            expect(() => generator.generate(-1)).toThrow(TypeError);
            expect(() => generator.generate(-5)).toThrow(TypeError);
        });

        it('should generate password of correct length', () => {
            const generator = new PasswordGenerator('abcdefghij');

            expect(generator.generate(1).length).toBe(1);
            expect(generator.generate(5).length).toBe(5);
            expect(generator.generate(10).length).toBe(10);
            expect(generator.generate(32).length).toBe(32);
        });

        it('should only contain characters from charset', () => {
            const charset = 'abc123';
            const generator = new PasswordGenerator(charset);
            const password = generator.generate(100);

            for (const char of password) {
                expect(charset).toContain(char);
            }
        });
    });
});
