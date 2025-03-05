import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../redux/store';
import { getAllOrders } from '../../api/orderApi';
import '../Admin.scss';

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  ready: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

interface UserStats {
  total: number;
  admins: number;
}

interface ProductStats {
  total: number;
  byCategory: {
    [key: string]: number;
  };
}

const AdminDashboard: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    admins: 0,
  });
  const [productStats, setProductStats] = useState<ProductStats>({
    total: 0,
    byCategory: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch orders
        console.log('Fetching orders for dashboard...');
        const orders = await getAllOrders(user.token);
        console.log('Orders fetched for dashboard:', orders);
        
        // Calculate order stats
        const orderStatsData: OrderStats = {
          total: orders.length,
          pending: orders.filter((o: any) => o.status === 'pending').length,
          processing: orders.filter((o: any) => o.status === 'processing').length,
          ready: orders.filter((o: any) => o.status === 'ready').length,
          delivered: orders.filter((o: any) => o.status === 'delivered').length,
          cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
          totalRevenue: orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0),
        };
        setOrderStats(orderStatsData);

        // Fetch users and product data
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
        
        try {
          const usersResponse = await fetch(`${apiUrl}/api/users`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('Users data fetched for dashboard:', usersData);
            setUserStats({
              total: usersData.length,
              admins: usersData.filter((u: any) => u.isAdmin).length,
            });
          }
        } catch (userErr) {
          console.error('Error fetching users for dashboard:', userErr);
        }
        
        try {
          const productsResponse = await fetch(`${apiUrl}/api/products`);
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products data fetched for dashboard:', productsData);
          const categoryCounts: { [key: string]: number } = {};
          
          productsData.forEach((p: any) => {
            const category = getCategoryName(p.category);
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          
          setProductStats({
            total: productsData.length,
            byCategory: categoryCounts,
          });
        }
        } catch (productErr) {
          console.error('Error fetching products for dashboard:', productErr);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const getCategoryName = (categoryId: number) => {
    const categoryKeys = {
      0: 'Pizza',
      1: 'Burger',
      2: 'Fries',
      3: 'Drink',
      4: 'Dessert',
    };
    const key = categoryKeys[categoryId as keyof typeof categoryKeys] || 'Unknown';
    return t(key);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-section-header">
        <h2>{t('Dashboard')}</h2>
        <p>{t('dashboardOverview')}</p>
      </div>

      <div className="admin-content-section">
        {loading ? (
          <div className="admin-dashboard__loading">{t('loading')} {t('Dashboard').toLowerCase()}...</div>
        ) : error ? (
          <div className="admin-dashboard__error">{error}</div>
        ) : (
          <div className="admin-dashboard-grid">
            {/* Orders Summary Card */}
            <div className="admin-dashboard-card">
              <div className="admin-dashboard-card__header">
                <h3>{t('ordersSummary')}</h3>
                <Link to="/admin/orders" className="admin-dashboard-card__link">
                  {t('viewAll')}
                </Link>
              </div>
              <div className="admin-dashboard-card__content">
                <div className="admin-dashboard-stats">
                  <div className="admin-dashboard-stat">
                    <span className="admin-dashboard-stat__value">{orderStats.total}</span>
                    <span className="admin-dashboard-stat__label">{t('totalOrders')}</span>
                  </div>
                  <div className="admin-dashboard-stat">
                    <span className="admin-dashboard-stat__value">${orderStats.totalRevenue.toFixed(2)}</span>
                    <span className="admin-dashboard-stat__label">{t('totalRevenue')}</span>
                  </div>
                </div>
                
                <div className="admin-dashboard-status-bars">
                  <div className="admin-dashboard-status-bar">
                    <div className="admin-dashboard-status-bar__label">
                      <span>{t('pending')}</span>
                      <span>{orderStats.pending}</span>
                    </div>
                    <div className="admin-dashboard-status-bar__track">
                      <div 
                        className="admin-dashboard-status-bar__fill admin-dashboard-status-bar__fill--pending"
                        style={{ width: `${orderStats.total ? (orderStats.pending / orderStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="admin-dashboard-status-bar">
                    <div className="admin-dashboard-status-bar__label">
                      <span>{t('processing')}</span>
                      <span>{orderStats.processing}</span>
                    </div>
                    <div className="admin-dashboard-status-bar__track">
                      <div 
                        className="admin-dashboard-status-bar__fill admin-dashboard-status-bar__fill--processing"
                        style={{ width: `${orderStats.total ? (orderStats.processing / orderStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="admin-dashboard-status-bar">
                    <div className="admin-dashboard-status-bar__label">
                      <span>{t('ready')}</span>
                      <span>{orderStats.ready}</span>
                    </div>
                    <div className="admin-dashboard-status-bar__track">
                      <div 
                        className="admin-dashboard-status-bar__fill admin-dashboard-status-bar__fill--ready"
                        style={{ width: `${orderStats.total ? (orderStats.ready / orderStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="admin-dashboard-status-bar">
                    <div className="admin-dashboard-status-bar__label">
                      <span>{t('delivered')}</span>
                      <span>{orderStats.delivered}</span>
                    </div>
                    <div className="admin-dashboard-status-bar__track">
                      <div 
                        className="admin-dashboard-status-bar__fill admin-dashboard-status-bar__fill--delivered"
                        style={{ width: `${orderStats.total ? (orderStats.delivered / orderStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="admin-dashboard-status-bar">
                    <div className="admin-dashboard-status-bar__label">
                      <span>{t('cancelled')}</span>
                      <span>{orderStats.cancelled}</span>
                    </div>
                    <div className="admin-dashboard-status-bar__track">
                      <div 
                        className="admin-dashboard-status-bar__fill admin-dashboard-status-bar__fill--cancelled"
                        style={{ width: `${orderStats.total ? (orderStats.cancelled / orderStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Users Summary Card */}
            <div className="admin-dashboard-card">
              <div className="admin-dashboard-card__header">
                <h3>Users Summary</h3>
                <Link to="/admin/users" className="admin-dashboard-card__link">
                  View All
                </Link>
              </div>
              <div className="admin-dashboard-card__content">
                <div className="admin-dashboard-stats">
                  <div className="admin-dashboard-stat">
                    <span className="admin-dashboard-stat__value">{userStats.total}</span>
                    <span className="admin-dashboard-stat__label">Total Users</span>
                  </div>
                  <div className="admin-dashboard-stat">
                    <span className="admin-dashboard-stat__value">{userStats.admins}</span>
                    <span className="admin-dashboard-stat__label">Admins</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Summary Card */}
            <div className="admin-dashboard-card">
              <div className="admin-dashboard-card__header">
                <h3>Products Summary</h3>
                <Link to="/admin/products" className="admin-dashboard-card__link">
                  View All
                </Link>
              </div>
              <div className="admin-dashboard-card__content">
                <div className="admin-dashboard-stats">
                  <div className="admin-dashboard-stat">
                    <span className="admin-dashboard-stat__value">{productStats.total}</span>
                    <span className="admin-dashboard-stat__label">Total Products</span>
                  </div>
                </div>
                
                <div className="admin-dashboard-category-list">
                  <h4>Products by Category</h4>
                  <ul>
                    {Object.entries(productStats.byCategory).map(([category, count]) => (
                      <li key={category} className="admin-dashboard-category-item">
                        <span>{category}</span>
                        <span>{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className="admin-dashboard-card admin-dashboard-card--actions">
              <div className="admin-dashboard-card__header">
                <h3>Quick Actions</h3>
              </div>
              <div className="admin-dashboard-card__content">
                <div className="admin-dashboard-quick-actions">
                  <Link to="/admin/products" className="admin-dashboard-quick-action">
                    <div className="admin-dashboard-quick-action__icon">+</div>
                    <span>Add New Product</span>
                  </Link>
                  <Link to="/admin/orders" className="admin-dashboard-quick-action">
                    <div className="admin-dashboard-quick-action__icon">⟳</div>
                    <span>Process Orders</span>
                  </Link>
                  <Link to="/admin/users" className="admin-dashboard-quick-action">
                    <div className="admin-dashboard-quick-action__icon">👤</div>
                    <span>Manage Users</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;