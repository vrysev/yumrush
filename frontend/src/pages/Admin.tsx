import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';
import './Admin.scss';

const Admin: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store</p>
      </div>

      <div className="admin-dashboard__navigation">
        <Link to="/admin/dashboard" className="admin-dashboard__nav-item">
          Dashboard
        </Link>
        <Link to="/admin/orders" className="admin-dashboard__nav-item">
          Orders
        </Link>
        <Link to="/admin/products" className="admin-dashboard__nav-item">
          Products
        </Link>
        <Link to="/admin/users" className="admin-dashboard__nav-item">
          Users
        </Link>
      </div>

      <div className="admin-dashboard__content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;