const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    }
  ],
  
  plugins: [
    typescript({ tsconfig: './tsconfig.json' })
  ]
};