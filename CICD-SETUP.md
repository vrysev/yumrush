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

- **Backend**: Automatically deployed to Render via webhook triggered by GitHub Actions
- **Frontend**: Automatically deployed to Vercel via Vercel's GitHub integration

## Setting Up GitHub Actions

### 1. Setting up Secrets in GitHub

You need to configure the following secrets in your repository:

1. Navigate to your repository settings: `Settings > Secrets and variables > Actions`
2. Add the following secrets:

   - `RENDER_DEPLOY_HOOK`: The webhook URL for Render deployment

### 2. Getting the Render Deploy Hook

1. Sign in to your Render account
2. Select your backend service
3. Navigate to `Settings > Deploy Hooks`
4. Click `Create Deploy Hook`
5. Name it "GitHub Actions" and select the `main` branch
6. Copy the generated URL and save it as the `RENDER_DEPLOY_HOOK` secret in GitHub

### 3. Setting Up Vercel Deployment

For frontend deployment, we use Vercel's built-in GitHub integration:

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Go to the Vercel dashboard and click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure project settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables if needed:
   - `VITE_API_URL`: URL of your backend on Render (e.g., https://yumrush-backend.onrender.com)
6. Click "Deploy"

Vercel will automatically deploy your frontend whenever changes are pushed to the main branch. This approach is much more reliable than using GitHub Actions for Vercel deployment.

## Verifying CI/CD Setup

After setting up the GitHub integration for Vercel and the webhook for Render:

1. Push a change to the `main` branch
2. Go to the `Actions` section of your GitHub repository
3. You should see the "YumRush CI/CD Pipeline" workflow running
4. After successful test completion:
   - The Render webhook will be triggered to deploy the backend
   - Vercel will automatically detect the push and deploy the frontend

5. Check deployment status:
   - Backend: Go to your Render dashboard to monitor deployment
   - Frontend: Go to your Vercel dashboard to monitor deployment

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

If you encounter errors with Vercel's GitHub integration:

1. Go to your Vercel project dashboard
2. Check the deployment logs for errors
3. Verify your project settings:
   - Root Directory should be set to `frontend`
   - Framework preset should be `Vite`
   - Build command should be `npm run build`
4. If needed, you can also deploy manually:
   - Navigate to the `frontend` directory locally
   - Run `npm install -g vercel` to install the Vercel CLI
   - Run `vercel login` to sign in
   - Run `vercel` to deploy manually

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