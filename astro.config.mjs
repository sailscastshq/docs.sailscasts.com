import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


export default defineConfig({

  site: 'https://docs.sailscasts.com/',

  integrations: [

    
  
    starlight({

      title: 'Sailscasts Docs',
   
      
      social: {
        github: 'https://github.com/sailscastshq/docs.sailscasts.com',
        discord: 'https://sailscasts.com/chat',
      },

      sidebar:[
           
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/create-sails/getting-started/introduction/' },
            { label: 'What-is-create-sails?', link: '/create-sails/getting-started/what-is-create-sails/' },
          
          ],

        },

        {
          label: 'Basic Usage',
          items: [
        
            { label: 'Basic Usage', link: '/create-sails/basic-usage/basic-usage' },
          ],
        },

      ],


      
      sidebar: [

        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/captain-vane/getting-started/introduction/' },
            { label: 'Installation', link: '/captain-vane/getting-started/installation/' },
            { label: 'What-is-captain-vane?', link: '/captain-vane/getting-started/what-is-captain-vane/' },
          
          ],

        },

        {
          label: 'Basic Usage',
          items: [
        
            { label: 'Basic Usage', link: '/captain-vane/basic-usage/basic-usage' },
          ],
        },   
       
      ],


          
      sidebar: [

        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/inertia-sails/getting-started/introduction/' },
            { label: 'Installation', link: '/inertia-sails/getting-started/installation/' },
            { label: 'What-is-inertia-sails?', link: '/inertia-sails/getting-started/what-is-inertia-sails/' },
          
          ],

        },

        {
          label: 'Basic Usage',
          items: [
        
            { label: 'Basic Usage', link: '/inertia-sails/basic-usage/basic-usage' },
          ],
        },   
       
      ],


             
      sidebar: [

        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/wish/getting-started/introduction/' },
            { label: 'What-is-wish?', link: '/wish/getting-started/what-is-wish/' },
            { label: 'Installation', link: '/wish/getting-started/installation/' },
          
          ],

        },

        {
          label: 'Basic Usage',
          items: [
        
            { label: 'GitHub OAuth', link: '/wish/basic-usage/github' },
          ],
        },   
       
      ],


                
      sidebar: [

        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/guppy/getting-started/introduction/' },
            { label: 'What-is-guppy?', link: '/guppy/getting-started/what-is-wish/' },
            { label: 'Installation', link: '/guppy/getting-started/installation/' },
            { label: 'Activating guppy', link: '/guppy/getting-started/activating-guppy/' },
            { label: 'Deactivating guppy', link: '/guppy/getting-started/deactivating-guppy/' },
          
          ],

        },

        {
          label: 'Basic Usage',
          items: [
        
            { label: 'GitHub OAuth', link: '/wish/basic-usage/github' },
          ],
        },   
       
      ],
      
      
      

    })
  
  ]

      // customCss: ['/src/master.css'],
   
});
