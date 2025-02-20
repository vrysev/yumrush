import './CartItem.scss';

const CartItem = () => {
  return (
    <div className="cart-item">
      <div className="cart-item__image">
        <img src="pizza.png" alt="Cart item" />
      </div>
      <div className="cart-item__content">
        <h3 className="cart-item__title">Pepperoni Pizza</h3>
        <p className="cart-item__description">30 mins</p>
        <div className="cart-item__price-block">
          <span className="cart-item__price">$24.99</span>
          <div className="cart-item__quantity">
            <button className="cart-item__quantity-btn cart-item__quantity-btn--minus">-</button>
            <span className="cart-item__quantity-count">1</span>
            <button className="cart-item__quantity-btn cart-item__quantity-btn--plus">+</button>
          </div>
          <button className="cart-item__remove">Remove</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
