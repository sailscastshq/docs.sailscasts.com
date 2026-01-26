// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ProjectGrid from './components/ProjectGrid.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ProjectGrid', ProjectGrid)
  }
}
