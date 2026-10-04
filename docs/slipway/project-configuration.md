---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Project Configuration
titleTemplate: Slipway
description: Configure project-specific settings for deployment and runtime behavior.
prev:
  text: Creating Projects
  link: /slipway/creating-projects
next:
  text: Git Integration
  link: /slipway/git-integration
editLink: true
---

# Project Configuration

Slipway separates project identity, environment configuration, and app runtime settings. Choose the scope that owns the change rather than applying every setting to the project.

## Project identity

From a linked application directory:

```bash
slipway projects
slipway project:update harbor --name "Harbor" --description "Customer application"
```

`project:update` supports name, description, and repository URL (`--repo`). It does not set health paths, resource limits, Dockerfiles, auto-deploy branches, or timeouts.

## Environment settings

Use the selected environment's settings to manage its domain and variables. CLI examples:

```bash
slipway environments
slipway environment:create staging
slipway environment:update staging --domain staging.example.com
slipway env:set LOG_LEVEL=info --env staging
```

Creating an environment with `--from production` follows each variable's preview policy; secrets default to omission. Review generated and inherited values before deployment. See [Environment Variables](/slipway/environment-variables).

## App settings

Open the app within its environment to configure its Dockerfile path, route path, health path, resource limits, app variables, and available capabilities. App settings belong to that app, so a worker and web app can use different values.

The default health path is `/health`. HTTP apps must bind to `0.0.0.0` and honor their configured port. Workers can have no HTTP route; verify their actual work rather than expecting an HTTP check to prove it.

For repository branches and automatic deployment, use the app's [Git Integration](/slipway/git-integration). For per-app routing, see [Multi-App Environments](/slipway/multi-app).

## Apply and verify

Review the target before saving. Variable and container configuration changes require the applicable deployment or restart before the running app uses them. Saving configuration is not a receipt that a restart succeeded.

Upload the intended committed source, refresh [readiness](/slipway/first-deploy#check-deployment-readiness), deploy to staging, and verify the app before making the corresponding production change. There is no CLI deployment dry-run option.
