import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { getPaymentStatus } from '../api/paymentApi';
import { clearCart } from '../redux/slices/cartSlice';
import './CheckoutSuccess.scss';

const CheckoutSuccess: FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  useEffect(() => {
    if (!sessionId || !user) {
      navigate('/');
      return;
    }
    
    const verifyPayment = async () => {
      try {
        setLoading(true);
        const result = await getPaymentStatus(sessionId, user.token);
        
        if (result.success) {
          setPaymentSuccess(true);
          // Clear the cart after successful payment
          dispatch(clearCart());
        } else {
          setError('Payment was not completed. Please try again.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('There was an error verifying your payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [sessionId, user, dispatch, navigate]);
  
  return (
    <div className="checkout-success">
      <div className="checkout-success__container">
        {loading ? (
          <div className="checkout-success__loading">
            <div className="checkout-success__spinner"></div>
            <p>Verifying your payment...</p>
          </div>
        ) : error ? (
          <div className="checkout-success__error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h2>Payment Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/cart')}>Return to Cart</button>
          </div>
        ) : (
          <div className="checkout-success__content">
            <svg className="checkout-success__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order. Your payment has been successfully processed.</p>
            <div className="checkout-success__buttons">
              <button className="checkout-success__button" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
              <button 
                className="checkout-success__button checkout-success__button--outline" 
                onClick={() => navigate('/account/orders')}
              >
                View My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;