# CI/CD Setup for YumRush

This document contains instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for the YumRush project.

## CI/CD Pipeline Overview

The YumRush project uses a single CI/CD pipeline that performs two main tasks:

1. **Continuous Integration (CI)**: Tests the code to ensure it meets quality standards
2. **Continuous Deployment (CD)**: Automatically deploys the code to production environments

The pipeline is configured in `.github/workflows/main.yml` and follows this flow:

```
[Code Push to main] → [Run Tests] → [If Tests Pass and branch is main] → [Deploy to Production]
```

## How the Pipeline Works

1. When code is pushed to any branch or a pull request is created:
   - The CI job runs tests for both the backend and frontend

2. When code is pushed to the main branch and all tests pass:
   - The CD job deploys the backend to Render
   - The CD job deploys the frontend to Vercel

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
3. You should see the "YumRush CI/CD" workflow running
4. The workflow will:
   - First run all tests (CI job)
   - If tests pass and the branch is main, deploy to production (CD job)

## Manual Deployment

You can also manually trigger deployment:

1. Go to the `Actions` tab in your GitHub repository
2. Select the "YumRush CI/CD" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

This will run the tests first and then deploy if the tests pass.

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