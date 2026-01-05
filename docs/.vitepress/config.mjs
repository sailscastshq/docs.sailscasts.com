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
      '/sails-quest/': SailsQuestGuide()
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
      { icon: 'twitter', link: 'https://twitter.com/sailscastshq' },
      { icon: 'discord', link: 'https://sailscasts.com/chat' },
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
    {
      text: 'Commercial products',
      items: [
        { text: 'Sailscasts', link: 'https://sailscasts.com' },
        { text: 'Hagfish', link: 'https://hagfish.app' },
        { text: 'The African Engineer', link: 'https://africanengineer.com' }
      ]
    },
    {
      text: 'Open Source',
      items: [
        {
          text: 'Boring Stack',
          link: '/boring-stack/',
          activeMatch: '/boring-stack/'
        },
        {
          text: 'Create Sails',
          link: '/create-sails/',
          activeMatch: '/create-sails/'
        },
        {
          text: 'Inertia Sails',
          link: '/inertia-sails/',
          activeMatch: '/inertia-sails/'
        },
        { text: 'Sails Wish', link: '/wish/', activeMatch: '/wish/' },
        {
          text: 'Captain Vane',
          link: '/captain-vane/',
          activeMatch: '/captain-vane/'
        },
        { text: 'Sails Mail', link: '/mail/', activeMatch: '/mail/' },
        { text: 'Sails Content', link: '/content/', activeMatch: '/content/' },
        {
          text: 'Sails Stash',
          link: '/sails-stash/',
          activeMatch: '/sails-stash/'
        },
        { text: 'Sails Pay', link: '/sails-pay/', activeMatch: '/sails-pay/' },
        {
          text: 'Sails Flash',
          link: '/sails-flash/',
          activeMatch: '/sails-flash/'
        },
        {
          text: 'Sails Clearance',
          link: '/clearance/',
          activeMatch: '/clearance/'
        },
        {
          text: 'Sails SQLite',
          link: '/sails-sqlite/',
          activeMatch: '/sails-sqlite/'
        },
        {
          text: 'Sails Quest',
          link: '/sails-quest/',
          activeMatch: '/sails-quest/'
        }
      ]
    },
    { text: 'Courses', link: 'https://sailscasts.com/courses' },
    { text: 'Screencasts', link: 'https://sailscasts.com/screencasts' },
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
      text: 'Basic usage',
      collapsible: true,
      items: [
        { text: 'GitHub OAuth', link: '/wish/github' },
        { text: 'Google OAuth', link: '/wish/google' }
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
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/inertia-sails/' },
        {
          text: 'What is inertia-sails?',
          link: '/inertia-sails/what-is-inertia-sails'
        },
        { text: 'Installation', link: '/inertia-sails/installation' }
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [{ text: 'Basic usage', link: '/inertia-sails/basic-usage' }]
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
        { text: 'Merging props', link: 'boring-stack/merging-props' }
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
        { text: 'File uploads', link: 'boring-stack/file-uploads' }
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
        { text: 'Configuration', link: 'content/configuration' }
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
