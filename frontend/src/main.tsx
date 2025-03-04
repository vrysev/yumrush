import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
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
