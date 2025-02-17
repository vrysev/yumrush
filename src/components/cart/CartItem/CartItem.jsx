import styles from "./CartItem.module.scss";
function CartItem() {
  return (
    <div className={styles.item}>
      <div className={styles.itemImage}>
        <img
          src="https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/d48003cd-902c-420d-9f28-92d9dc5f73b4.jpg"
          alt="product"
        />
      </div>
      <div className={styles.itemBlock}>
        <div className={styles.title}>Margherita</div>
        <div className={styles.description}>14-20 minutes</div>
      </div>
      <div className={styles.count}>3</div>
      <div className={styles.price}>250$</div>
      <button className={styles.delete}>X</button>
    </div>
  );
}

export default CartItem;
