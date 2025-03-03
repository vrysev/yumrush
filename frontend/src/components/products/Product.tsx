import { FC } from 'react';
import { ProductType } from '@/types/product';
import AddToCartButton from '../cart/AddToCartButton';

const Product: FC<ProductType> = (product) => {
  const { imageUrl, title, price, preparationTime } = product;

  return (
    <div className="product">
      <div className="product__image-wrapper">
        <img src={imageUrl} alt={title} className="product__image" />
      </div>
      <div className="product__content">
        <h2 className="product__title">{title}</h2>
        <p className="product__prep-time">{preparationTime}</p>
        <div className="product__footer">
          <p className="product__price">${price.toFixed(2)}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default Product;
