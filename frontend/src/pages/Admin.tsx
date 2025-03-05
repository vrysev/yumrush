import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../redux/store';
import './Admin.scss';

const Admin: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>{t('adminDashboard')}</h1>
        <p>{t('manageYourStore')}</p>
      </div>

      <div className="admin-dashboard__navigation">
        <Link to="/admin/dashboard" className="admin-dashboard__nav-item">
          {t('Dashboard')}
        </Link>
        <Link to="/admin/orders" className="admin-dashboard__nav-item">
          {t('Orders')}
        </Link>
        <Link to="/admin/products" className="admin-dashboard__nav-item">
          {t('Products')}
        </Link>
        <Link to="/admin/users" className="admin-dashboard__nav-item">
          {t('Users')}
        </Link>
      </div>

      <div className="admin-dashboard__content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;