import axios from 'axios';
import { CartItem } from '../redux/slices/cartSlice';

// Create a checkout session with Stripe
export const createCheckoutSession = async (
  cartItems: CartItem[],
  token: string,
  userId?: string
): Promise<{ id: string; url: string }> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(
    '/api/payments/create-checkout-session',
    { cartItems, userId },
    config
  );

  return data;
};

// Get payment status for a session
export const getPaymentStatus = async (sessionId: string, token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get(`/api/payments/status/${sessionId}`, config);
  return data;
};