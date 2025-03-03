import axios from 'axios';

// Get all orders (admin only)
export const getAllOrders = async (token: string): Promise<any[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get('/api/orders', config);
  return data;
};

// Get orders for the current user
export const getMyOrders = async (token: string): Promise<any[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get('/api/orders/myorders', config);
  return data;
};

// Get a specific order by ID
export const getOrderById = async (orderId: string, token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get(`/api/orders/${orderId}`, config);
  return data;
};

// Update order status (admin only)
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled',
  token: string
): Promise<any> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.put(
    `/api/orders/${orderId}/status`,
    { status },
    config
  );
  return data;
};

// Mark order as delivered (admin only)
export const markOrderAsDelivered = async (orderId: string, token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
  return data;
};