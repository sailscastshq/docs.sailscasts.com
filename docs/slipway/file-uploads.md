---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: File Uploads
titleTemplate: Slipway
description: Configure file uploads with S3-compatible storage in your Sails applications deployed on Slipway.
prev:
  text: Global Environment Variables
  link: /slipway/global-environment-variables
next:
  text: Database Services
  link: /slipway/database-services
editLink: true
---

# File Uploads

Slipway makes it easy to configure file uploads with S3-compatible storage like Cloudflare R2, DigitalOcean Spaces, or Amazon S3.

## Why S3-Compatible Storage?

When deploying to Slipway:

- **Container filesystems are ephemeral** - files saved locally are lost on redeploy
- **S3-compatible storage persists** - files survive deployments and are CDN-ready
- **Scales automatically** - no disk space limits to manage

## Setup

### 1. Install Dependencies

In your Sails project:

```bash
npm install sails-hook-uploads skipper-s3
```

### 2. Configure Global Variables

Set your storage credentials once in Slipway (shared across all apps):

::: code-group

```bash [Cloudflare R2]
slipway config:set \
  R2_ACCESS_KEY=your-access-key \
  R2_SECRET_KEY=your-secret-key \
  R2_BUCKET=your-bucket \
  R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
```

```bash [DigitalOcean Spaces]
slipway config:set \
  SPACES_ACCESS_KEY=your-access-key \
  SPACES_SECRET_KEY=your-secret-key \
  SPACES_BUCKET=your-bucket \
  SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

```bash [Amazon S3]
slipway config:set \
  S3_ACCESS_KEY=your-access-key \
  S3_SECRET_KEY=your-secret-key \
  S3_BUCKET=your-bucket \
  S3_REGION=us-east-1
```

:::

### 3. Configure Your Sails App

Create or update `config/uploads.js`:

::: code-group

```javascript [Cloudflare R2]
// config/uploads.js
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.R2_ACCESS_KEY,
  secret: process.env.R2_SECRET_KEY,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT,

  // Optional settings
  maxBytes: 10 * 1024 * 1024 // 10MB max file size
}
```

```javascript [DigitalOcean Spaces]
// config/uploads.js
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.SPACES_ACCESS_KEY,
  secret: process.env.SPACES_SECRET_KEY,
  bucket: process.env.SPACES_BUCKET,
  endpoint: process.env.SPACES_ENDPOINT,

  maxBytes: 10 * 1024 * 1024
}
```

```javascript [Amazon S3]
// config/uploads.js
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.S3_ACCESS_KEY,
  secret: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,

  maxBytes: 10 * 1024 * 1024
}
```

:::

### 4. Upload Files in Your Controller

```javascript
// api/controllers/upload-avatar.js
module.exports = {
  files: ['avatar'],

  inputs: {
    avatar: {
      type: 'ref',
      required: true
    }
  },

  fn: async function ({ avatar }) {
    const uploadedFiles = await sails.upload(avatar, {
      dirname: 'avatars' // subfolder in your bucket
    })

    if (uploadedFiles.length === 0) {
      throw 'noFileUploaded'
    }

    const file = uploadedFiles[0]

    // Save the URL to your database
    await User.updateOne({ id: this.req.me.id }).set({
      avatarUrl: file.fd // or construct CDN URL
    })

    return {
      url: file.fd,
      size: file.size
    }
  }
}
```

## Getting Public URLs

### Cloudflare R2

Enable public access on your R2 bucket, then construct URLs:

```javascript
// api/helpers/get-upload-url.js
module.exports = {
  inputs: {
    path: { type: 'string', required: true }
  },
  fn: async function ({ path }) {
    const publicUrl =
      process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET}.r2.dev`
    return `${publicUrl}/${path}`
  }
}
```

### With a CDN

For best performance, put a CDN in front of your storage:

```javascript
// config/custom.js
module.exports.custom = {
  uploadsBaseUrl: process.env.CDN_URL || 'https://cdn.example.com/uploads'
}

// In your code
const avatarUrl = `${sails.config.custom.uploadsBaseUrl}/${filename}`
```

## Local Development

For local development, you can use disk storage:

```javascript
// config/uploads.js
module.exports.uploads = {
  // Production: S3
  ...(process.env.NODE_ENV === 'production'
    ? {
        adapter: require('skipper-s3'),
        key: process.env.R2_ACCESS_KEY,
        secret: process.env.R2_SECRET_KEY,
        bucket: process.env.R2_BUCKET,
        endpoint: process.env.R2_ENDPOINT
      }
    : {
        // Development: local disk
        adapter: require('skipper-disk'),
        dirpath: '.tmp/uploads'
      }),

  maxBytes: 10 * 1024 * 1024
}
```

## Image Processing

For image uploads, consider processing before storing:

```bash
npm install sharp
```

```javascript
// api/controllers/upload-avatar.js
const sharp = require('sharp')

module.exports = {
  files: ['avatar'],

  fn: async function ({ avatar }) {
    // Upload original
    const [uploaded] = await sails.upload(avatar, {
      dirname: 'avatars/original'
    })

    // Create thumbnail
    const thumbnailBuffer = await sharp(uploaded.fd)
      .resize(150, 150)
      .jpeg({ quality: 80 })
      .toBuffer()

    // Upload thumbnail
    await sails.upload(thumbnailBuffer, {
      dirname: 'avatars/thumbs',
      filename: uploaded.filename
    })

    return {
      /* ... */
    }
  }
}
```

## File Validation

Always validate uploads server-side:

```javascript
// api/controllers/upload-document.js
module.exports = {
  files: ['document'],

  inputs: {
    document: {
      type: 'ref',
      required: true
    }
  },

  fn: async function ({ document }) {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const [file] = await sails.upload(document, {
      maxBytes: maxSize,
      // Validate file type
      onProgress: (progress) => {
        if (!allowedTypes.includes(progress.file.headers['content-type'])) {
          throw new Error('Invalid file type')
        }
      }
    })

    return { url: file.fd }
  }
}
```

## Deleting Files

```javascript
// api/helpers/delete-upload.js
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')

module.exports = {
  inputs: {
    path: { type: 'string', required: true }
  },

  fn: async function ({ path }) {
    const client = new S3Client({
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY
      }
    })

    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: path
      })
    )
  }
}
```

## Troubleshooting

### "Access Denied" Errors

1. Check your credentials are correct
2. Verify bucket permissions allow uploads
3. For R2, ensure the API token has write permissions

### "SignatureDoesNotMatch" Errors

- Verify `endpoint` URL is correct
- Check for trailing slashes in URLs
- Ensure credentials haven't been rotated

### Files Not Appearing

- Check bucket is public or URLs are signed
- Verify the correct region/endpoint
- Look for CORS issues if accessing from browser

## Best Practices

### 1. Use Unique Filenames

```javascript
const crypto = require('crypto')

function generateFilename(originalName) {
  const ext = originalName.split('.').pop()
  const hash = crypto.randomBytes(16).toString('hex')
  return `${hash}.${ext}`
}
```

### 2. Organize with Prefixes

```javascript
const uploadPath = `uploads/${userId}/avatars/${filename}`
```

### 3. Set Appropriate Cache Headers

Configure your CDN or bucket to cache static uploads:

```
Cache-Control: public, max-age=31536000
```

### 4. Use Signed URLs for Private Files

For files that shouldn't be public:

```javascript
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const signedUrl = await getSignedUrl(
  client,
  new GetObjectCommand({
    Bucket: bucket,
    Key: path
  }),
  { expiresIn: 3600 }
) // 1 hour
```

## What's Next?

- Configure [Global Environment Variables](/slipway/global-environment-variables) for storage credentials
- Set up [Database Services](/slipway/database-services) with S3 backups
- Learn about [Environment Variables](/slipway/environment-variables) for project config
