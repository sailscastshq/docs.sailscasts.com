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

A project groups application source and its environments. From the directory containing your Sails app and Dockerfile:

```bash
slipway init --name harbor
slipway environments
```

`init` creates the server project and saves `.slipway.json` locally. If the project already exists, link it instead:

```bash
slipway projects
slipway link harbor
```

Linking changes the local target; it does not deploy or recreate the project.

## Create an environment

```bash
slipway environment:create staging
slipway environment:update staging --domain staging.example.com
```

To copy configuration according to its preview policies:

```bash
slipway environment:create preview-42 --from production
```

Secrets default to omission. Review inherited, omitted, and generated values before deploying. Configure the app's resources, Dockerfile, route, and variables at their [appropriate scope](/slipway/project-configuration).

## Check the target

Read `.slipway.json` before operating from a different checkout. Most commands use this linked project; the server is selected through saved [authentication](/slipway/cli-authentication). Passing `--env staging` selects an environment but does not switch servers.

Deployment commands default to production regardless of an environment value you manually add to `.slipway.json`. Pass the desired environment explicitly.

## First deployment

```bash
slipway push
slipway readiness --env staging
slipway slide --env staging --message "First staging deployment"
```

Git packaging includes committed HEAD. Follow [Your First Deploy](/slipway/first-deploy) to prepare the app's health path and verify the resulting deployment.

Use the dashboard for project deletion and review the resources affected before confirming it. The CLI has no project inspection, membership, or deletion command beyond the registered commands in the [reference](/slipway/cli-commands).
