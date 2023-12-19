import { useState } from "react";

function Product(props) {
  const { imageUrl, title, price, preparationTime } = props;
  const [countProducts, setCountProducts] = useState(0);

  const updateCountProducts = (event) => {
    event.stopPropagation();
    if (countProducts) setCountProducts(countProducts - 1);
  };

  return (
    <div className="product-item">
      <div className="product-item--img">
        <img src={imageUrl} alt="" />
      </div>
      <div className="product-item__block">
        <h2 className="product-item__title">{title}</h2>
        <p className="product-item__description">{preparationTime}</p>
        <div className="price__block">
          <p className="product-item__price">{price + "$"}</p>
          <button
            onClick={() => setCountProducts(countProducts + 1)}
            className="product-item__button"
          >
            Add to Cart
            <span
              onClick={updateCountProducts}
              className="product-item__counter"
            >
              {countProducts ? <span className="decrease">-</span> : ""}
              {countProducts}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
