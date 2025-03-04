import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import { RootState } from '../../redux/store';
import './Orders.scss';

// Types
interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const statusColors = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  ready: '#10B981',
  delivered: '#059669',
  cancelled: '#EF4444',
};

const Orders: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user && user.token) {
          setLoading(true);
          const data = await getMyOrders(user.token);
          // Sort orders by date (newest first)
          setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusLabel = (status: Order['status']) => {
    const statusMap = {
      pending: 'Pending',
      processing: 'Processing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status];
  };

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>View and track your order history</p>
        </div>

        {loading && (
          <div className="orders-loading">
            <div className="orders-loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {error && <div className="orders-error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
            <a href="/" className="orders-empty-button">Browse Menu</a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-header-left">
                    <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-header-right">
                    <span 
                      className="order-status" 
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="order-item-image">
                        <img 
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="order-item-details">
                        <h4 className="order-item-name">{item.name}</h4>
                        <div className="order-item-info">
                          <span className="order-item-quantity">Qty: {item.quantity}</span>
                          <span className="order-item-price">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-info">
                  <div className="order-info-item">
                    <span className="order-info-label">Delivery Address:</span>
                    <span className="order-info-value">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, 
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </div>
                  {order.isPaid && (
                    <div className="order-info-item">
                      <span className="order-info-label">Payment Date:</span>
                      <span className="order-info-value">{order.paidAt && formatDate(order.paidAt)}</span>
                    </div>
                  )}
                  {order.isDelivered && (
                    <div className="order-info-item">
                      <span className="order-info-label">Delivery Date:</span>
                      <span className="order-info-value">{order.deliveredAt && formatDate(order.deliveredAt)}</span>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="order-total-label">Total:</span>
                    <span className="order-total-value">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <a href={`/order/${order._id}`} className="order-details-button">View Details</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
