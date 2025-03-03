import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../redux/slices/cartSlice';
import { RootState, AppDispatch } from '../../redux/store';
import './CartButton.scss';

const CartButton: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  
  const handleToggleCart = () => {
    dispatch(toggleCart());
  };
  
  return (
    <button className="cart-button" onClick={handleToggleCart}>
      <span className="cart-button__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </span>
      Cart
      {totalQuantity > 0 && (
        <span className="cart-button__count">{totalQuantity}</span>
      )}
    </button>
  );
};

export default CartButton;