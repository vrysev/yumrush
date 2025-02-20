import CartItem from './CartItem/CartItem.js';
import './CartList.scss';
const CartList = () => {
  return (
    <div className="cart">
      <div className="cart__list">
        <h2 className="cart__title">Your Cart</h2>
        <CartItem />
        <CartItem />
        <CartItem />
        <div className="cart__buttons">
          <button className="cart__btn cart__btn--back">back</button>
          <button className="cart__btn cart__btn--checkout">checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartList;
