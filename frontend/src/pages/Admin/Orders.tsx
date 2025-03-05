import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../redux/store';
import { getAllOrders, updateOrderStatus, markOrderAsDelivered } from '../../api/orderApi';
import '../Admin.scss';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

const AdminOrders: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'ready' | 'delivered' | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllOrders(user.token);
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, status, user.token);
      // Update the orders list with the new status
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await markOrderAsDelivered(orderId, user.token);
      // Update the orders list
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString(), status: 'delivered' }
            : order
        )
      );
    } catch (err) {
      console.error('Error marking order as delivered:', err);
      alert('Failed to mark order as delivered');
    }
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((order) => order.status === activeTab);

  return (
    <div className="admin-orders">
      <div className="admin-section-header">
        <h2>{t('ordersManagement')}</h2>
        <p>{t('viewAndManageOrders')}</p>
      </div>

      <div className="admin-dashboard__tabs">
        <button
          className={`admin-dashboard__tab ${activeTab === 'all' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('allOrders')}
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === 'pending' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          {t('pending')}
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === 'processing' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          {t('processing')}
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === 'ready' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('ready')}
        >
          {t('ready')}
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === 'delivered' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          {t('delivered')}
        </button>
      </div>

      <div className="admin-content-section">
        {loading ? (
          <div className="admin-dashboard__loading">{t('loading')} {t('Orders').toLowerCase()}...</div>
        ) : error ? (
          <div className="admin-dashboard__error">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-dashboard__empty">{t('noOrdersFound')}</div>
        ) : (
          <div className="admin-dashboard__orders">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>{t('orderId')}</th>
                  <th>{t('date')}</th>
                  <th>{t('customer')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className={`admin-dashboard__order admin-dashboard__order--${order.status}`}>
                    <td>{order._id.substring(order._id.length - 8)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`admin-dashboard__status admin-dashboard__status--${order.status}`}>
                        {t(order.status)}
                      </span>
                    </td>
                    <td className="admin-dashboard__actions">
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {t('view')}
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => 
                          handleStatusChange(
                            order._id, 
                            e.target.value as 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled'
                          )
                        }
                        className="admin-dashboard__status-select"
                      >
                        <option value="pending">{t('pending')}</option>
                        <option value="processing">{t('processing')}</option>
                        <option value="ready">{t('ready')}</option>
                        <option value="delivered">{t('delivered')}</option>
                        <option value="cancelled">{t('cancelled')}</option>
                      </select>
                      {order.status === 'ready' && !order.isDelivered && (
                        <button
                          className="admin-dashboard__action-btn admin-dashboard__action-btn--deliver"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          {t('markDelivered')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <div className="admin-dashboard__modal-header">
              <h2>{t('orderDetails')}</h2>
              <button
                className="admin-dashboard__modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              <div className="admin-dashboard__order-info">
                <div className="admin-dashboard__order-section">
                  <h3>{t('customerInformation')}</h3>
                  <p><strong>{t('name')}:</strong> {selectedOrder.user?.name || 'Guest'}</p>
                  <p><strong>{t('email')}:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                </div>
                
                <div className="admin-dashboard__order-section">
                  <h3>{t('orderInformation')}</h3>
                  <p><strong>{t('orderId')}:</strong> {selectedOrder._id}</p>
                  <p><strong>{t('date')}:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>{t('status')}:</strong> {t(selectedOrder.status)}</p>
                  <p><strong>{t('total')}:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
                  <p><strong>{t('paid')}:</strong> {selectedOrder.isPaid ? t('yes') : t('no')}</p>
                  {selectedOrder.isPaid && (
                    <p><strong>{t('paidAt')}:</strong> {new Date(selectedOrder.paidAt).toLocaleString()}</p>
                  )}
                  <p><strong>{t('delivered')}:</strong> {selectedOrder.isDelivered ? t('yes') : t('no')}</p>
                  {selectedOrder.isDelivered && (
                    <p><strong>{t('deliveredAt')}:</strong> {new Date(selectedOrder.deliveredAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
              
              <div className="admin-dashboard__order-items">
                <h3>{t('orderItems')}</h3>
                <table className="admin-dashboard__items-table">
                  <thead>
                    <tr>
                      <th>{t('product')}</th>
                      <th>{t('quantity')}</th>
                      <th>{t('price')}</th>
                      <th>{t('total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="admin-dashboard__modal-actions">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => 
                    handleStatusChange(
                      selectedOrder._id, 
                      e.target.value as 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled'
                    )
                  }
                  className="admin-dashboard__status-select"
                >
                  <option value="pending">{t('pending')}</option>
                  <option value="processing">{t('processing')}</option>
                  <option value="ready">{t('ready')}</option>
                  <option value="delivered">{t('delivered')}</option>
                  <option value="cancelled">{t('cancelled')}</option>
                </select>
                
                {selectedOrder.status === 'ready' && !selectedOrder.isDelivered && (
                  <button
                    className="admin-dashboard__action-btn admin-dashboard__action-btn--deliver"
                    onClick={() => {
                      handleMarkDelivered(selectedOrder._id);
                      setSelectedOrder(null);
                    }}
                  >
                    {t('markDelivered')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;