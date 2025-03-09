// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.error('Uncaught exception:', err.message);
  return false;
});

// Custom route to avoid auth check on certain routes during testing
Cypress.on('window:before:load', (win) => {
  // Mock localStorage to preserve state between tests if needed
  let items = {};
  
  // Override localStorage methods
  Object.defineProperty(win, 'localStorage', {
    value: {
      getItem: (key) => items[key],
      setItem: (key, value) => items[key] = value,
      removeItem: (key) => delete items[key],
      clear: () => items = {},
    },
    configurable: true,
  });
});

// Ensure tests clean up after themselves
afterEach(() => {
  // Clear local storage
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});