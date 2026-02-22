export default {
  lang: 'en-US',
  title: 'Sailscasts Docs',
  description: 'Docs on everything we are working on at Sailscasts',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#fecb05' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Sailscasts Docs' }],
    ['meta', { name: 'og:url', content: 'https://docs.sailscasts.com' }],
    [
      'meta',
      { property: 'twitter:url', content: 'https://docs.sailscasts.com' }
    ],
    ['meta', { property: 'twitter:creator', content: '@Dominus_Kelvin' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://docs.sailscasts.com/social.png'
      }
    ],
    [
      'script',
      { src: 'https://tinylytics.app/embed/vL3m1tsfEzLruHrKLMHB.js', defer: '' }
    ],
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }]
  ],
  themeConfig: {
    search: { provider: 'local' },
    nav: nav(),
    sidebar: {
      '/slipway/': slipwayGuide(),
      '/captain-vane/': captainVaneGuide(),
      '/guppy/': guppyGuide(),
      '/wish/': wishGuide(),
      '/create-sails/': createSailsGuide(),
      '/inertia-sails/': inertiaSailsGuide(),
      '/mail/': mailGuide(),
      '/boring-stack/': boringStackGuide(),
      '/content/': SailsContentGuide(),
      '/sails-stash/': SailsStashGuide(),
      '/sails-pay/': SailsPayGuide(),
      '/sails-flash/': SailsFlashGuide(),
      '/clearance/': SailsClearanceGuide(),
      '/sails-sqlite/': SailsSQLiteGuide(),
      '/connect-sqlite/': ConnectSQLiteGuide(),
      '/sails-quest/': SailsQuestGuide(),
      '/sentry-sails/': SentrySailsGuide(),
      '/pellicule/': pelliculeGuide()
    },
    sitemap: { hostname: 'https://docs.sailscasts.com' },
    editLink: {
      pattern:
        'https://github.com/sailscastshq/docs.sailscasts.com/edit/develop/docs/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sailscastshq/docs.sailscasts.com'
      },
      { icon: 'x', link: 'https://x.com/sailscastshq' },
      { icon: 'discord', link: 'https://sailsjs.com/chat' },
      { icon: 'youtube', link: 'https://youtube.com/@sailscasts' }
    ],
    footer: {
      message: 'All open source projects are released under the MIT License.',
      copyright: 'Copyright © 2022-present The Sailscasts Company'
    }
  }
}

function nav() {
  return [
    { text: 'Commercial', link: '/commercial' },
    { text: 'Open Source', link: '/open-source' },
    { text: 'Courses', link: 'https://sailscasts.com/courses' },
    { text: 'Blog', link: 'https://blog.sailscasts.com' }
  ]
}

function captainVaneGuide() {
  return [
    {
      text: 'Getting started',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/captain-vane/' },
        {
          text: 'What is captain-vane?',
          link: '/captain-vane/what-is-captain-vane'
        },
        { text: 'Installation', link: '/captain-vane/installation' }
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [{ text: 'Basic usage', link: '/captain-vane/basic-usage' }]
    }
  ]
}

function guppyGuide() {
  return [
    {
      text: 'Getting started',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/guppy/' },
        { text: 'What is guppy?', link: '/guppy/what-is-guppy' },
        { text: 'Installation', link: '/guppy/installation' },
        { text: 'Activating guppy', link: '/guppy/activating-guppy' },
        { text: 'Deactivating guppy', link: '/guppy/deactivating-guppy' }
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [{ text: 'Running code', link: '/guppy/running-code' }]
    },
    {
      text: 'Changelogs',
      collapsible: true,
      items: [
        {
          text: 'v1.1.2',
          link: 'https://glink.so/kelvin/guppy/changelogs/v1-1-2'
        },
        {
          text: 'v1.1.1',
          link: 'https://glink.so/kelvin/guppy/changelogs/guppy-v1-1-1'
        },
        {
          text: 'v1.1.0',
          link: 'https://glink.so/kelvin/guppy/changelogs/guppy-v1-1-0'
        },
        {
          text: 'v1.0.1',
          link: 'https://glink.so/kelvin/guppy/changelogs/guppy-v1-0-1'
        },
        {
          text: 'v1.0.0',
          link: 'https://glink.so/kelvin/guppy/changelogs/guppy-v1-0-0'
        },
        { text: 'Changelogs', link: 'https://glink.so/kelvin/guppy/changelogs' }
      ]
    }
  ]
}

function wishGuide() {
  return [
    {
      text: 'Getting started',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/wish/' },
        { text: 'What is Wish?', link: '/wish/what-is-wish' },
        { text: 'Installation', link: '/wish/installation' }
      ]
    },
    {
      text: 'Providers',
      collapsible: true,
      items: [
        { text: 'GitHub', link: '/wish/github' },
        { text: 'Google', link: '/wish/google' }
      ]
    }
  ]
}

function createSailsGuide() {
  return [
    {
      text: 'Getting started',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/create-sails/' },
        {
          text: 'What is create-sails?',
          link: '/create-sails/what-is-create-sails'
        }
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [{ text: 'Basic usage', link: '/create-sails/basic-usage' }]
    }
  ]
}

function inertiaSailsGuide() {
  return [
    {
      text: 'Getting started',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/inertia-sails/' },
        {
          text: 'What is inertia-sails?',
          link: '/inertia-sails/what-is-inertia-sails'
        },
        { text: 'Installation', link: '/inertia-sails/installation' },
        { text: 'Configuration', link: '/inertia-sails/configuration' },
        { text: 'Basic usage', link: '/inertia-sails/basic-usage' }
      ]
    },
    {
      text: 'Responses',
      collapsed: false,
      items: [
        { text: 'Inertia responses', link: '/inertia-sails/responses' },
        { text: 'Redirects', link: '/inertia-sails/redirects' }
      ]
    },
    {
      text: 'Sharing Data',
      collapsed: false,
      items: [
        { text: 'Sharing data', link: '/inertia-sails/sharing-data' },
        { text: 'Flash messages', link: '/inertia-sails/flash-messages' },
        { text: 'Locals', link: '/inertia-sails/locals' }
      ]
    },
    {
      text: 'Props',
      collapsed: false,
      items: [
        { text: 'Once props', link: '/inertia-sails/once-props' },
        { text: 'Deferred props', link: '/inertia-sails/deferred-props' },
        { text: 'Merge props', link: '/inertia-sails/merge-props' },
        { text: 'Optional props', link: '/inertia-sails/optional-props' },
        { text: 'Always props', link: '/inertia-sails/always-props' }
      ]
    },
    {
      text: 'Advanced',
      collapsed: false,
      items: [
        { text: 'Infinite scroll', link: '/inertia-sails/infinite-scroll' },
        {
          text: 'History encryption',
          link: '/inertia-sails/history-encryption'
        },
        { text: 'Root view', link: '/inertia-sails/root-view' },
        { text: 'Asset versioning', link: '/inertia-sails/asset-versioning' }
      ]
    }
  ]
}

function mailGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting Started', link: 'mail/getting-started' },
        { text: 'Configuration', link: 'mail/configuration' }
      ]
    },
    {
      text: 'Transports',
      collapsed: false,
      items: [
        { text: 'SMTP', link: 'mail/smtp-transport' },
        { text: 'Mailtrap', link: 'mail/mailtrap-transport' },
        { text: 'Resend', link: 'mail/resend-transport' },
        { text: 'Local Development', link: 'mail/local-development' }
      ]
    },
    {
      text: 'Writing Emails',
      collapsed: false,
      items: [
        { text: 'Template', link: 'mail/email-template' },
        { text: 'Layout', link: 'mail/email-layout' }
      ]
    },
    {
      text: 'Sending Emails',
      collapsed: false,
      items: [{ text: 'Send Helper', link: 'mail/send-helper' }]
    }
  ]
}

function boringStackGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Why the name', link: 'boring-stack/why-the-name' },
        { text: 'Who is it for', link: 'boring-stack/who-is-it-for' },
        {
          text: "What's in the stack",
          link: 'boring-stack/whats-in-the-stack'
        },
        { text: 'Getting started', link: 'boring-stack/getting-started' }
      ]
    },
    {
      text: 'The Basics',
      collapsed: false,
      items: [
        { text: 'Routing', link: 'boring-stack/routing' },
        { text: 'Navigation', link: 'boring-stack/navigation' },
        { text: 'Pages', link: 'boring-stack/pages' },
        { text: 'Layouts', link: 'boring-stack/layouts' },
        { text: 'Redirects', link: 'boring-stack/redirects' },
        { text: 'Validation', link: 'boring-stack/validation' },
        { text: 'Flash messages', link: 'boring-stack/flash-messages' }
      ]
    },
    {
      text: 'Data & Props',
      collapsed: false,
      items: [
        { text: 'Sharing data', link: 'boring-stack/sharing-data' },
        { text: 'Deferred props', link: 'boring-stack/deferred-props' },
        { text: 'Merging props', link: 'boring-stack/merging-props' },
        { text: 'Once props', link: 'boring-stack/once-props' },
        { text: 'Infinite scroll', link: 'boring-stack/infinite-scroll' },
        { text: 'Locals', link: 'boring-stack/locals' }
      ]
    },
    {
      text: 'Guides',
      collapsed: false,
      items: [
        { text: 'Authentication', link: 'boring-stack/authentication' },
        { text: 'Authorization', link: 'boring-stack/authorization' },
        { text: 'Database', link: 'boring-stack/database' },
        { text: 'Email', link: 'boring-stack/email' },
        { text: 'Session', link: 'boring-stack/session' },
        { text: 'File uploads', link: 'boring-stack/file-uploads' },
        { text: 'Testing', link: 'boring-stack/testing' },
        { text: 'Error handling', link: 'boring-stack/error-handling' }
      ]
    },
    {
      text: 'Templates',
      collapsed: false,
      items: [
        { text: 'Mellow', link: 'boring-stack/mellow' },
        { text: 'Ascent', link: 'boring-stack/ascent' }
      ]
    },
    {
      text: 'Deploy',
      collapsed: false,
      items: [
        { text: 'Slipway', link: 'boring-stack/slipway' },
        { text: 'Render', link: 'boring-stack/render' },
        { text: 'Railway', link: 'boring-stack/railway' },
        { text: 'Coolify', link: 'boring-stack/coolify' }
      ]
    },
    {
      text: 'Configuration',
      collapsed: true,
      items: [
        {
          text: 'Type checking JS files',
          link: 'boring-stack/type-checking-js-files'
        }
      ]
    }
  ]
}

function SailsContentGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Motivation', link: 'content/motivation' },
        { text: 'Getting started', link: 'content/getting-started' }
      ]
    },
    {
      text: 'The Basics',
      collapsed: false,
      items: [
        { text: 'Content collections', link: 'content/collections' },
        { text: 'Querying collections', link: 'content/querying-collections' },
        { text: 'Configuration', link: 'content/configuration' },
        { text: 'Partials', link: 'content/partials' }
      ]
    }
  ]
}

function SailsStashGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [{ text: 'Getting started', link: 'sails-stash/getting-started' }]
    },
    {
      text: 'Stores',
      collapsed: false,
      items: [
        { text: 'Memory', link: 'sails-stash/memory' },
        { text: 'Redis', link: 'sails-stash/redis' },
        { text: 'SQLite', link: 'sails-stash/sqlite' },
        { text: 'Memcached', link: 'sails-stash/memcached' }
      ]
    },
    {
      text: 'The Basics',
      collapsed: false,
      items: [
        { text: 'Cache usage', link: 'sails-stash/cache-usage' },
        { text: 'Configuration', link: 'sails-stash/configuration' }
      ]
    }
  ]
}

function SailsPayGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting started', link: 'sails-pay/getting-started' },
        { text: 'Providers', link: 'sails-pay/providers' }
      ]
    },
    {
      text: 'Payment Providers',
      collapsed: false,
      items: [
        { text: 'Lemon Squeezy', link: 'sails-pay/lemonsqueezy' },
        { text: 'Flutterwave', link: 'sails-pay/flutterwave' },
        { text: 'Paga', link: 'sails-pay/paga' },
        { text: 'Paystack', link: 'sails-pay/paystack' }
      ]
    },
    {
      text: 'Checkout',
      collapsed: false,
      items: [{ text: 'Creating checkouts', link: 'sails-pay/checkout' }]
    },
    {
      text: 'Subscriptions',
      collapsed: false,
      items: [
        { text: 'Retrieving subscriptions', link: 'sails-pay/subscriptions' }
      ]
    }
  ]
}

function SailsFlashGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [{ text: 'Getting started', link: 'sails-flash/getting-started' }]
    }
  ]
}

function SailsClearanceGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting started', link: 'clearance/getting-started' },
        { text: 'Usage', link: 'clearance/usage' }
      ]
    }
  ]
}

function ConnectSQLiteGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting started', link: 'connect-sqlite/getting-started' },
        { text: 'Configuration', link: 'connect-sqlite/configuration' }
      ]
    },
    {
      text: 'Reference',
      collapsed: false,
      items: [{ text: 'API', link: 'connect-sqlite/api' }]
    }
  ]
}

function SailsSQLiteGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting started', link: 'sails-sqlite/getting-started' },
        { text: 'Configuration', link: 'sails-sqlite/configuration' }
      ]
    },
    {
      text: 'Usage',
      collapsed: false,
      items: [
        { text: 'Model definitions', link: 'sails-sqlite/model-definitions' },
        { text: 'Advanced features', link: 'sails-sqlite/advanced-features' },
        {
          text: 'Performance optimization',
          link: 'sails-sqlite/performance-optimization'
        }
      ]
    },
    {
      text: 'Production',
      collapsed: false,
      items: [
        { text: 'Deployment', link: 'sails-sqlite/deployment' },
        { text: 'Monitoring', link: 'sails-sqlite/monitoring' }
      ]
    }
  ]
}

function SailsQuestGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is job scheduling?', link: 'sails-quest/introduction' },
        { text: 'How Quest works', link: 'sails-quest/how-it-works' },
        { text: 'Getting started', link: 'sails-quest/getting-started' },
        { text: 'Configuration', link: 'sails-quest/configuration' }
      ]
    },
    {
      text: 'Writing Jobs',
      collapsed: false,
      items: [
        { text: 'Creating jobs', link: 'sails-quest/creating-jobs' },
        { text: 'Scheduling', link: 'sails-quest/scheduling' },
        { text: 'Job inputs', link: 'sails-quest/job-inputs' }
      ]
    },
    {
      text: 'Managing Jobs',
      collapsed: false,
      items: [
        { text: 'Job management', link: 'sails-quest/job-management' },
        { text: 'Events', link: 'sails-quest/events' },
        { text: 'Examples', link: 'sails-quest/examples' }
      ]
    }
  ]
}

function SentrySailsGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Getting started', link: 'sentry-sails/getting-started' },
        { text: 'Configuration', link: 'sentry-sails/configuration' }
      ]
    },
    {
      text: 'Usage',
      collapsed: false,
      items: [
        { text: 'Capturing errors', link: 'sentry-sails/capturing-errors' },
        { text: 'Context & Breadcrumbs', link: 'sentry-sails/context' }
      ]
    },
    {
      text: 'Advanced',
      collapsed: false,
      items: [{ text: 'Source Maps', link: 'sentry-sails/source-maps' }]
    }
  ]
}

function pelliculeGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/pellicule/' },
        { text: 'What is Pellicule?', link: '/pellicule/what-is-pellicule' },
        { text: 'How It Works', link: '/pellicule/how-it-works' },
        { text: 'Getting Started', link: '/pellicule/getting-started' }
      ]
    },
    {
      text: 'Integrations',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/pellicule/integrations' },
        { text: 'Vite', link: '/pellicule/vite' },
        { text: 'The Boring Stack', link: '/pellicule/boring-stack' },
        { text: 'Rsbuild', link: '/pellicule/rsbuild' },
        { text: 'Laravel', link: '/pellicule/laravel' },
        { text: 'Nuxt', link: '/pellicule/nuxt' },
        { text: 'Quasar', link: '/pellicule/quasar' }
      ]
    },
    {
      text: 'Concepts',
      collapsed: false,
      items: [
        { text: 'Frames', link: '/pellicule/frames' },
        { text: 'Video Config', link: '/pellicule/video-config' },
        { text: 'Sequences', link: '/pellicule/sequences' }
      ]
    },
    {
      text: 'Macros',
      collapsed: false,
      items: [
        { text: 'defineVideoConfig', link: '/pellicule/define-video-config' }
      ]
    },
    {
      text: 'Composables',
      collapsed: false,
      items: [
        { text: 'useFrame', link: '/pellicule/use-frame' },
        { text: 'useVideoConfig', link: '/pellicule/use-video-config' },
        { text: 'useSequence', link: '/pellicule/use-sequence' }
      ]
    },
    {
      text: 'Components',
      collapsed: false,
      items: [{ text: 'Sequence', link: '/pellicule/sequence' }]
    },
    {
      text: 'Animations',
      collapsed: false,
      items: [
        { text: 'Interpolate', link: '/pellicule/interpolate' },
        { text: 'Easing', link: '/pellicule/easing' }
      ]
    },
    {
      text: 'Reference',
      collapsed: false,
      items: [{ text: 'CLI', link: '/pellicule/cli' }]
    },
    {
      text: 'AI',
      collapsed: false,
      items: [{ text: 'Agent Skills', link: '/pellicule/agent-skills' }]
    }
  ]
}

function slipwayGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/slipway/' },
        { text: 'What is Slipway?', link: '/slipway/what-is-slipway' },
        { text: 'Why Slipway?', link: '/slipway/why-slipway' },
        { text: 'The Name', link: '/slipway/the-name' },
        {
          text: 'Philosophy & Architecture',
          link: '/slipway/philosophy-and-architecture'
        }
      ]
    },
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Requirements', link: '/slipway/requirements' },
        { text: 'Server Installation', link: '/slipway/server-installation' },
        { text: 'Initial Setup', link: '/slipway/initial-setup' },
        { text: 'Your First Deploy', link: '/slipway/first-deploy' },
        { text: 'Uninstallation', link: '/slipway/uninstallation' }
      ]
    },
    {
      text: 'Server Administration',
      collapsed: false,
      items: [
        { text: 'Configuration', link: '/slipway/configuration' },
        { text: 'Instance URL', link: '/slipway/instance-url' },
        { text: 'Custom Domain & SSL', link: '/slipway/custom-domain' },
        { text: 'Settings', link: '/slipway/settings' },
        { text: 'Notifications', link: '/slipway/notifications' },
        { text: 'Updates', link: '/slipway/updates' }
      ]
    },
    {
      text: 'CLI',
      collapsed: false,
      items: [
        { text: 'Installation', link: '/slipway/cli-installation' },
        { text: 'Authentication', link: '/slipway/cli-authentication' },
        { text: 'Commands Reference', link: '/slipway/cli-commands' }
      ]
    },
    {
      text: 'Projects',
      collapsed: false,
      items: [
        { text: 'Creating Projects', link: '/slipway/creating-projects' },
        {
          text: 'Project Configuration',
          link: '/slipway/project-configuration'
        },
        { text: 'Git Integration', link: '/slipway/git-integration' }
      ]
    },
    {
      text: 'Deployments',
      collapsed: false,
      items: [
        { text: 'How Deployments Work', link: '/slipway/how-deployments-work' },
        { text: 'Deploy Command', link: '/slipway/deploy-command' },
        { text: 'Deployment Logs', link: '/slipway/deployment-logs' },
        { text: 'Rollbacks', link: '/slipway/rollbacks' },
        { text: 'Auto-Deploy', link: '/slipway/auto-deploy' }
      ]
    },
    {
      text: 'Configuration',
      collapsed: false,
      items: [
        {
          text: 'Environment Variables',
          link: '/slipway/environment-variables'
        },
        {
          text: 'Global Environment Variables',
          link: '/slipway/global-environment-variables'
        },
        { text: 'Secrets', link: '/slipway/secrets' },
        { text: 'File Uploads', link: '/slipway/file-uploads' },
        { text: 'Database Services', link: '/slipway/database-services' },
        {
          text: 'Multi-App Environments',
          link: '/slipway/multi-app'
        }
      ]
    },
    {
      text: 'Platform',
      collapsed: false,
      items: [
        { text: 'Helm', link: '/slipway/helm' },
        { text: 'Bridge', link: '/slipway/bridge' },
        { text: 'Content', link: '/slipway/content' },
        { text: 'Quest', link: '/slipway/quest' },
        { text: 'Dock', link: '/slipway/dock' },
        { text: 'Lookout', link: '/slipway/lookout' },
        { text: 'Bosun', link: '/slipway/bosun' }
      ]
    },
    {
      text: 'Team & Security',
      collapsed: false,
      items: [
        { text: 'Team Management', link: '/slipway/team-management' },
        { text: 'Audit Logs', link: '/slipway/audit-logs' },
        { text: 'Deploy Tokens', link: '/slipway/deploy-tokens' }
      ]
    }
  ]
}
