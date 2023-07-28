# Contributing to The Sailscasts Docs

We appreciate your interest in contributing to this docs! Your contributions are very valuable to us, and we want to ensure that the process is easy and productive for everyone involved.

Please take a moment to read the guidelines below before contributing to the project.

## Project Description

This project contains the official documentations for all projects both open source and commercial by The Sailscasts Company.

## Contribution Workflow

When contributing to this project, we adhere to the [Gitflow branching model](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

In this workflow, we use the develop branch as the central branch for active development. Therefore, we request that all Pull Requests be targeted towards the develop branch instead of the main branch. This approach ensures the stability of our main branch while allowing continuous development on the develop branch.

## Before Contributing

Before diving into the contribution process and setting up your environment, it is essential to select an issue you would like to work on.

#### Here's a simple guide to follow:

1. Search through the list of [open issues](https://github.com/sailscastshq/docs.sailscasts.com/issues).
2. Find the issue you want to work on.

   ⚠️**Note:** If you notice a bug or you want to add a feature to the project, create a new issue using this [guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue)

3. Check to confirm if someone else has already worked on and made a pull request on said issue. To properly confirm, look out for a "pull request icon" on the issue. If there is none, you are good to go! If someone else has worked on the issue, kindly find a new issue to fix.

## Getting Started

#### To ensure a seamless contribution and review process, please follow these guidelines:

1. Open your preferred text editor.
2. Fork and clone the repository into your own github account.
   [Here is a guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

   ⚠️**Note:** If you cloned the repository a while back, we recommend fetching the latest changes from the upstream repository.

   You can do this by using Github Desktop or running the following commands:

   ```
   git checkout develop
   ```

   ```
   git pull upstream develop
   ```

3. Create a new branch in your forked repository

   ```
   git checkout -b <my-branch> develop
   ```

   ⚠️**Note:** For clarity, please name `<my-branch>` as "update-xxx" or "fix-xxx". For instance, you can use names like "update-readme" or "fix-typo-on-contribution-md" as examples.

4. In your text editor, Select the file related to the issue you want to fix, and make your changes.

   ⚠️**Note:** To contribute to a documentation, you would need to have Markdown knowledge. Visit [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) to read about GitHub Markdown and [here](https://www.markdowntutorial.com/) to practice.

5. Commit your changes with a descriptive commit message [using conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

   #### We highly encourage the use of conventional commits. Here are some examples:

   - **feat:** Use this when introducing a new feature.
   - **fix:** Use this when resolving any issues in the codebase.
   - **chore:** Use this when adding new links/resources or making minor changes.
     (e.g, `chore: Add database credentials`)
   - Please ensure that your **commit messages are concise and clear**.
   - Write commit messages in the **present tense**, as they reflect the current state of the codebase after the changes have been applied.  
     <br/>

6. Push your branch to GitHub

   ```
   git push origin <my-branch>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description matching the issue you fixed.

   ⚠️**Note:** To ensure a smoother review process, kindly use the following format for the Pull Request title:`[chore]`, `[feat]`, or `[fix]`, followed by a descriptive title.

   For instace, a feat-related change could have a title like `[feat] setup pasword reset`. This helps us categorize and understand the nature of the changes made in each PR.

   - Link the issue you have resolved in the Pull Request Template using the following syntax:
   - If your Pull Request fixes issue #25, add `Fixes #25` to the description.
   - If your Pull Request addresses multiple issues, list them using the same syntax (`Fixes #23, Fixes #15`) however, we'll advise you create seperate PRs for each.  
     <br/>
     This helps us track and automatically close the relevant issue when your Pull Request is merged.

## Contribution Etiquettes

- When you pick an issue to fix, we recommended that you review the comment thread first to check if someone is already working on it. In case no one has claimed it yet, kindly leave a comment stating your intention to work on it. This way, others will be aware, and we can avoid accidental duplication of effort.

- If someone has shown interest in fixing an issue but doesn't follow up for a specific period, let's say 2-3 weeks, it's permissible to pick up the same issue later. However, please ensure that you leave a comment to inform others of your intention before proceeding.

#### Thank you for reading the guide. We look forward to merging your contributions.
