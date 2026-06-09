import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dev-dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
  // Design-system drift guardrail: no hex/rgb/hsl literals in component code.
  // Colors must come from src/design/tokens/** or CSS custom properties.
  // src/design/tokens/** and top-level config files are exempt as they define
  // the canonical values.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/design/tokens/**',
      'src/**/*.test.{ts,tsx}',
      'src/**/__tests__/**',
    ],
    rules: {
      'no-restricted-syntax': ['warn',
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}(?:[0-9a-fA-F]{2})?$/]",
          message: 'Use a design token from src/design/tokens/** or a CSS custom property instead of a hex literal.',
        },
        {
          selector: "Literal[value=/^rgb[a]?\\(/]",
          message: 'Use a design token from src/design/tokens/** or a CSS custom property instead of rgb()/rgba().',
        },
        {
          selector: "Literal[value=/^hsl[a]?\\(/]",
          message: 'Use a design token from src/design/tokens/** or a CSS custom property instead of hsl()/hsla().',
        },
      ],
    },
  },
])
