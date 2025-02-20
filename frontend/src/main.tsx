import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home.tsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import NotFound from './pages/NotFound.js';
import Cart from './pages/Cart.js';

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
        path: 'cart',
        element: <Cart />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
