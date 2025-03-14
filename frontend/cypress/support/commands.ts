/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  
  // Open login modal
  cy.findByRole('button', { name: /sign in/i }).click();
  
  // Fill in credentials
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  
  // Submit form
  cy.findByRole('button', { name: /login/i }).click();
  
  // Wait for login to complete
  cy.findByText(/my account/i, { timeout: 10000 }).should('exist');
});

// Custom command to add product to cart
Cypress.Commands.add('addToCart', (productName) => {
  cy.visit('/');
  
  // Find the product by name and add to cart
  cy.contains(productName)
    .parents('[data-testid^="product-"]')
    .within(() => {
      cy.findByRole('button', { name: /add to cart/i }).click();
    });
    
  // Verify product is added to cart
  cy.findByTestId('cart-count').should('not.have.text', '0');
});

// Custom command to clear cart
Cypress.Commands.add('clearCart', () => {
  cy.visit('/');
  
  // Open cart
  cy.findByTestId('cart-button').click();
  
  // Check if there are items
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="cart-item"]').length > 0) {
      // Clear all items
      cy.get('[data-testid="clear-cart-button"]').click();
    }
  });
  
  // Close cart
  cy.findByTestId('close-cart-button').click();
});

// Define types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      addToCart(productName: string): Chainable<void>
      clearCart(): Chainable<void>
    }
  }
}