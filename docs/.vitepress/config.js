export default {
  lang: 'en-US',
  title: 'Sailscasts Docs',
  description: 'Docs on everything we are working on at Sailscasts',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: nav(),
    sidebar: {
      '/captain-vane/': captainVaneGuide(),
      '/guppy/': guppyGuide(),
      '/wish/': wishGuide(),
      '/create-sails/': createSailsGuide(),
      '/inertia-sails/': inertiaSailsGuide(),
      '/mail/': mailGuide()
    },
    sitemap: {
      hostname: 'https://docs.sailscasts.com'
    },
    editLink: {
      pattern:
        'https://github.com/sailscastshq/docs.sailscasts.com/edit/develop/docs/:path',
      text: 'Edit this page on GitHub'
    },
    head: [
      ['meta', { name: 'theme-color', content: '#07162d' }],
      ['meta', { name: 'og:type', content: 'website' }],
      ['meta', { name: 'og:locale', content: 'en' }],
      ['meta', { name: 'og:site_name', content: 'Sailscasts Docs' }],
      [
        'script',
        {
          src: 'https://cdn.usefathom.com/script.js',
          'data-site': 'OTDOQLCI',
          'data-spa': 'auto',
          defer: ''
        }
      ]
    ],
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
      text: 'Commercial projects',
      items: [
        { text: 'Guppy', link: '/guppy/' },
        { text: 'Hagfish', link: '/hagfish/' }
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
        { text: 'create-sails', link: '/create-sails/' },
        { text: 'inertia-sails', link: '/inertia-sails/' },
        { text: 'Wish', link: '/wish/' },
        { text: 'captain-vane', link: '/captain-vane/' },
        { text: 'Mail', link: '/mail/', activeMatch: '/mail/' }
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
