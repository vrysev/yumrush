import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../../redux/slices/cartSlice';
import { ProductType } from '@/types/product';
import { RootState, AppDispatch } from '../../redux/store';
import './AddToCartButton.scss';
import { useTranslation } from 'react-i18next';

interface AddToCartButtonProps {
  product: ProductType;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { t } = useTranslation();
  
  // Find if product is already in cart and get its quantity
  const cartItem = cartItems.find(item => item._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleIncreaseQuantity = () => {
    dispatch(addToCart(product));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id: product._id, quantity: quantity - 1 }));
    }
  };

  // Cart icon SVG
  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );

  return (
    <div className="add-to-cart">
      {quantity === 0 ? (
        // Basic button when no items in cart
        <button 
          className="add-to-cart__button"
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <CartIcon />
          {t('add')}
        </button>
      ) : (
        // Quantity controls when items are already in cart
        <div className="add-to-cart__controls">
          <button 
            className="add-to-cart__decrease"
            onClick={handleDecreaseQuantity}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="add-to-cart__quantity">{quantity}</span>
          <button 
            className="add-to-cart__increase"
            onClick={handleIncreaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;