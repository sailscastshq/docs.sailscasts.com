// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './klean-docs.css'
import KleanLayout from './components/KleanLayout.vue'
import ProjectGrid from './components/ProjectGrid.vue'

export default {
  extends: DefaultTheme,
  Layout: KleanLayout,
  enhanceApp({ app }) {
    app.component('ProjectGrid', ProjectGrid)
  }
}
