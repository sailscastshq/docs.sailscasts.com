---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Creating Projects
titleTemplate: Slipway
description: Create and configure projects in Slipway for your Sails applications.
prev:
  text: Commands Reference
  link: /slipway/cli-commands
next:
  text: Project Configuration
  link: /slipway/project-configuration
editLink: true
---

# Creating Projects

A project in Slipway represents your Sails application. Each project can have multiple environments (production, staging, etc.).

## Creating a Project

### Via CLI (Recommended)

Navigate to your Sails project directory and run:

```bash
cd ~/projects/my-sails-app
slipway init
```

This will:

1. Detect your project name from `package.json`
2. Check for a `Dockerfile`
3. Create the project in Slipway
4. Create a default `production` environment
5. Save a `.slipway.json` config file

```
$ slipway init

  Initialize Slipway Project

  Detected: my-sails-app (from package.json)
  Dockerfile: Found ✓

  Project name: my-sails-app

  ✓ Project created

  Project: My Sails App
  Slug: my-sails-app
  Environment: production

  Next steps:
  1. Set environment variables: slipway env:set myapp KEY=value
  2. Deploy: slipway slide
```

### With Custom Name

```bash
slipway init --name my-custom-name
```

### Via Dashboard

1. Log into your Slipway dashboard
2. Click **New Project**
3. Enter project details:
   - **Name**: Display name (e.g., "My Sails App")
   - **Slug**: URL-friendly identifier (e.g., `my-sails-app`)
4. Click **Create Project**

## The .slipway.json File

After `slipway init`, a `.slipway.json` file is created:

```json
{
  "project": "my-sails-app",
  "projectId": 1
}
```

This file:

- Links your local directory to the Slipway project
- Should be committed to version control
- Allows the CLI to know which project to deploy

::: warning Don't Delete
If you delete `.slipway.json`, you'll need to run `slipway link` to reconnect.
:::

## Linking Existing Projects

If a project already exists in Slipway (created via dashboard or another machine):

```bash
slipway link my-sails-app
```

This creates the `.slipway.json` file linking to the existing project.

### Find Available Projects

```bash
slipway projects
```

Output:

```
NAME              SLUG              STATUS    ENVIRONMENTS
My Sails App      my-sails-app      active    production, staging
API Service       api-service       active    production
Marketing Site    marketing         active    production
```

## Project Structure

```
my-sails-app/
├── .slipway.json        # Slipway project link
├── Dockerfile           # Required for deployment
├── package.json
├── package-lock.json
├── app.js
├── api/
├── config/
├── views/
└── assets/
```

## Required Files

### Dockerfile

Every project needs a `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 1337

CMD ["node", "app.js"]
```

See [How Deployments Work](/slipway/how-deployments-work) for advanced Dockerfile examples.

### package.json

Your `package.json` should have:

```json
{
  "name": "my-sails-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "build": "shipwright build"
  },
  "dependencies": {
    "sails": "^1.5.9"
  }
}
```

## Environments

Each project can have multiple environments:

### Default Environment

When you create a project, a `production` environment is created automatically.

### Creating Additional Environments

```bash
# Create staging environment
slipway env:create my-sails-app staging

# Create preview environment
slipway env:create my-sails-app preview
```

### Deploying to Specific Environments

```bash
# Deploy to production (default)
slipway slide

# Deploy to staging
slipway slide --env=staging
```

### Environment-Specific Configuration

Each environment has its own:

- Environment variables
- Domain
- Database links
- Deployment history

## Project Settings

### View Settings

```bash
slipway project:info my-sails-app
```

Output:

```
Project: My Sails App
Slug: my-sails-app
Created: January 15, 2024

Settings:
  Auto-Deploy: Enabled
  Deploy Branch: main
  Health Check: /health

Environments:
  production (default)
    Domain: myapp.example.com
    Status: running

  staging
    Domain: staging.myapp.example.com
    Status: running
```

### Update Settings

```bash
slipway project:update my-sails-app \
  --auto-deploy=true \
  --auto-deploy-branch=main \
  --health-check-path=/health
```

## Deleting Projects

::: danger Destructive Action
Deleting a project removes all environments, deployments, and data.
:::

```bash
slipway project:destroy my-sails-app
```

You'll be prompted to confirm:

```
Are you sure you want to delete 'my-sails-app'?
This will delete:
  - 2 environments (production, staging)
  - 15 deployments
  - All environment variables

Type 'my-sails-app' to confirm: my-sails-app

✓ Project deleted
```

## Best Practices

### 1. One Project Per Repository

```
my-sails-app/          → slipway project: my-sails-app
my-api/                → slipway project: my-api
my-marketing-site/     → slipway project: marketing
```

### 2. Use Descriptive Slugs

```bash
# Good
slipway init --name my-company-api

# Avoid
slipway init --name app1
```

### 3. Commit .slipway.json

Add to version control so team members can deploy:

```bash
git add .slipway.json
git commit -m "Add Slipway configuration"
```

### 4. Use Environments for Stages

```
my-sails-app
├── production     → myapp.com
├── staging        → staging.myapp.com
└── preview        → preview.myapp.com
```

### 5. Configure Auto-Deploy per Environment

```bash
# Production: deploy from main
slipway project:update myapp --auto-deploy-branch=main --env=production

# Staging: deploy from develop
slipway project:update myapp --auto-deploy-branch=develop --env=staging
```

## Troubleshooting

### "Project Not Found"

```bash
slipway slide
# Error: Project not found. Run 'slipway init' first.
```

**Solution**: Run `slipway init` or `slipway link`.

### "Slug Already Taken"

```bash
slipway init --name existing-app
# Error: Slug 'existing-app' is already taken
```

**Solution**: Use a different name or link to the existing project.

### "No Dockerfile Found"

```bash
slipway init
# Warning: No Dockerfile found
```

**Solution**: Create a Dockerfile before deploying. See examples above.

### ".slipway.json Conflicts"

If `.slipway.json` points to a different project:

```bash
# Remove and reinitialize
rm .slipway.json
slipway init
```

Or link to the correct project:

```bash
rm .slipway.json
slipway link correct-project-slug
```

## What's Next?

- Configure your [Project Settings](/slipway/project-configuration)
- Set up [Git Integration](/slipway/git-integration)
- Deploy with [Your First Deploy](/slipway/first-deploy)
