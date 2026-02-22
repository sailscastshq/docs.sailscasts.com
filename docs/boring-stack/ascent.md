---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Ascent
titleTemplate: The Boring JavaScript Stack
description: Ascent is a production-ready SaaS template built on The Boring JavaScript Stack. Available with React or Vue frontends. Ship products with battle-tested technologies and focus on actual real users instead of wrestling with complex build tools.
prev:
  text: Mellow
  link: '/boring-stack/mellow'
next:
  text: Slipway
  link: '/boring-stack/slipway'
editLink: true
---

# Ascent

**Ship products with battle-tested technologies. Say no to chasing JavaScript trends.**

Ascent is a production-ready SaaS template built on The Boring JavaScript Stack. Available with **React** or **Vue** frontends. Focus on shipping to actual real users instead of wrestling with complex build tools and trendy frameworks.

## The Boring Stack Philosophy

- **Focus on Your Product** - Effortlessly focus on what really matters: shipping to actual real users
- **No API Required** - Each page receives the necessary data as props from your Sails backend
- **Battle-Tested Technologies** - Built with reliable, proven technologies that just work
- **Ship Fast** - Iterate quickly and move easily from MVP to scale

## Tech Stack

### Backend

- **[Sails.js](https://sailsjs.com)** - MVC framework for Node.js with built-in ORM (Waterline)
- **[Inertia-Sails](https://github.com/sailscastshq/inertia-sails)** - Sails.js adapter for Inertia.js
- **Database Agnostic** - Works with any database via Waterline ORM
- **Session-based Authentication** - Secure authentication without JWTs
- **Built-in Hooks** - Content management, file uploads, email, payments, and more

### Frontend

Choose between React or Vue for your frontend:

#### React Frontend

- **[React 19](https://react.dev)** - Latest React with modern features and concurrent rendering
- **[Inertia.js](https://inertiajs.com)** - Modern monolith approach eliminating API complexity
- **[PrimeReact](https://primereact.org)** - 80+ production-ready UI components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework for styling PrimeReact components
- **[Rsbuild](https://rsbuild.dev)** - Fast build tool powered by Rspack (via Sails Shipwright)

#### Vue Frontend

- **[Vue 3](https://vuejs.org)** - Progressive JavaScript framework with Composition API
- **[Inertia.js](https://inertiajs.com)** - Modern monolith approach eliminating API complexity
- **[PrimeVue Volt](https://volt.primevue.org)** - 50+ fully customizable, accessible UI components powered by Unstyled PrimeVue and Tailwind CSS v4
- **[Tailwind CSS v4](https://tailwindcss.com)** - Next-generation utility-first CSS framework
- **[Rsbuild](https://rsbuild.dev)** - Fast build tool powered by Rspack (via Sails Shipwright)

### Development & Build Tools

- **[Sails Hook Shipwright](https://github.com/sailscastshq/sails-hook-shipwright)** - Modern asset pipeline with hot reload
- **[Prettier](https://prettier.io)** - Code formatting with Tailwind plugin
- **Node.js Test Runner** - Built-in testing with no additional dependencies
- **[Playwright](https://playwright.dev)** - End-to-end testing framework

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# Create new project with Ascent template (React)
npx create-sails@latest my-saas-app --react --ascent

# Or with Vue
npx create-sails@latest my-saas-app --vue --ascent
```

### Quick Start

```bash
cd my-saas-app

# Copy example configuration
cp config/local.js.example config/local.js

# Start development server
npm run dev
# or
npx sails lift
```

Visit `http://localhost:1337` to see your application running!

## Features Included

### Complete Authentication System

- **Email/Password Authentication** - Traditional login and registration
- **Magic Link Authentication** - Passwordless login via email
- **OAuth Integration** - Google OAuth with extensible provider system
- **Two-Factor Authentication (2FA)**:
  - TOTP (Google Authenticator, Authy)
  - Email-based verification
  - Backup codes for recovery
- **WebAuthn/Passkeys** - Modern biometric authentication
- **Password Reset** - Secure password reset flow
- **Account Verification** - Email verification system

### Team Management & Multi-tenancy

- **Team Creation & Management** - Full team workflow
- **Role-based Access Control** - Team member permissions
- **Team Invitations** - Invite system with email notifications
- **Team Switching** - Seamless context switching between teams
- **Domain Restrictions** - Control team access by email domains

### Subscription & Billing

- **[Lemon Squeezy](https://lemonsqueezy.com) Integration** - Complete payment processing
- **Subscription Management** - Plans, billing, and customer portal
- **Usage-based Billing** - Track and bill based on usage
- **Webhooks** - Real-time payment event handling

### Email & Communication

- **Transactional Emails** - Built-in email templates and delivery
- **Email Templates** - Pre-built templates for auth, billing, teams
- **[Nodemailer](https://nodemailer.com)** - Flexible email delivery
- **Flash Messages** - User feedback system

### Content Management

- **Blog System** - SEO-friendly blog with markdown support
- **Waitlist** - Built-in waitlist functionality for pre-launch
- **Content Hooks** - Extensible content management system

### Security & Performance

- **CSRF Protection** - Built-in CSRF token handling
- **Rate Limiting** - Request rate limiting
- **Security Headers** - Production-ready security configuration
- **Session Management** - Redis-backed sessions for scaling
- **File Uploads** - Secure file upload with S3 integration

### UI/UX Features

- **Responsive Design** - Mobile-first responsive layouts
- **Prime UI + Tailwind** - Rich components (PrimeReact or PrimeVue Volt) styled with utility classes
- **Toast Notifications** - User feedback with Prime UI Toast components
- **Loading States** - Comprehensive loading and error states
- **Form Validation** - Client and server-side validation
- **Accessibility** - WCAG AA compliant components

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
npm test              # Run all tests
npm run test:unit     # Unit tests only

# Sails.js generators
npx sails generate controller auth/signup
npx sails generate action auth/login
npx sails generate model Product
npx sails generate helper format-date
```

## Frontend Examples

Ascent combines Prime UI components with Tailwind's utility classes:

### Authentication Form Example

#### React Frontend

```jsx path=null start=null
import { useForm } from '@inertiajs/react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Card } from 'primereact/card'

export default function LoginForm() {
  const { data, setData, post, processing, errors } = useForm({
    emailAddress: '',
    password: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    post('/login')
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <div>
            <InputText
              placeholder="Email address"
              value={data.emailAddress}
              onChange={(e) => setData('emailAddress', e.target.value)}
              className={`w-full ${errors.emailAddress ? 'p-invalid' : ''}`}
            />
            {errors.emailAddress && (
              <small className="p-error block mt-1">
                {errors.emailAddress}
              </small>
            )}
          </div>

          <div>
            <Password
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          label="Sign In"
          className="w-full"
          loading={processing}
          severity="info"
        />
      </form>
    </Card>
  )
}
```

#### Vue Frontend

```vue path=null start=null
<script setup>
import { useForm } from '@inertiajs/vue3'
import Button from '@/components/button/Button.vue'
import InputText from '@/components/inputtext/InputText.vue'
import Password from '@/components/password/Password.vue'
import Card from '@/components/card/Card.vue'

const form = useForm({
  emailAddress: '',
  password: ''
})

function handleSubmit() {
  form.post('/login')
}
</script>

<template>
  <Card class="mx-auto mt-8 w-full max-w-md">
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
        <h2 class="text-center text-2xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <div class="space-y-4">
          <div>
            <InputText
              v-model="form.emailAddress"
              placeholder="Email address"
              :class="['w-full', { 'p-invalid': form.errors.emailAddress }]"
            />
            <small v-if="form.errors.emailAddress" class="p-error block mt-1">
              {{ form.errors.emailAddress }}
            </small>
          </div>

          <div>
            <Password
              v-model="form.password"
              placeholder="Password"
              :feedback="false"
              toggleMask
              class="w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          label="Sign In"
          class="w-full"
          :loading="form.processing"
          severity="info"
        />
      </form>
    </template>
  </Card>
</template>
```

### Team Management Table

#### React Frontend

```jsx path=null start=null
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'

export default function TeamMembers({ members }) {
  const roleTemplate = (member) => (
    <Tag
      value={member.role}
      severity={member.role === 'owner' ? 'success' : 'info'}
      className="text-xs"
    />
  )

  const actionTemplate = (member) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      size="small"
      onClick={() => removeMember(member.id)}
    />
  )

  return (
    <div className="bg-white rounded-lg border">
      <DataTable
        value={members}
        className="text-sm"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="user.fullName" header="Name" />
        <Column field="user.emailAddress" header="Email" />
        <Column body={roleTemplate} header="Role" />
        <Column body={actionTemplate} header="Actions" />
      </DataTable>
    </div>
  )
}
```

#### Vue Frontend

```vue path=null start=null
<script setup>
import { router } from '@inertiajs/vue3'
import DataTable from '@/components/datatable/DataTable.vue'
import Column from '@/components/column/Column.vue'
import Button from '@/components/button/Button.vue'
import Tag from '@/components/tag/Tag.vue'

defineProps({
  members: Array
})

function removeMember(memberId) {
  router.delete(`/team/members/${memberId}`)
}
</script>

<template>
  <div class="bg-white rounded-lg border">
    <DataTable
      :value="members"
      class="text-sm"
      stripedRows
      responsiveLayout="scroll"
    >
      <Column field="user.fullName" header="Name" />
      <Column field="user.emailAddress" header="Email" />
      <Column header="Role">
        <template #body="{ data }">
          <Tag
            :value="data.role"
            :severity="data.role === 'owner' ? 'success' : 'info'"
            class="text-xs"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            @click="removeMember(data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
```

## Project Structure

```
my-saas-app/
├── api/                    # Sails.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Database models (User, Team, etc.)
│   ├── helpers/            # Reusable business logic
│   └── policies/           # Authorization middleware
├── assets/js/              # Frontend (React or Vue)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Inertia.js pages
│   ├── layouts/            # App layouts
│   └── hooks/              # Custom hooks (React) or composables (Vue)
├── config/                 # Sails.js configuration
├── views/                  # Email templates
├── content/                # Blog and static content
└── tests/                  # Test files
```

## Developer Checklist

Use this checklist to set up your SaaS application:

### Initial Setup

- **Clone/download** the Ascent template
- **Install dependencies** with `npm install`
- **Copy configuration** with `cp config/local.js.example config/local.js`
- **Configure local settings** in `config/local.js`
- **Test the application** runs with `npm run dev`

### Database Configuration

- **Choose your database** (PostgreSQL, MySQL, MongoDB, or stick with Sails Disk for development)
- **Install database adapter** if needed (`sails-postgresql`, `sails-mysql`, `sails-mongo`)
- **Configure connection** in `config/local.js` or `config/datastores.js`
- **Run first migration** with `npx sails lift` (creates tables)

### Authentication Setup

- **Configure email** settings in `config/local.js`
- **Set up OAuth providers** (Google, GitHub) with your client IDs and secrets
- **Configure 2FA settings** (TOTP, email verification)
- **Test auth flows** (signup, login, password reset)

### Payment Integration

- **Set up Lemon Squeezy** account and API keys
- **Configure webhooks** for payment events
- **Set up subscription plans** in Lemon Squeezy dashboard
- **Test payment flows** in sandbox mode

### Email Configuration

- **Choose email provider** (SendGrid, Mailgun, SMTP, or use MailHog for development)
- **Configure email settings** in `config/local.js`
- **Customize email templates** in `views/emails/`
- **Test transactional emails** (welcome, reset, etc.)

### Production Deployment

- **Set up production database** (managed service recommended)
- **Configure Redis** for sessions and caching
- **Set up file storage** (AWS S3 or similar)
- **Configure environment variables** for production
- **Set up monitoring** and error tracking

## When to Choose Ascent

Choose Ascent when you:

- Need a production-ready SaaS foundation
- Want comprehensive authentication and team management
- Require subscription billing integration
- Prefer pre-built components and patterns
- Are building a multi-tenant application
- Want to ship quickly with proven architecture

## Shipping with Warp

Ascent includes a comprehensive `WARP.md` file that provides [Warp](https://warp.dev) AI with detailed context about your project structure, patterns, and conventions. This enables you to leverage AI assistance for rapid customization and development.

### What's in WARP.md

- **Project Architecture** - Complete overview of Sails.js + React/Vue + Prime UI structure
- **Development Patterns** - Established conventions for controllers, models, and components
- **Configuration Guidelines** - Environment setup and deployment patterns
- **Code Examples** - Working patterns for authentication, teams, billing, and more
- **Testing Strategies** - Unit and end-to-end testing approaches

### Using Warp for Customization

With the included WARP.md file, you can ask Warp AI to:

- **Generate new features** following your project's established patterns
- **Customize authentication flows** with context-aware suggestions
- **Build team management features** that integrate seamlessly
- **Add billing integrations** using your existing Lemon Squeezy setup
- **Debug issues** with understanding of your specific architecture
- **Refactor components** while maintaining Prime UI + Tailwind patterns

### Getting Started with Warp

1. **Open your project in [Warp](https://warp.dev)**
2. **Reference the WARP.md file** when asking questions or requesting code generation
3. **Ask context-specific questions** about your Sails.js + React/Vue architecture
4. **Request customizations** that follow your established patterns

Example prompts:

- "Add a new subscription plan management page following the existing team management patterns"
- "Create a custom email template for password resets using the existing email system"
- "Generate a new controller for handling file uploads with proper authentication"

This approach ensures that AI-generated code integrates seamlessly with your existing codebase and follows The Boring Stack's conventions.

## Learn More

- **[Mellow Template](/boring-stack/mellow)** - Minimal starter template
- **[Database Configuration](/boring-stack/database)** - Database setup and configuration
- **[Authentication Guide](/boring-stack/authentication)** - Authentication patterns
- **[Sails.js Documentation](https://sailsjs.com/documentation)** - Backend framework guide
- **[Inertia.js Guide](https://inertiajs.com)** - Modern monolith approach
- **[PrimeReact Components](https://primereact.org)** - React UI component library
- **[PrimeVue Volt Components](https://volt.primevue.org)** - Vue UI component library with Tailwind v4
- **[React 19 Documentation](https://react.dev)** - Latest React features
- **[Vue 3 Documentation](https://vuejs.org)** - Progressive JavaScript framework
