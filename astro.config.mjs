import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


export default defineConfig({
  site: 'https://docs.sailscasts.com/',

  integrations: [
    starlight({
      title: 'Sailscasts Docs',
   

      social: {
        github: 'https://github.com/Chisholm-Student-Creative-Collective',
        discord: 'https://discord.gg/PWSA95E',
      },
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Introduction', link: '/intro' },
            { label: 'Next Steps', link: '/next-steps' },
          ],
        },
        {
          label: 'Onboarding',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting Started', link: '/onboarding/join/' },
            { label: 'Code of Conduct', link: '/onboarding/coc/' },
            { label: 'Member & Associate Roles', link: '/onboarding/roles/' },
            { label: 'Canary Program', link: '/onboarding/canary/' },
          ],
        },
        {
          label: 'Our Projects',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Projects Directory', link: '/projects/' },
            //{ label: 'Dorian\'s Scrapbook Theatre', link: '/projects/scrapbook_theatre/' },
          ],
        },
        // {
        //   label: 'Equipment',
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { label: 'Super 8 Camera', link: '/projects/test' },
        //   ],
        // },
      ],
      // customCss: ['/src/master.css'],
    }),
  ],
});