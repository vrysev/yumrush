import { FC, useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../../redux/slices/cartSlice';
import { ProductType } from '@/types/product';
import { RootState, AppDispatch } from '../../redux/store';

const Product: FC<ProductType> = (product) => {
  const { _id, imageUrl, title, price, preparationTime } = product;
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Find if product is already in cart and get its quantity
  const cartItem = cartItems.find(item => item._id === _id);
  const [quantity, setQuantity] = useState<number>(cartItem?.quantity || 0);
  
  // Update local state when cart changes
  useEffect(() => {
    const item = cartItems.find(item => item._id === _id);
    setQuantity(item?.quantity || 0);
  }, [cartItems, _id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleDecreaseQuantity = (event: MouseEvent<HTMLSpanElement>): void => {
    event.stopPropagation();
    
    if (quantity > 0) {
      dispatch(updateQuantity({ id: _id, quantity: quantity - 1 }));
    }
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
          <p className="product__price">${price.toFixed(2)}</p>
          <button 
            onClick={handleAddToCart} 
            className="product__button"
            aria-label={`Add ${title} to cart`}
          >
            {quantity === 0 ? 'Add to Cart' : 'Add Another'}
            {quantity > 0 && (
              <span 
                onClick={handleDecreaseQuantity} 
                className="product__counter"
                role="button"
                aria-label="Decrease quantity"
              >
                <span className="product__counter-decrease">-</span>
                <span className="product__counter-number">{quantity}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
