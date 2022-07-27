/**
 * @type {import('prettier').Config}
 **/
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.cjs',
  svelteSortOrder: 'options-scripts-markup-styles',
  svelteStrictMode: true,
  svelteAllowShorthand: false,
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};
