# YumRush Backend API

Backend API for YumRush food ordering application built with Node.js, Express, TypeScript, and MongoDB Atlas.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file in the root directory:
   ```
   PORT=1972
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_atlas_uri
   BACKEND_URL=http://localhost:1972/images
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   CLIENT_URL=http://localhost:3000
   ```
4. Initialize the database:
   ```
   npm run init-db
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: User data with JWT token

- `POST /api/users/login` - Login user
  - Body: `{ email, password }`
  - Returns: User data with JWT token

- `GET /api/users/profile` - Get user profile (Protected)
  - Headers: Bearer token
  - Returns: User data

- `PUT /api/users/profile` - Update user profile (Protected)
  - Headers: Bearer token
  - Body: `{ name, email, password, address, city, postalCode, country }`
  - Returns: Updated user data with JWT token

### Products

- `GET /api/products` - Get all products
  - Query params:
    - `category`: Filter by category (number)
    - `search`: Search by title
    - `sortBy`: Sort by property ('price', 'rating', 'title')
  - Returns: Array of products

- `GET /api/products/:id` - Get product by ID
  - Returns: Product data

- `POST /api/products` - Create a product (Admin only)
  - Headers: Bearer token
  - Body: `{ productId, title, price, imageUrl, category, rating, preparationTime }`
  - Returns: Created product data

- `PUT /api/products/:id` - Update a product (Admin only)
  - Headers: Bearer token
  - Body: `{ title, price, imageUrl, category, rating, preparationTime }`
  - Returns: Updated product data

- `DELETE /api/products/:id` - Delete a product (Admin only)
  - Headers: Bearer token
  - Returns: Success message

### Orders

- `POST /api/orders` - Create a new order (Protected)
  - Headers: Bearer token
  - Body: `{ orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice }`
  - Returns: Created order data

- `GET /api/orders/myorders` - Get user's orders (Protected)
  - Headers: Bearer token
  - Returns: Array of user's orders

- `GET /api/orders/:id` - Get order by ID (Protected)
  - Headers: Bearer token
  - Returns: Order data

- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
  - Headers: Bearer token
  - Body: Payment result from Stripe
  - Returns: Updated order data

- `GET /api/orders` - Get all orders (Admin only)
  - Headers: Bearer token
  - Returns: Array of all orders

### Payment

- `POST /api/payment/create-payment-intent` - Create Stripe payment intent (Protected)
  - Headers: Bearer token
  - Body: `{ amount, orderId }`
  - Returns: Stripe client secret

- `POST /api/payment/webhook` - Handle Stripe webhook events
  - Body: Stripe webhook event data
  - Returns: Success status

## Default Admin User

After running `npm run init-db`, the following admin user is created:
- Email: admin@yumrush.com
- Password: admin123

## Image Handling

Images are stored in the `/src/public/images` directory and served at `/images` endpoint. The path to images in the database should be stored as full URLs, like:
`http://localhost:1972/images/pizzas/margherita.png`

## Database Structure

The application uses MongoDB with the following collections:

### Users
```typescript
{
  name: string;
  email: string (unique);
  password: string (hashed);
  isAdmin: boolean;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Products
```typescript
{
  productId: number (unique);
  imageUrl: string;
  title: string;
  price: number;
  category: number;
  rating: number;
  preparationTime: string;
}
```

### Orders
```typescript
{
  user: ObjectId (ref: 'User');
  orderItems: [
    {
      name: string;
      qty: number;
      image: string;
      price: number;
      product: ObjectId (ref: 'Product');
    }
  ];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication

The API uses JWT for authentication. Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Admin routes require the user to have `isAdmin: true` in addition to a valid token.

## Error Handling

The API implements consistent error handling with appropriate HTTP status codes:

- 400: Bad Request - Invalid input data
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Valid authentication but insufficient permissions
- 404: Not Found - Resource not found
- 500: Internal Server Error - Unexpected server errors

Error responses follow this format:
```json
{
  "message": "Error description message"
}
```

## Payment Integration

The application integrates with Stripe for payment processing:

1. When a user proceeds to checkout, the frontend calls the payment intent API
2. The backend creates a Stripe payment intent and returns the client secret
3. Frontend uses Stripe Elements to securely collect payment information
4. After successful payment, Stripe sends a webhook to confirm the transaction
5. The order status is updated to paid when payment is confirmed

## Testing & Development

To run tests:
```
npm test
```

To check for linting errors:
```
npm run lint
```

To run TypeScript type checking:
```
npm run typecheck
```
