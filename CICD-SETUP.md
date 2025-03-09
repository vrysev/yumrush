# CI/CD Setup for YumRush

> **Note about CI/CD workflow files**: This project has three workflow files in `.github/workflows/`:
> - `main.yml`: The primary CI/CD pipeline that runs tests and triggers deployments
> - `ci.yml`: A secondary CI pipeline that includes E2E tests
> - `cd.yml`: A dedicated CD pipeline with additional checks
>
> All three files are active but configured to work together without conflicts.

This document contains instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for the YumRush project.

## GitHub Actions

GitHub Actions are used to automate testing and deployment. The pipeline is configured in the `.github/workflows/main.yml` file and performs the following steps:

1. On each push or PR to the `main` branch:
   - Runs tests, linting, and type checking for the backend
   - Runs tests, linting, and type checking for the frontend

2. On successful tests and push to the `main` branch:
   - Triggers backend deployment to Render
   - Notifies that frontend tests passed (actual deployment handled by Vercel's GitHub integration)

## Deployment Overview

- **Backend**: Automatically deployed to Render via webhook triggered by GitHub Actions when changes are made in the backend directory
- **Frontend**: Automatically deployed to Vercel via GitHub Actions when changes are made in the frontend directory

The deployment is smart and only triggers when relevant files are changed. For example:
- If you only change frontend code, only the frontend will be deployed
- If you only change backend code, only the backend will be deployed
- If you change both, both will be deployed

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

After setting up all the secrets and webhooks:

1. Push a change to the `main` branch:
   - If you change files in `frontend/`, the frontend will be deployed
   - If you change files in `backend/`, the backend will be deployed

2. Go to the `Actions` section of your GitHub repository
3. You should see the "YumRush CI/CD Pipeline" workflow running
4. After successful test completion:
   - If backend files were changed, the Render webhook will be triggered to deploy the backend
   - If frontend files were changed, the Vercel CLI will deploy the frontend

5. Check deployment status:
   - Backend: Go to your Render dashboard to monitor deployment
   - Frontend: Go to your Vercel dashboard to monitor deployment

## Manual Deployment

You can also manually trigger deployment:

1. Go to the `Actions` tab in your GitHub repository
2. Select the "YumRush CD" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Choose which components to deploy:
   - Deploy Frontend: Check to deploy the frontend
   - Deploy Backend: Check to deploy the backend
6. Click "Run workflow"

This is useful when you want to redeploy without making code changes.

## Deployment Monitoring

- **Vercel**: Access logs and deployment status through the Vercel dashboard
- **Render**: Access logs and deployment status through the Render dashboard

## Troubleshooting

If you encounter issues with CI/CD:

1. Check logs in the GitHub Actions section
2. Ensure all secrets are properly configured
3. Verify that tokens haven't expired
4. Make sure the Render webhook URL is correct and active
5. Check Vercel project settings (working directory, build scripts, etc.)

### Troubleshooting Vercel Deployment

If you encounter errors with the Vercel deployment in GitHub Actions:

1. Check the GitHub Actions logs for the specific error message
2. Verify that all secrets are correctly set:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
3. Make sure the token has the right permissions (Full Account access)
4. Verify the project link by running `vercel link` in the frontend directory locally
5. Try a manual deployment with the Vercel CLI locally:
   ```bash
   cd frontend
   vercel deploy --prod
   ```
6. Check if your token has expired and regenerate if needed

### Troubleshooting Render Deployment

If you encounter issues with Render deployment:

1. Make sure the webhook URL is correct and active
2. Check deployment logs in the Render dashboard
3. If necessary, perform a manual deployment through the Render dashboard
4. Ensure that the configuration in `render.yaml` matches the settings in the dashboard

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CI/CD Documentation](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Render Deploy Hooks Documentation](https://render.com/docs/deploy-hooks)