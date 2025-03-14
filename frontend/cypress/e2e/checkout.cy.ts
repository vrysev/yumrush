describe('Checkout Process', () => {
  beforeEach(() => {
    // Clear cart before each test
    cy.clearCart();
  });

  it('should allow a user to complete the checkout process', () => {
    // Step 1: Login
    cy.login('testuser@example.com', 'password123');
    
    // Step 2: Add a product to the cart
    cy.addToCart('Margherita Pizza');
    
    // Step 3: Open cart and proceed to checkout
    cy.findByTestId('cart-button').click();
    cy.findByRole('button', { name: /checkout/i }).click();
    
    // Step 4: Fill in shipping information if not already filled
    cy.url().should('include', '/checkout');
    cy.get('body').then(($body) => {
      if ($body.find('[name="address"]').val() === '') {
        cy.findByLabelText(/address/i).type('123 Test Street');
        cy.findByLabelText(/city/i).type('Test City');
        cy.findByLabelText(/postal code/i).type('12345');
        cy.findByLabelText(/country/i).type('United States');
        cy.findByRole('button', { name: /continue/i }).click();
      }
    });
    
    // Step 5: Select payment method
    cy.findByLabelText(/credit card/i).check();
    cy.findByRole('button', { name: /continue/i }).click();
    
    // Step 6: Review order and place order
    cy.contains('Order Summary').should('exist');
    cy.contains('Margherita Pizza').should('exist');
    cy.findByRole('button', { name: /place order/i }).click();
    
    // Step 7: Verify order confirmation
    cy.url().should('include', '/success');
    cy.contains('Your order has been placed!').should('exist');
    cy.contains('Thank you for your purchase').should('exist');
    
    // Step 8: Check order history to confirm
    cy.findByText(/my account/i).click();
    cy.findByText(/orders/i).click();
    cy.contains('Margherita Pizza').should('exist');
    cy.contains('Order #').should('exist');
  });

  it('should show validation errors for missing shipping information', () => {
    // Step 1: Login
    cy.login('testuser@example.com', 'password123');
    
    // Step 2: Add a product to the cart
    cy.addToCart('Classic Burger');
    
    // Step 3: Open cart and proceed to checkout
    cy.findByTestId('cart-button').click();
    cy.findByRole('button', { name: /checkout/i }).click();
    
    // Step 4: Try to continue without entering shipping info
    cy.url().should('include', '/checkout');
    
    // Clear any pre-filled values
    cy.findByLabelText(/address/i).clear();
    cy.findByLabelText(/city/i).clear();
    
    cy.findByRole('button', { name: /continue/i }).click();
    
    // Step 5: Verify validation errors appear
    cy.contains('Address is required').should('exist');
    cy.contains('City is required').should('exist');
  });

  it('should update the cart total when adding or removing items', () => {
    // Step 1: Login
    cy.login('testuser@example.com', 'password123');
    
    // Step 2: Add a product to the cart
    cy.addToCart('Margherita Pizza');
    
    // Step 3: Open cart and note the total
    cy.findByTestId('cart-button').click();
    cy.get('[data-testid="cart-total"]').then(($total) => {
      const initialTotal = parseFloat($total.text().replace('$', ''));
      
      // Step 4: Increase item quantity
      cy.findByTestId('increase-quantity-button').click();
      
      // Step 5: Verify total is updated (doubled)
      cy.get('[data-testid="cart-total"]').should(($newTotal) => {
        const updatedTotal = parseFloat($newTotal.text().replace('$', ''));
        expect(updatedTotal).to.be.closeTo(initialTotal * 2, 0.01);
      });
      
      // Step 6: Decrease item quantity back to 1
      cy.findByTestId('decrease-quantity-button').click();
      
      // Step 7: Verify total reverts to initial value
      cy.get('[data-testid="cart-total"]').should(($newTotal) => {
        const updatedTotal = parseFloat($newTotal.text().replace('$', ''));
        expect(updatedTotal).to.be.closeTo(initialTotal, 0.01);
      });
    });
  });
});