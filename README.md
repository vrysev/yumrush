# YumRush Food Ordering Application

Full-stack food ordering application with React frontend and Node.js backend.

## Deployment Guide

This application is set up to deploy automatically using:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB on Render

### Prerequisites

Before deployment, you'll need:
1. A Vercel account (https://vercel.com)
2. A Render account (https://render.com)
3. A Stripe account for payments (https://stripe.com)
4. GitHub account connected to both services

### Deploying the Frontend to Vercel

1. Fork this repository to your GitHub account
2. Go to Vercel and click "Add New Project"
3. Import your forked repository
4. Configure project settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Add Environment Variables:
   - `VITE_API_URL`: URL of your backend (e.g., https://yumrush-backend.onrender.com)
6. Click "Deploy"

### Deploying the Backend to Render

1. Go to Render and click "New Web Service"
2. Connect your GitHub repository
3. Configure service:
   - Name: yumrush-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
4. Add Environment Variables:
   - `NODE_ENV`: production
   - `PORT`: 10000 (Render will set this automatically)
   - `JWT_SECRET`: [your secret key]
   - `MONGODB_URI`: [MongoDB connection string]
   - `STRIPE_SECRET_KEY`: [from your Stripe account]
   - `STRIPE_PUBLIC_KEY`: [from your Stripe account]
   - `STRIPE_WEBHOOK_SECRET`: [from your Stripe webhook settings]
   - `CLIENT_URL`: [your Vercel frontend URL]
   - `BACKEND_URL`: [your Render backend URL]/images

5. Click "Create Web Service"

### Database Setup on Render

1. In Render, go to "New" → "Database"
2. Select "MongoDB"
3. Configure database settings:
   - Name: yumrush-db
   - Region: (choose nearest to your users)
4. Copy the Connection String
5. Add this as `MONGODB_URI` environment variable in your backend service

### Initialize the Database

After deploying the backend:
1. Go to your backend service in Render
2. Click on "Shell"
3. Run: `npm run init-db`

### Setting Up GitHub Actions CI/CD

This repository already includes GitHub Actions workflows for CI/CD. You just need to add the necessary secrets:

1. In your GitHub repository, go to Settings → Secrets → Actions
2. Add the following secrets:
   - `VERCEL_TOKEN`: [Your Vercel API token]
   - `VERCEL_PROJECT_ID`: [Your Vercel project ID]
   - `VERCEL_ORG_ID`: [Your Vercel organization ID]
   - `RENDER_DEPLOY_HOOK`: [Your Render deploy hook URL]
   - `BACKEND_URL`: [Your Render backend URL]
   - `FRONTEND_URL`: [Your Vercel frontend URL]

### Monitoring and Logs

- Backend monitoring is available at `/api/health` and `/api/health/details` endpoints
- Logs are stored on Render and can be viewed in the dashboard
- The MongoDB database can be monitored from the Render dashboard

## Local Development

See the README files in the `frontend` and `backend` directories for local development instructions.

## License

[MIT](LICENSE)