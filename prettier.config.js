module.exports = {
  plugins: ['prettier-plugin-svelte'],
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: 'docs/klean-ui/sources/**/*.svelte',
      options: {
        semi: true,
        singleQuote: false,
        trailingComma: 'all'
      }
    }
  ]
}
