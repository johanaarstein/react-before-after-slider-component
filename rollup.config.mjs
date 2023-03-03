import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { swc, minify } from 'rollup-plugin-swc3'
import scss from 'rollup-plugin-scss'

import pkg from './package.json' assert { type: 'json' }

export default [
  {
    input: './types/index.d.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts(),
    ]
  },
  {
    input: './src/index.tsx',
    external: [
      'react',
      'react-dom'
    ],
    output: [
      {
        file: pkg.main,
        format: 'es',
      },
      {
        file: pkg.exports.require,
        format: 'cjs'
      }
    ],
    plugins: [
      scss({
        fileName: 'index.css',
        outputStyle: 'compressed'
      }),
      nodeResolve({
        extensions: ['.js', '.ts'],
        jsnext: true,
        module: true,
      }),
      commonjs(),
      swc(),
      minify(),
      filesize(),
    ]
  }
]
