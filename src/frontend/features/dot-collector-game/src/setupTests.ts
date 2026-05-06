import '@testing-library/jest-dom';

// Polyfill for structuredClone in test environment
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}
