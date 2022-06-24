---
title: Basic Usage
description: Use captain-vane to generate test data
editLink: true
---

# {{ $frontmatter.title }}

Basic usage of captain-vane is to generate a factory file and use the `vane`` helper provided by `captain-vane`` to create records using the generated factory and model definition.

Let's say you have a user model in your Sails application with the following definition:


```js{models/User.js}
module.exports = {
  tableName: 'users',

  attributes: {
    emailAddress: {
      type: 'string',
      unique: true,
      isEmail: true,
      required: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    isAdmin: {
      type: 'boolean',
      defaultsTo: false,
    },
  },
}
```
With captain-vane and captain-vane-generator all setup in your project, you can run the following command to generate a factory for your user model in `config/factories`

```sh
sails generate factory user
```
The above command will generate a factory file - `config/factories/user.js` - with the following code already inside it:

```js{config/factories/user.js}
const { fake } = require('captain-vane')

module.exports.default = () => {
    return {
        id: fake.randUuid(),
    }
}
```

::: tip
captain-vane assumes every model has an `id` field in `config/models.js` so it prepopulates that field with a random Uuid. You can change this if you are using integers for that field.
:::

## Defining model factories
Now that we have a `user.js` factory, let's use `captain-vane` to automatically fill in values for our `User` model. At the top of the generated factory file, you will see the following statement

```js{config/factories/user.js}
const { fake } = require('captain-vane')
```
This fake object is exported by captain-vane and gives you access to the [falso](https://ngneat.github.io/falso/) library which allows you create massive amounts of fake data in the browser and NodeJS. Let's use some of the methods `fake` exposes in our `user.js` factory.

```js{config/factories/user.js}
const { fake } = require('captain-vane')

module.exports.default = () => {
    return {
        id: fake.randUuid(),
        emailAddress: fake.randEmail(),
        firstName: fake.randFirstName(),
        lastName: fake.randLastName()
    }
}
```

Check out the falso [documentations](https://ngneat.github.io/falso/docs/getting-started) for all the random data and methods to access.

## Creating records using factories
Now that the user factory is all setup, you can used the `vane` Sails helper that is exposed by `captain-vane` to create records using that factory. So in your tests, the Sails console or [guppy](https://guppy.sailscasts.com) you can call the helper like so:

```js
const newUser = await sails.helpers.vane('user')
```
The vane helper takes in the model identity and with it, it will create a new record based on the model and the factory of the same name.

::: warning
Do note that both the factory and model name must be the same as this convention is expected by captain-vane.
:::

## Overriding attributes
captain-vane allows you to override attributes set with the model factory. You pass in an optional `data` object with properties corresponding to the attributes in the factory you want to override. So let's say we want to create an admin user, we can call the vane helper like so:

```js
const newAdminUser = await sails.helpers.vane.with({ model: 'user', data: { isAdmin: true } })
```

::: tip
You can override as many attributes as you want and this is pretty useful when you want to have predictable records created.
:::

## Creating multiple records with factories
You can create multiple records by using the `options.count`. Like so:

```js
const users = await sails.helpers.vane.with({
    model: 'user',
    options: {
        count: 10
    }
})
```

## Dry run
Perhaps you want to generate the factory data without actually creating records in your database, you can do this by setting the `options.dry` boolean to `true`:

```js
const users = await sails.helpers.vane.with({
    model: 'user',
    options: {
        dry: true
    }
})
```


## Options
captain-vane accepts an optional third argument called `options` which is a dictionary you can use to configure how each call to the `sails.helpers.vane` helper will behave.

### Properties

* `count` (`Integer`)
    * The number of records to create with the factory. Defaults to `1`
*  `dry` (`Boolean`)
    * If `true` will not create records in your database but return the generated data. Defaults to `false`
