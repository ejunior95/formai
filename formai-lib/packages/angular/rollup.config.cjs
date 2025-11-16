const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.mjs',
      format: 'es', // ES Module
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  // Define quais pacotes não devem ser "embutidos" no seu
  // Eles são "peerDependencies" (dependências de pares)
  external: [
    '@angular/core',
    '@ejunior95/formai-core'
  ]
};