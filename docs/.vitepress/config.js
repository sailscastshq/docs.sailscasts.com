export default {
  lang: 'en-US',
  title: 'Sailscasts Docs',
  description: 'Docs on everything we are working on at Sailscasts',
  lastUpdated: true,
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
      pattern: 'https://github.com/sailscastshq/docs.sailscasts.com/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sailscastshq/docs.sailscasts.com' },
      { icon: 'twitter', link: 'https://twitter.com/sailscastshq' },
      { icon: 'discord', link: 'https://discord.com/invite/gbJZuNm' },
      { icon: 'youtube', link: 'https://www.youtube.com/channel/UCje9Wo6cbh3IERItPbyq1QA' }
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
      text: 'Products',
      items: [
        { text: 'guppy', link: '/guppy/' },
      ]
    },
    {
      text: 'Open Source',
      items: [
        { text: 'captain-vane', link: '/captain-vane/' },
        { text: 'sailboat', link: '/sailboat/' },
        { text: 'wish', link: '/wish/' },
        { text: 'inertia-sails', link: '/inertia-sails/' },
        { text: 'create-sails', link: '/create-sails/' }
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
        { text: 'Installation', link: '/captain-vane/installation' },
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [
        { text: 'Basic usage', link: '/captain-vane/basic-usage' }
      ]
    }
  ]
}

function guppyGuide() {
  return [
    {
      text: 'Config',
      items: [
        { text: 'Introduction', link: '/config/introduction' },
        { text: 'App Configs', link: '/config/app-configs' },
        { text: 'Theme Configs', link: '/config/theme-configs' },
        { text: 'Frontmatter Configs', link: '/config/frontmatter-configs' }
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
        { text: 'Introduction', link: '/create-sails/' },
        { text: 'Installation', link: '/create-sails/installation' },
      ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [
        { text: 'Basic usage', link: '/create-sails/basic-usage' }
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
      { text: 'Introduction', link: '/create-sails/' }
    ]
    },
    {
      text: 'Basic usage',
      collapsible: true,
      items: [
        { text: 'Basic usage', link: '/create-sails/basic-usage' }
      ]
    }
  ]
}

function inertiaSailsGuide() {
return []
}
