---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: File uploads
titleTemplate: The Boring JavaScript Stack 🥱
description: Learn how to handle file uploads in Sails.js & The Boring JavaScript Stack using Sails Skipper. This guide covers setup to implementation, helping you efficiently manage file uploads to Amazon S3, Cloudflare R2, DigitalOcean Spaces, and more.
prev:
  text: 'Session'
  link: '/boring-stack/session'
next:
  text: 'Deploy on Render'
  link: '/boring-stack/render'
editLink: true
---

# File uploads

::: tip
🎥 **Watch the video tutorial**: If you prefer learning through video, check out Kelvin's YouTube tutorial on [file uploads in Sails and The Boring JavaScript Stack](https://youtu.be/JgFGx3GJ0XI?si=LM92cu7pf1qbJHys).
:::

[File uploads](https://sailsjs.com/documentation/concepts/file-uploads) in Sails & The Boring JavaScript Stack is straightforward thanks to [`skipper`](https://github.com/sailshq/skipper) and [`sails-hook-uploads`](https://github.com/sailshq/sails-hook-uploads).

Skipper is already integrated into your project, so you only need to install `sails-hook-uploads` to start handling file uploads effortlessly.

To get started, simply run:

```bash
npm install sails-hook-uploads
```

With `sails-hook-uploads`, you get a safe and simple API for uploading files to various storage services like [Amazon S3](#amazon-s3), [Cloudflare R2](#cloudflare-r2), and [DigitalOcean Spaces](#digitalocean-spaces), including your server's [local filesystem](#local-filesystem).

The configuration is minimal, and the process is seamless, allowing you to focus on building your application without worrying about the complexities of file uploads.

::: info
You may already have `sails-hook-uploads` installed if you are using the Ascent template of TBJS.
:::

## Upload basics

When handling file uploads in Sails.js, it's crucial to ensure that the `files` array in your action contains strings that matches the input name of the file to be uploaded.

### Key Points

1. **Define the Files Attribute**: The `files` array in your action should list the names of the files you expect to upload. For example, if you are uploading an avatar, you should have `files: ['avatar']`.

2. **Match Input Name**: The input name in your action should match the name specified in the `files` array. This ensures that the file is correctly identified and processed.

3. **Use sails.uploadOne or sails.upload**: The `sails.uploadOne` or `sails.upload` function is used to handle the file upload. The input name should be passed to these functions to upload the file(s).

## Upload example

Here's an example to illustrate the basics of file uploads:

```javascript
module.exports = {
  friendlyName: 'Upload file',
  description: 'Upload a file and return its details.',

  files: ['avatar'],

  inputs: {
    avatar: {
      type: 'ref',
      required: true,
      description: 'The file to upload'
    }
  },

  exits: {
    success: {
      responseType: 'redirect',
      description: 'File uploaded successfully.'
    }
  },

  fn: async function ({ avatar }) {
    // Ensure the input name matches the files attribute
    const uploadedFile = await sails.uploadOne(avatar)
    return '/profile'
  }
}
```

In this example, the `files` attribute is set to `['avatar']`, which matches the input name `avatar`. The `sails.uploadOne` function is then used to handle the file upload.

Then your UI can be written like the following:

::: code-group

```js[React]
import { useForm } from '@inertiajs/react'

export default function SimpleUpload() {
  const { data, setData, progress, post } = useForm({
    avatar: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/single-upload')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setData('avatar', e.target.files[0])} />
      {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>}
      <button type="submit" disabled={!data.avatar}>Upload</button>
    </form>
  )
}
```

:::

## Local filesystem

By default, file uploads in Sails.js are stored to your server's local filesystem in the `.tmp/uploads` directory.

This is a convenient setup for development and testing purposes, as it allows you to quickly verify that file uploads are working correctly without needing to configure an external storage service.

### Changing the upload directory

If you want to use your server's local filesytem in production, you might want to change the default upload directory to a different location as `.tmp/` will be destroyed and created for each deploy of your app.

To change the default upload directory, you need to set the `dirpath` property in the `config/uploads.js` file. Here’s how you can do it:

**Create or update `config/uploads.js`**: If you don't already have a `config/uploads.js` file, create one. Then, add or update the `dirpath` property to specify the new upload directory.

```javascript
module.exports.uploads = {
  dirpath: 'assets/images/uploads'
}
```

## Amazon S3

To upload files to Amazon S3, you need to install the `skipper-s3` Skipper adapter and configure it with your S3 credentials. Follow these steps to get started:

### Install the Skipper S3 adapter

```bash
npm install skipper-s3
```

### Configure S3 settings

Update your `config/uploads.js` file to include the S3 adapter and your S3 credentials. You can obtain these credentials from your AWS dashboard.

```javascript
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.S3_ACCESS_KEY,
  secret: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKET
}
```

Make sure to set the environment variables `S3_ACCESS_KEY`, `S3_SECRET_KEY`, and `S3_BUCKET` with your actual S3 credentials.

## Cloudflare R2

To upload files to Cloudflare R2, you can use the `skipper-s3` Skipper adapter since Cloudflare R2 is S3 compatible. Follow these steps to get started:

### Install the Skipper S3 adapter

```bash
npm install skipper-s3
```

### Configure R2 settings

Update your `config/uploads.js` file to include the S3 adapter and your Cloudflare R2 credentials. You can obtain these credentials from your [Cloudflare dashboard](https://dash.cloudflare.com/).

```javascript
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.R2_ACCESS_KEY,
  secret: process.env.R2_SECRET_KEY,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT
}
```

Make sure to set the environment variables `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, and `R2_ENDPOINT` with your actual Cloudflare R2 credentials.

## DigitalOcean Spaces

To upload files to DigitalOcean Spaces, you can use the `skipper-s3` Skipper adapter since DigitalOcean Spaces is S3 compatible. Follow these steps to get started:

### Install the Skipper S3 adapter

```bash
npm install skipper-s3
```

### Configure Spaces settings

Update your `config/uploads.js` file to include the S3 adapter and your DigitalOcean Spaces credentials. You can obtain these credentials from your [DigitalOcean dashboard](https://cloud.digitalocean.com/account/api/spaces).

```javascript
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.SPACES_ACCESS_KEY,
  secret: process.env.SPACES_SECRET_KEY,
  bucket: process.env.SPACES_BUCKET,
  endpoint: process.env.SPACES_ENDPOINT
}
```

Make sure to set the environment variables `SPACES_ACCESS_KEY`, `SPACES_SECRET_KEY`, `SPACES_BUCKET`, and `SPACES_ENDPOINT` with your actual DigitalOcean Spaces credentials.

## Multiple uploads

To further simplify uploading multiple files, we have created a `useFormWithUploads` hook and composable that streamline the process.

These utilities abstract away the complexities of massaging the files to be uploaded to the shape Skipper expect, making it easier to integrate into your React or Vue UIs.

See these examples for the usage of `useFormWithUploads`

::: code-group

```js[React]
import InputButton from '@/components/InputButton.jsx'
import useFormWithUploads from '@/hooks/useFormWithUploads.jsx'

export default function MultipleUploads() {
  const { data, setData, progress, ...form } = useFormWithUploads({
    productImages: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    form.post('/multiple-uploads')
  }

  return (
    <form onSubmit={handleSubmit}>
      {form.recentlySuccessful && <div>Upload successful!</div>}
      <input
        type="file"
        name="productImages"
        multiple
        onChange={(e) => setData('productImages', [...e.target.files])}
      />
      {form.errors.productImages && <p>{form.errors.productImages}</p>}
      {progress && progress.percentage && (
        <progress value={progress.percentage} max="100">
          {progress.percentage}%
        </progress>
      )}
      <InputButton
        processing={form.processing}
        disabled={form.processing || data.productImages.length === 0}
        label="Upload Product Images"
      />
    </form>
  )
}
```

:::

::: tip
If you don't have `useFormWithUploads` in your project, simply [copy it here](https://github.com/DominusKelvin/file-uploads/tree/develop/assets/js/hooks)
:::

## Upload methods

The `sails-hook-uploads` provides several methods to handle file uploads, each tailored to different use cases. Here are the available methods:

### `.uploadOne(upstreamOrReadable)`

This method accepts any Readable stream or an incoming Sails file upload of 0 or 1 file. It returns either `undefined` or a dictionary with information about the uploaded file data.

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar)
```

### `.upload(upstream)`

This method accepts any incoming Sails file upload, whether it consists of 0, 1, or multiple files. It always returns an array.

```javascript
const uploadedFiles = await sails.upload(inputs.photos)
```

### `.reservoir(upstreamOrReadable)`

This method accepts any Readable stream or any incoming Sails file upload, regardless of the number of files. It always returns an array.

```javascript
const uploadedFiles = await sails.reservoir(inputs.documents)
```

### `.startDownload(fd)`

Useful for downloading a file, this method returns a Readable stream.

```javascript
const fileStream = await sails.startDownload(fileDescriptor)
```

### `.cp(srcFd, srcOpts, destOpts)`

This method is useful for transloading an already-uploaded file to a different destination.

```javascript
await sails.cp(
  srcFileDescriptor,
  {},
  { adapter: 'skipper-s3', bucket: 'new-bucket' }
)
```

### `.rm(fd)`

This method is used to remove a file.

```javascript
await sails.rm(fileDescriptor)
```

### `sails.ls()`

This method lists files.

```javascript
const files = await sails.ls()
```

All methods use configuration from `sails.config.uploads`. Most inherited settings can be overridden. For more details, refer to the [Upload options](#upload-options).

## Upload options

When configuring file uploads, you can use the following options to customize the behavior of the upload process:

#### `dirname`

Optional. Specifies the directory path on the remote filesystem where file uploads should be streamed. It can be an absolute path or a relative path. If not provided, the filesystem adapter will determine a default directory.

**Example:**

```javascript
module.exports.uploads = {
  dirname: '/path/to/upload/directory'
}
```

**When calling an upload method:**

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar, {
  dirname: '/path/to/upload/directory'
})
```

#### `saveAs`

Optional. Determines the filename for the uploaded files. It can be a string for single-file uploads or a function for multi-file uploads.

**As a string:**

```javascript
module.exports.uploads = {
  saveAs: 'uploaded-file.txt'
}
```

**As a function:**

```javascript
module.exports.uploads = {
  saveAs: function (__newFileStream, next) {
    return next(undefined, 'custom-filename.txt')
  }
}
```

**When calling an upload method:**

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar, {
  saveAs: 'uploaded-file.txt'
})
```

#### `maxBytes`

Optional. Specifies the maximum total number of bytes permitted for an upload. If exceeded, unfinished uploads will be garbage-collected.

**Example:**

```javascript
module.exports.uploads = {
  maxBytes: 1_000_000 // 1 MB
}
```

**When calling the method:**

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar, {
  maxBytes: 1_000_000 // 1 MB
})
```

#### `onProgress`

Optional. A function that is called repeatedly as the upload progresses, providing a status update.

**Example:**

```javascript
module.exports.uploads = {
  onProgress: function (progress) {
    console.log('Upload progress:', progress)
  }
}
```

**When calling an upload method:**

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar, {
  onProgress: function (progress) {
    sails.log('Upload progress:', progress)
  }
})
```

#### `maxBytesPerFile`

Optional. Specifies the maximum number of bytes permitted for each individual file in an upload. This option is only supported by the `skipper-s3` adapter. If exceeded, the upload will be aborted.

**Example:**

```javascript
module.exports.uploads = {
  maxBytesPerFile: 500_000 // 500 KB
}
```

**When calling the method:**

```javascript
const uploadedFile = await sails.uploadOne(inputs.avatar, {
  maxBytesPerFile: 500_000 // 500 KB
})
```

## Error handling

When handling file uploads, it's important to manage errors effectively to ensure a smooth user experience. Here are the key error codes you need to be aware of:

- **E_EXCEEDS_UPLOAD_LIMIT**: This error occurs when the total upload size exceeds the `maxBytes` limit for the upstream. It is intercepted and handled by returning a `tooBig` response type.

- **E_EXCEEDS_FILE_SIZE_LIMIT**: This error occurs when the size of any individual file exceeds the `maxBytesPerFile` limit. Currently, this is applicable only for S3 uploads.

### Example usage

Here's an example of how to handle these errors during a file upload:

```js
module.exports = {
  friendlyName: 'Upload file',
  description: 'Upload a file and handle errors.',

  files: ['avatar'],

  inputs: {
    avatar: {
      type: 'ref',
      required: true,
      description: 'The file to upload'
    }
  },

  exits: {
    success: {
      responseType: 'redirect',
      description: 'File uploaded successfully.'
    },
    tooBig: {
      description: 'The uploaded file exceeds the size limit.',
      responseType: 'badRequest'
    }
  },

  fn: async function ({ avatar }) {
    try {
      const uploadedFile = await sails.uploadOne(avatar, {
        maxBytes: 1_000_000 // 1 MB
      })

      if (!uploadedFile) {
        throw 'tooBig'
      }

      return '/profile'
    } catch (err) {
      if (err.code === 'E_EXCEEDS_UPLOAD_LIMIT') {
        throw 'tooBig'
      }

      throw err
    }
  }
}
```
