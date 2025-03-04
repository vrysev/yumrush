import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../redux/slices/cartSlice';
import { RootState, AppDispatch } from '../../redux/store';
import * as Icons from '../../assets/icons/index.jsx';
import { IconsType } from '@/types/icons';
import './CartButton.scss';

const CartButton: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  
  const handleToggleCart = () => {
    dispatch(toggleCart());
  };
  
  return (
    <button className="cart-button" onClick={handleToggleCart} aria-label="Cart">
      <img src={(Icons as IconsType)['cart']} alt="Cart" className="cart-button__icon" />
      {totalQuantity > 0 && (
        <span className="cart-button__count">{totalQuantity}</span>
      )}
    </button>
  );
};

export default CartButton;