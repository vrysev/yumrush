import CartItem from "./CartItem/CartItem.jsx";
import styles from "./CartList.module.scss";
function CartList() {
  return (
    <div className={styles.section}>
      <div className={styles.list}>
        <h2 className={styles.title}>Your Cart</h2>
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <div className={styles.btnBlock}>
          <button className={styles.btnBack}>back</button>
          <button className={styles.btnCheckout}>checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CartList;
