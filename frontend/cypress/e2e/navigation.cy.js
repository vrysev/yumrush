describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to home page and show hero section and products', () => {
    // Verify hero section is visible
    cy.get('[data-testid="hero-section"]').should('be.visible');
    
    // Verify product section is loaded
    cy.get('[data-testid^="product-"]').should('have.length.greaterThan', 0);
  });

  it('should navigate between categories', () => {
    // Find and click on a category (e.g., Pizza)
    cy.contains('Pizza').click();
    
    // Verify URL includes the category parameter
    cy.url().should('include', 'category=1');
    
    // Verify only pizza products are shown
    cy.get('[data-testid^="product-"]').each(($product) => {
      cy.wrap($product).contains('Pizza').should('exist');
    });
    
    // Navigate to another category (e.g., Burgers)
    cy.contains('Burgers').click();
    
    // Verify URL includes the new category parameter
    cy.url().should('include', 'category=2');
    
    // Verify only burger products are shown
    cy.get('[data-testid^="product-"]').each(($product) => {
      cy.wrap($product).contains('Burger').should('exist');
    });
  });

  it('should search for products', () => {
    // Click on search icon to open search input
    cy.findByTestId('search-icon').click();
    
    // Type search query
    cy.findByPlaceholderText(/search/i).type('Pizza{enter}');
    
    // Verify URL includes search parameter
    cy.url().should('include', 'search=Pizza');
    
    // Verify only products with "Pizza" in the title are shown
    cy.get('[data-testid^="product-"]').each(($product) => {
      cy.wrap($product).contains(/pizza/i).should('exist');
    });
    
    // Clear search
    cy.findByTestId('clear-search-button').click();
    
    // Verify all products are shown again
    cy.get('[data-testid^="product-"]').should('have.length.greaterThan', 2);
  });

  it('should toggle between languages', () => {
    // Find and click language switch button
    cy.findByTestId('language-switch').click();
    
    // Select another language (e.g., Czech)
    cy.contains('Čeština').click();
    
    // Verify text is translated
    cy.contains('Kategorie').should('exist');
    cy.contains('Přidat do košíku').should('exist');
    
    // Switch back to English
    cy.findByTestId('language-switch').click();
    cy.contains('English').click();
    
    // Verify text is in English
    cy.contains('Categories').should('exist');
    cy.contains('Add to Cart').should('exist');
  });
});