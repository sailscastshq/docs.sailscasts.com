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
      '/inertia-sails/': inertiaSailsGuide()
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
      { icon: 'discord', link: 'https://discord.com/invite/gbJZuNm' },
      {
        icon: 'youtube',
        link: 'https://www.youtube.com/channel/UCje9Wo6cbh3IERItPbyq1QA'
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
      text: 'Software',
      items: [{ text: 'guppy', link: '/guppy/' }]
    },
    {
      text: 'Open Source',
      items: [
        { text: 'create-sails', link: '/create-sails/' },
        { text: 'inertia-sails', link: '/inertia-sails/' },
        { text: 'wish', link: '/wish/' },
        { text: 'captain-vane', link: '/captain-vane/' }
        // { text: 'sailboat', link: '/sailboat/' },
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
        { text: 'What is wish?', link: '/wish/what-is-wish' },
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
