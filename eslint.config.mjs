import {defineConfig, globalIgnores} from 'eslint/config';
import pluginReact from '@eslint-react/eslint-plugin';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginNextVitals from 'eslint-config-next/core-web-vitals';
import pluginNextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

const GLOB_IGNORES = ['**/node_modules', '**/.next', '**/*.d.ts'];

const config = defineConfig([
  globalIgnores(GLOB_IGNORES),

  tseslint.configs.recommended,
  pluginReact.configs['recommended'],
  pluginUnicorn.configs.recommended,
  ...pluginNextVitals,
  ...pluginNextTs,

  {
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: 'useAbortableEffect',
        },
      ],
      '@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {allowInterfaces: 'with-single-extends'},
      ],
      'unicorn/no-nested-ternary': 'off',
      // Too many cases where 3rd party library expects null
      'unicorn/no-null': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            args: false,
            dev: false,
            dist: false,
            env: false,
            pkg: false,
            prop: false,
            props: false,
            params: false,
            ref: false,
            src: false,
            utils: false,
          },
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },
]);

export default config;
