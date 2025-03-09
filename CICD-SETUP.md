# CI/CD Setup for YumRush

This document contains instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for the YumRush project.

## GitHub Actions

GitHub Actions are used to automate testing and deployment. The pipeline is configured in the `.github/workflows/main.yml` file and performs the following steps:

1. On each push or PR to the `main` branch:
   - Runs tests, linting, and type checking for the backend
   - Runs tests, linting, and type checking for the frontend

2. On successful tests and push to the `main` branch:
   - Triggers backend deployment to Render
   - Deploys frontend to Vercel

## Setting Up GitHub Actions

### 1. Setting up Secrets in GitHub

You need to configure the following secrets in your repository:

1. Navigate to your repository settings: `Settings > Secrets and variables > Actions`
2. Add the following secrets:

   - `RENDER_DEPLOY_HOOK`: The webhook URL for Render deployment
   - `VERCEL_TOKEN`: Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 2. Getting the Render Deploy Hook

1. Sign in to your Render account
2. Select your backend service
3. Navigate to `Settings > Deploy Hooks`
4. Click `Create Deploy Hook`
5. Name it "GitHub Actions" and select the `main` branch
6. Copy the generated URL and save it as the `RENDER_DEPLOY_HOOK` secret in GitHub

### 3. Obtaining Vercel Tokens

1. Sign in to your Vercel account
2. Navigate to `Settings > Tokens`
3. Click `Create Token`
4. Name it "GitHub Actions" and set `Full Account` access
5. Copy the token and save it as the `VERCEL_TOKEN` secret in GitHub

### 4. Getting Vercel Project and Organization IDs

1. Install Vercel CLI: `npm i -g vercel`
2. Login to your account: `vercel login`
3. Navigate to your project's frontend directory and run: `vercel link`
4. After linking, check the `.vercel/project.json` file
5. In this file, you'll find `orgId` and `projectId`
6. Save them as `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` secrets in GitHub

**Note:** During the first deployment, Vercel CLI may request to create project configuration in the repository. If you encounter errors in GitHub Actions, try deploying locally using `vercel` from the frontend directory first to create all necessary configuration files.

## Verifying CI/CD Setup

After setting up all secrets and pushing to the `main` branch, you should see the GitHub Actions workflow start:

1. Go to the `Actions` section of your repository
2. You should see the "YumRush CI/CD Pipeline" workflow running
3. After successful completion, your application will be automatically deployed:
   - Frontend to Vercel
   - Backend to Render

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

If you encounter errors when deploying to Vercel through GitHub Actions:

1. Navigate to the `frontend` directory locally
2. Run the `vercel login` command to sign in
3. Then run `vercel link` to connect your local project to the Vercel project
4. After successful linking, run `vercel` to deploy
5. After a successful local deployment, GitHub Actions should work correctly

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