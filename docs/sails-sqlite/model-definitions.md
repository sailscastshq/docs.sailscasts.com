---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Model definitions
titleTemplate: Sails SQLite
description: Sails SQLite supports all standard Waterline model features with additional SQLite-specific optimizations and data types.
prev:
  text: Configuration
  link: '/sails-sqlite/configuration'
next:
  text: Advanced features
  link: '/sails-sqlite/advanced-features'
editLink: true
---

# Model Definitions

Sails SQLite supports all standard Waterline model features with additional SQLite-specific optimizations and data types.

## Basic Model Structure

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      columnName: 'id'
    },
    name: {
      type: 'string',
      required: true,
      maxLength: 100
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true,
      columnName: 'is_active'
    },
    createdAt: {
      type: 'number',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true
    }
  }
}
```

## Supported Data Types

### Standard Types

| Waterline Type | SQLite Type  | Description                 |
| -------------- | ------------ | --------------------------- |
| `string`       | TEXT         | Variable length text        |
| `number`       | INTEGER/REAL | Integers and floating point |
| `boolean`      | INTEGER      | 0 or 1                      |
| `json`         | TEXT         | JSON stored as text         |
| `ref`          | TEXT         | Any value stored as JSON    |

### Date and Time

```javascript
// Using timestamps (recommended for performance)
createdAt: {
  type: 'number',
  autoCreatedAt: true
},

// Using ISO date strings
createdAt: {
  type: 'string',
  autoCreatedAt: true,
  columnType: 'datetime'
}
```

## JSON Fields

Sails SQLite provides excellent JSON support:

```javascript
// api/models/Product.js
module.exports = {
  attributes: {
    name: 'string',
    metadata: {
      type: 'json',
      defaultsTo: {}
    },
    tags: {
      type: 'json',
      defaultsTo: []
    },
    config: {
      type: 'json',
      defaultsTo: {
        visible: true,
        featured: false
      }
    }
  }
}
```

Usage:

```javascript
// Create with JSON data
const product = await Product.create({
  name: 'Laptop',
  metadata: {
    brand: 'Dell',
    model: 'XPS 13',
    specs: {
      ram: '16GB',
      storage: '512GB SSD'
    }
  },
  tags: ['electronics', 'computers', 'laptops']
}).fetch()

// Query JSON fields (using raw queries for complex JSON operations)
const products = await sails.sendNativeQuery(
  `
  SELECT * FROM product 
  WHERE JSON_EXTRACT(metadata, '$.brand') = ?
`,
  ['Dell']
)
```

## Unique Constraints

### Single Column Unique

```javascript
email: {
  type: 'string',
  unique: true,
  required: true
}
```

### Composite Unique Constraints

```javascript
// api/models/UserRole.js
module.exports = {
  attributes: {
    userId: {
      type: 'number',
      required: true
    },
    roleId: {
      type: 'number',
      required: true
    }
  },

  // Composite unique constraint
  indexes: [
    {
      columns: ['userId', 'roleId'],
      unique: true
    }
  ]
}
```

## Auto-Indexing

Sails SQLite automatically creates indexes for frequently queried fields:

```javascript
// These fields will automatically get indexes
email: {
  type: 'string',
  unique: true  // Unique constraint creates index
},
status: {
  type: 'string',
  isIn: ['active', 'inactive', 'pending']  // Enum-like fields get indexes
},
createdAt: {
  type: 'number',
  autoCreatedAt: true  // Timestamp fields get indexes
}
```

### Manual Index Definition

```javascript
// api/models/Post.js
module.exports = {
  attributes: {
    title: 'string',
    content: 'string',
    authorId: 'number',
    categoryId: 'number',
    publishedAt: 'number'
  },

  indexes: [
    // Single column index
    { columns: ['authorId'] },

    // Composite index
    { columns: ['categoryId', 'publishedAt'] },

    // Partial index with WHERE condition
    {
      columns: ['publishedAt'],
      where: 'published_at IS NOT NULL'
    }
  ]
}
```

## Associations

### One-to-Many

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    name: 'string',
    posts: {
      collection: 'post',
      via: 'author'
    }
  }
}

// api/models/Post.js
module.exports = {
  attributes: {
    title: 'string',
    content: 'string',
    author: {
      model: 'user'
    }
  }
}
```

### Many-to-Many

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    name: 'string',
    roles: {
      collection: 'role',
      via: 'users',
      through: 'userrole'
    }
  }
}

// api/models/Role.js
module.exports = {
  attributes: {
    name: 'string',
    users: {
      collection: 'user',
      via: 'roles',
      through: 'userrole'
    }
  }
}

// api/models/UserRole.js (join table)
module.exports = {
  attributes: {
    user: {
      model: 'user'
    },
    role: {
      model: 'role'
    }
  }
}
```

## Performance Optimizations

### Column Names

Use snake_case for better SQLite performance:

```javascript
firstName: {
  type: 'string',
  columnName: 'first_name'
},
isActive: {
  type: 'boolean',
  columnName: 'is_active'
}
```

### Efficient Data Types

Choose the most efficient data type for your use case:

```javascript
// Use number for timestamps (more efficient than strings)
createdAt: {
  type: 'number',
  autoCreatedAt: true
},

// Use boolean instead of string for flags
isActive: {
  type: 'boolean',
  defaultsTo: true
},

// Use specific maxLength for strings
name: {
  type: 'string',
  maxLength: 100  // More efficient than unlimited length
}
```

## Validation

Sails SQLite supports all Waterline validations:

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 255
    },
    age: {
      type: 'number',
      min: 0,
      max: 150
    },
    status: {
      type: 'string',
      isIn: ['active', 'inactive', 'suspended'],
      defaultsTo: 'active'
    },
    website: {
      type: 'string',
      isURL: true
    },
    bio: {
      type: 'string',
      maxLength: 500,
      allowNull: true
    }
  }
}
```

## Custom Validations

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    username: {
      type: 'string',
      required: true,
      custom: function (value) {
        // Custom validation logic
        return /^[a-zA-Z0-9_]{3,20}$/.test(value)
      }
    }
  },

  // Model-level custom validation
  customToJSON: function () {
    // Remove sensitive data
    return _.omit(this, ['password'])
  },

  // Before create lifecycle callback
  beforeCreate: async function (valuesToSet, proceed) {
    // Hash password before saving
    if (valuesToSet.password) {
      valuesToSet.password = await hashPassword(valuesToSet.password)
    }
    return proceed()
  }
}
```

## Schema Migration

Sails SQLite handles schema changes automatically:

```javascript
// Adding a new field to existing model
module.exports = {
  attributes: {
    // Existing fields...
    name: 'string',
    email: 'string',

    // New field (will be added automatically)
    phoneNumber: {
      type: 'string',
      allowNull: true, // Make nullable for existing records
      columnName: 'phone_number'
    }
  }
}
```

For complex migrations, use the `alter` setting:

```javascript
// config/models.js
module.exports.models = {
  migrate: 'alter', // Use 'safe' in production
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true }
  }
}
```
