import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCart, removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { createCheckoutSession } from '../../api/paymentApi';
import './CartSidebar.scss';

const CartSidebar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isOpen, totalQuantity, totalAmount } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleCloseCart = () => {
    dispatch(closeCart());
  };
  
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to checkout');
      return;
    }
    
    try {
      setIsCheckingOut(true);
      
      console.log('Creating checkout session with user:', user);
      const result = await createCheckoutSession(
        items,
        user.token,
        user._id // Pass the user ID to be stored in the session metadata
      );
      
      // Redirect to Stripe checkout
      window.location.href = result.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your payment. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return (
    <>
      <div 
        className={`cart-sidebar__overlay ${isOpen ? 'cart-sidebar__overlay--open' : ''}`}
        onClick={handleCloseCart}
      />
      <div className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`}>
        <div className="cart-sidebar__header">
          <h2>
            Your Cart
            {totalQuantity > 0 && (
              <span className="cart-sidebar__header-count">{totalQuantity}</span>
            )}
          </h2>
          <button 
            className="cart-sidebar__close" 
            onClick={handleCloseCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        
        <div className="cart-sidebar__content">
          {items.length === 0 ? (
            <div className="cart-sidebar__empty">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Your cart is empty</p>
              <button onClick={handleCloseCart}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-sidebar__items">
              {items.map((item) => (
                <div key={item._id} className="cart-sidebar__item">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="cart-sidebar__item-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/images/default-image.png';
                    }}
                  />
                  <div className="cart-sidebar__item-details">
                    <div>
                      <h3 className="cart-sidebar__item-title">{item.title}</h3>
                      <p className="cart-sidebar__item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="cart-sidebar__item-actions">
                      <div className="cart-sidebar__item-quantity">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="cart-sidebar__item-remove"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__footer-subtotal">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="cart-sidebar__footer-total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="cart-sidebar__footer-buttons">
              <button 
                className="cart-sidebar__footer-checkout"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button 
                className="cart-sidebar__footer-continue"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
            {!user && (
              <p className="cart-sidebar__footer-login-notice">
                Please log in to checkout
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;