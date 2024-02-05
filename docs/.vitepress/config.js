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
      {
        src: 'https://tinylytics.app/embed/vL3m1tsfEzLruHrKLMHB.js',
        defer: ''
      }
    ]
  ],
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/captain-vane/': captainVaneGuide(),
      '/guppy/': guppyGuide(),
      '/wish/': wishGuide(),
      '/create-sails/': createSailsGuide(),
      '/inertia-sails/': inertiaSailsGuide(),
      '/mail/': mailGuide(),
      '/boring-stack/': boringStackGuide(),
      '/content/': SailsContentGuide()
    },
    sitemap: {
      hostname: 'https://docs.sailscasts.com'
    },
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
      {
        icon: 'youtube',
        link: 'https://youtube.com/@sailscasts'
      }
    ],
    footer: {
      message: 'All open source projects are released under the MIT License.',
      copyright: 'Copyright © 2022-present The Sailscasts Company'
    },
    algolia: {
      appId: 'MEUVZAVDGZ',
      apiKey: '6c5e9ae85dc5c0672b6df0b2e305f6cb',
      indexName: 'sailscasts'
    }
  }
}

function nav() {
  return [
    {
      text: 'Commercial products',
      items: [
        { text: 'Sailscasts', link: 'https://sailscasts.com' },
        { text: 'Guppy', link: 'https://sailscasts.com/guppy' },
        { text: 'Hagfish', link: 'https://hagfish.io' }
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
        { text: 'Create Sails', link: '/create-sails/' },
        { text: 'Inertia Sails', link: '/inertia-sails/' },
        { text: 'Sails Wish', link: '/wish/' },
        { text: 'Captain Vane', link: '/captain-vane/' },
        { text: 'Sails Mail', link: '/mail/', activeMatch: '/mail/' },
        { text: 'Sails Content', link: '/content/', activeMatch: '/content/' }
      ]
    },
    { text: 'Courses', link: 'https://sailscasts.com/courses' },
    { text: 'Screencasts', link: 'https://sailscasts.com/screencasts' },
    {
      text: 'Blog',
      link: 'https://blog.sailscasts.com'
    }
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
        { text: 'Redirects', link: 'boring-stack/redirects' },
        { text: 'Error handling', link: 'boring-stack/error-handling' },
        { text: 'Sharing data', link: 'boring-stack/sharing-data' }
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
        { text: 'Session', link: 'boring-stack/session' }
      ]
    },
    {
      text: 'Deploy',
      collapsed: false,
      items: [
        {
          text: 'Render',
          link: 'boring-stack/render'
        }
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
