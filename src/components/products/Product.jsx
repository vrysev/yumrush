import { useState } from "react";
import styles from "./Products.module.scss";
function Product(props) {
  const { imageUrl, title, price, preparationTime } = props;
  const [countProducts, setCountProducts] = useState(0);

  const updateCountProducts = (event) => {
    event.stopPropagation();
    if (countProducts) setCountProducts(countProducts - 1);
  };

  return (
    <div className={styles.item}>
      <div className={styles.itemImage}>
        <img src={imageUrl} alt="" />
      </div>
      <div className={styles.itemBlock}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{preparationTime}</p>
        <div className={styles.priceBlock}>
          <p className={styles.price}>{price + "$"}</p>
          <button
            onClick={() => setCountProducts(countProducts + 1)}
            className={styles.btn}
          >
            Add to Cart
            <span onClick={updateCountProducts} className={styles.counter}>
              {countProducts ? <span className={styles.decrease}>-</span> : ""}
              {countProducts}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
