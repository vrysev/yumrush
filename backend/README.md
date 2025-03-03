# YumRush Backend API

Backend API for YumRush food ordering application built with Node.js, Express, TypeScript, and MongoDB Atlas.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file in the root directory (copy from `.env.example`):
   ```
   PORT=1972
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_atlas_uri
   BACKEND_URL=http://localhost:1972/images
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
  - Body: `{ name, email, password }`
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

## Authentication

The API uses JWT for authentication. Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Admin routes require the user to have `isAdmin: true` in addition to a valid token.
