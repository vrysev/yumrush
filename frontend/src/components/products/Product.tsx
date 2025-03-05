import { FC, useState } from 'react';
import { ProductType } from '@/types/product';
import AddToCartButton from '../cart/AddToCartButton';
import { formatImageUrl, getDefaultImage } from '../../utils/imageUtils';
import { useTranslation } from 'react-i18next';
import { translateBackendData, translateDescription } from '../../utils/translationUtils';

const Product: FC<ProductType> = (product) => {
  const { imageUrl, title, price, preparationTime, description } = product;
  const [imgError, setImgError] = useState(false);
  
  const { t } = useTranslation();

  const handleImageError = () => {
    setImgError(true);
  };

  const displayImage = imgError ? getDefaultImage() : formatImageUrl(imageUrl);

  return (
    <div className="product">
      <div className="product__content">
      <div className="product__image-wrapper">
            <img 
            src={displayImage} 
            alt={title} 
            className="product__image"
            onError={handleImageError}
            />
         </div>
        <h2 className="product__title">{translateBackendData(title)}</h2>
        <p className="product__description">{translateDescription(description)}</p>
        <p className="product__prep-time">{t('preparationTime')}: {preparationTime} {t('minutes')}</p>
        <div className="product__footer">
          <p className="product__price">${price.toFixed(2)}</p>
          <AddToCartButton product={{...product, imageUrl: displayImage}} />
        </div>
      </div>
    </div>
  );
};

export default Product;
