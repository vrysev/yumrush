# CI/CD Setup for YumRush

This document contains instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for the YumRush project.

## CI/CD Pipeline Overview

The YumRush project uses a single CI/CD pipeline that performs sequential testing and deployment:

1. **Backend Tests**: Validates the backend code
2. **Frontend Tests**: Validates the frontend code
3. **End-to-End Tests**: (Prepared for future implementation)
4. **Deployment**: Deploys code to production environments

The pipeline is configured in `.github/workflows/main.yml` and follows this flow:

```
                                 [Only on push to main]
                                          ↓
[Code Push/PR] → [Backend Tests] → [Frontend Tests] → [E2E Tests*] → [Deploy to Production]
                                                        (*future)
```

## How the Pipeline Works

1. When code is pushed to any branch or a pull request is created:
   - First, backend tests run
   - If backend tests pass, frontend tests run
   - (In the future: if frontend tests pass, E2E tests will run)

2. When code is pushed to the main branch and all tests pass:
   - The deploy job runs after all tests have passed
   - Backend is deployed to Render
   - Frontend is deployed to Vercel

## Setting Up GitHub Actions

### 1. Setting up Secrets in GitHub

You need to configure the following secrets in your repository:

1. Navigate to your repository settings: `Settings > Secrets and variables > Actions`
2. Add the following secrets:

   - `RENDER_DEPLOY_HOOK`: The webhook URL for Render deployment
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 2. Getting the Render Deploy Hook

1. Sign in to your Render account
2. Select your backend service
3. Navigate to `Settings > Deploy Hooks`
4. Click `Create Deploy Hook`
5. Name it "GitHub Actions" and select the `main` branch
6. Copy the generated URL and save it as the `RENDER_DEPLOY_HOOK` secret in GitHub

### 3. Obtaining Vercel Tokens and IDs

For frontend deployment through GitHub Actions, you need to get the following credentials:

1. **VERCEL_TOKEN**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Navigate to Settings → Tokens
   - Click "Create" to generate a new token
   - Give it a name like "GitHub Actions" and select "Full Account" scope
   - Copy the token value

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Run the following steps in your terminal:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Navigate to your frontend directory
   cd frontend
   
   # Link to Vercel
   vercel link
   ```
   - After linking, check the `.vercel/project.json` file
   - Copy the `orgId` and `projectId` values

3. Add all these values as secrets in your GitHub repository

## Verifying CI/CD Setup

After setting up all the secrets:

1. Push a change to the `main` branch
2. Go to the `Actions` section of your GitHub repository
3. You should see the "YumRush CI/CD" workflow running with the following jobs:
   - Backend Tests
   - Frontend Tests
   - (E2E Tests - will be added in the future)
   - Deploy to Production (only runs on main branch and if tests pass)

## Manual Deployment

You can also manually trigger the entire CI/CD process:

1. Go to the `Actions` tab in your GitHub repository
2. Select the "YumRush CI/CD" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

This will run all tests in sequence, and if the branch is `main`, it will deploy after all tests pass.

## Deployment Monitoring

- **Vercel**: Access logs and deployment status through the Vercel dashboard
- **Render**: Access logs and deployment status through the Render dashboard

## Troubleshooting

If you encounter issues with CI/CD:

1. Check logs in the GitHub Actions section
2. Ensure all secrets are properly configured
3. Verify that tokens haven't expired
4. Make sure the Render webhook URL is correct and active

### Troubleshooting Frontend Deployment

If you encounter issues with frontend deployment:

1. Check GitHub Actions logs for specific errors
2. Verify that all Vercel tokens and IDs are correct
3. Try deploying locally with `vercel` to debug any issues

### Troubleshooting Backend Deployment

If you encounter issues with backend deployment:

1. Verify that the Render webhook URL is correct
2. Check the Render logs for any deployment errors
3. Try a manual deployment through the Render dashboard

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Render Webhooks Documentation](https://render.com/docs/deploy-hooks)