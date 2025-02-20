import { FC, useState, MouseEvent } from 'react';
import './Product.scss';

interface ProductProps {
  imageUrl: string;
  title: string;
  price: number;
  preparationTime: string;
}

const Product: FC<ProductProps> = ({ imageUrl, title, price, preparationTime }) => {
  const [countProducts, setCountProducts] = useState<number>(0);

  const updateCountProducts = (event: MouseEvent<HTMLSpanElement>): void => {
    event.stopPropagation();
    if (countProducts) setCountProducts(countProducts - 1);
  };

  return (
    <div className="product">
      <div className="product__image-wrapper">
        <img src={imageUrl} alt={title} className="product__image" />
      </div>
      <div className="product__content">
        <h2 className="product__title">{title}</h2>
        <p className="product__prep-time">{preparationTime}</p>
        <div className="product__footer">
          <p className="product__price">${price}</p>
          <button 
            onClick={() => setCountProducts(countProducts + 1)} 
            className="product__button"
            aria-label={`Add ${title} to cart`}
          >
            Add to Cart
            {countProducts > 0 && (
              <span 
                onClick={updateCountProducts} 
                className="product__counter"
                role="button"
                aria-label="Decrease quantity"
              >
                <span className="product__counter-decrease">-</span>
                <span className="product__counter-number">{countProducts}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
