import { FC, useState } from 'react';
import { ProductType } from '@/types/product';
import AddToCartButton from '../cart/AddToCartButton';
import { formatImageUrl, getDefaultImage } from '../../utils/imageUtils';

const Product: FC<ProductType> = (product) => {
  const { imageUrl, title, price, preparationTime } = product;
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  const displayImage = imgError ? getDefaultImage() : formatImageUrl(imageUrl);

  return (
    <div className="product">
      <div className="product__image-wrapper">
        <img 
          src={displayImage} 
          alt={title} 
          className="product__image"
          onError={handleImageError}
        />
      </div>
      <div className="product__content">
        <h2 className="product__title">{title}</h2>
        <p className="product__prep-time">{preparationTime}</p>
        <div className="product__footer">
          <p className="product__price">${price.toFixed(2)}</p>
          <AddToCartButton product={{...product, imageUrl: displayImage}} />
        </div>
      </div>
    </div>
  );
};

export default Product;
