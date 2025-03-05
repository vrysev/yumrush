import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:1972';
import Home from '@pages/Home';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';
import AdminProducts from './pages/Admin/Products';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Orders from './pages/Account/Orders';
import ProfileSettings from './pages/Account/ProfileSettings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'admin',
        element: <Admin />,
        children: [
          {
            path: '',
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'orders',
            element: <AdminOrders />,
          },
          {
            path: 'users',
            element: <AdminUsers />,
          },
          {
            path: 'products',
            element: <AdminProducts />,
          },
        ],
      },
      {
        path: 'checkout/success',
        element: <CheckoutSuccess />,
      },
      {
        path: 'account/orders',
        element: <Orders />,
      },
      {
        path: 'account/profile',
        element: <ProfileSettings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
