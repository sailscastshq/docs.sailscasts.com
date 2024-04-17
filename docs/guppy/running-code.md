---
title: Running code
editLink: true
---

# Running code

guppy can evaluate your Javascript code in one of two ways:

## Evaluate manually

This is the default way guppy runs your code and it requires you to do one of the following when you want to evaluate code:

- Hit the play icon on the sidebar
- Go to the run menu and click on Evaluate
- Use the shortcut Cmd/Ctrl + R

::: tip
You will find the shortcut to be much more easier as you evaluate code manually in guppy.
:::

## Evaluate automatically

To let guppy evaluate your code as you type, you can

- Go to the run menu and click on Auto Evaluate
- Use the shortcut Shift + Cmd/Ctrl + R

::: tip
Both ways of activating automatic evaluating code in guppy will also toggle the mode on and off.
:::

## Evaluate selection

As of guppy `v1.1+``, you can evaluate specifically particular line(s) of code that is currently on your editor. This come in handy when you don't want to clear your editor completely but just want the evaluation of one or more line. To do this

- Highlight the line(s) you want to evaluate
- Hit the run button or use the Cmd/Ctrl + R shortcut to execute the highlighted code

![Evaluate code selection](/images/guppy/evaluate-selection.png)

Notice in the above screenshot that even though we have three lines of code only the highlighted line `Article.find(1)` was executed.

## Running your code in a local project

While evaluating Javascript code in guppy is really nice for trying out ideas, the real magic happens when you run your code within your own local projects.

guppy supports the [Sails](https://sailsjs.com) framework out of the box so you can run code within the context of your Sails application.

To run your code in one of your own Sails projects you can

- simply press Ctrl/Cmd+O.
- click on the folder icon.
- go to the guppy's file menu and click Set working directory

This will open a dialog that lets you choose the working directory that you want to load.

Once you have loaded a project, the guppy status bar will indicate which project you have open at the moment.

![Evaluate code in local project](/images/guppy/evaluate-code-in-local-project.png)
