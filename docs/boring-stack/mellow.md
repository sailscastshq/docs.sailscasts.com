---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Mellow
titleTemplate: The Boring JavaScript Stack
description: Mellow is the default starter template for The Boring JavaScript Stack. It provides a solid foundation with essential features like complete authentication, OAuth integration, and support for React, Vue, or Svelte.
prev:
  text: File uploads
  link: '/boring-stack/file-uploads'
next:
  text: Ascent
  link: '/boring-stack/ascent'
editLink: true
---

# Mellow

Mellow is the default starter template for The Boring JavaScript Stack. It provides a solid foundation with essential features like complete authentication, OAuth integration, and support for React, Vue, or Svelte.

## What's Included

Mellow includes the essential building blocks for a modern full-stack application:

- **[Sails.js](https://sailsjs.com)** - MVC framework for Node.js with built-in ORM
- **[Inertia.js](https://inertiajs.com)** - Modern monolith approach eliminating API complexity
- **Frontend Framework** - React, Vue, or Svelte support
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Rsbuild](https://rsbuild.dev)** - Fast build tool powered by Rspack (via Sails Shipwright)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# React (default frontend)
npx create-sails@latest my-app --react

# Vue
npx create-sails@latest my-app --vue

# Svelte
npx create-sails@latest my-app --svelte
```

### Quick Start

```bash
cd my-app

# Copy example configuration
cp config/local.js.example config/local.js

# Start development server
npm run dev
```

Visit `http://localhost:1337` to see your application!

## Features Included

### Complete Authentication System

- **Email/Password Authentication** - Traditional login and registration
- **OAuth Integration** - Google OAuth with extensible provider system via Sails Wish
- **Password Reset** - Secure password reset flow with email verification
- **Account Verification** - Email verification system for new accounts
- **Flash Messages** - User feedback system with Sails Flash
- **Session Management** - Redis-backed sessions for production scaling

### Frontend Components

- **Pre-built UI Components** - InputText, InputEmail, InputPassword, InputButton components
- **Google OAuth Button** - Ready-to-use OAuth integration component
- **App Layout System** - Structured layout components for consistent UI
- **Form Validation** - Client and server-side validation patterns

### Backend Foundation

- **User Model** - Complete user management with authentication fields
- **Auth Controllers** - Full authentication flow controllers (signup, login, password reset)
- **Dashboard System** - User dashboard with profile management
- **Email Integration** - Transactional emails via Sails Hook Mail
- **Database Agnostic** - Works with any database via Waterline ORM

### Development Tools

- **Hot Reload** - Modern development experience with Rsbuild
- **Code Formatting** - Prettier with Tailwind plugin pre-configured
- **Testing Setup** - Node.js test runner with Playwright for E2E
- **Socket.io Support** - Real-time capabilities built-in

### Security & Performance

- **CSRF Protection** - Built-in security measures
- **Session Security** - Secure session management
- **Production Ready** - Configured for production deployment
- **Redis Support** - Session and socket scaling with Redis

## Project Structure

```
my-app/
├── api/                    # Sails.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Database models (Waterline ORM)
│   ├── helpers/            # Reusable business logic
│   └── policies/           # Authorization middleware
├── assets/js/              # Frontend code
│   ├── components/         # UI components
│   ├── pages/              # Inertia.js pages
│   └── app.js             # Frontend entry point
├── config/                 # Sails.js configuration
│   └── shipwright.js      # Asset pipeline configuration
└── views/                  # Server-side templates
```

## Development Commands

```bash
# Development with hot reload
npm run dev

# Production server
npm start

# Code formatting
npm run lint          # Check formatting
npm run lint:fix      # Auto-fix formatting

# Testing
npm test              # Run tests

# Sails.js generators
npx sails generate controller welcome
npx sails generate action auth/login
npx sails generate model User
npx sails generate helper format-date
```

## When to Choose Mellow

Choose Mellow when you:

- Want a solid foundation with essential features included
- Need authentication but not advanced features like 2FA or teams
- Prefer to choose your frontend framework (React, Vue, or Svelte)
- Want to build incrementally from a working authentication system
- Are building applications that don't require multi-tenancy
- Need a production-ready starting point without SaaS complexity
- Want to learn The Boring Stack fundamentals with real features

## Comparison with Ascent

| Feature          | Mellow                     | Ascent                        |
| ---------------- | -------------------------- | ----------------------------- |
| Frontend Options | React, Vue, Svelte         | React only                    |
| Authentication   | Complete auth system       | Advanced auth (2FA, WebAuthn) |
| Team Management  | Build your own             | Full multi-tenancy            |
| Billing          | Build your own             | Lemon Squeezy integration     |
| Email System     | Basic transactional emails | Complete email templates      |
| UI Components    | Basic + Tailwind CSS       | PrimeReact + Tailwind         |
| OAuth Providers  | Google (extensible)        | Google + more providers       |
| Complexity       | Foundation ready           | Production-ready SaaS         |

## Next Steps

Once you're comfortable with Mellow, you might want to:

1. **Customize Authentication** - Extend the existing auth system with additional providers
2. **Database Setup** - Connect to PostgreSQL, MySQL, or MongoDB for production
3. **Build Your Features** - Add your application-specific functionality
4. **Custom Styling** - Customize Tailwind configuration and build your design system
5. **Add Team Management** - Implement multi-user functionality if needed
6. **Consider Ascent** - Upgrade to the full-featured SaaS template for advanced features

## Learn More

- [Ascent Template](/boring-stack/ascent) - Production-ready SaaS template
- [Getting Started Guide](/boring-stack/getting-started)
- [Database Configuration](/boring-stack/database)
- [Authentication Guide](/boring-stack/authentication)
