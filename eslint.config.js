import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
export default tseslint.config(
  { ignores: ['dist'] },
  {
    //这样就启用了 prettier/prettier 规则，也启用 eslint-config-prettier 配置(关闭 Prettier 和 ESLint 规则冲突)
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort':simpleImportSort
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/exports':'error',
      'simple-import-sort/imports':[
        'error',
        {
          groups:[
            [
              "^(node|vite)",
              "^react",
              "^@?\\w",
              "^@/components",
              "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
            "^@(utils|store|hooks|api|router)",
            ],
            [
              "antd/locale/zh_CN", "dayjs/locale/zh-cn"
            ],
            [
              "^.+\\.s?css$"
            ]
          ]
        }
      ]
    },
  },
)
