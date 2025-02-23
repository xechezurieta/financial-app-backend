import globals from 'globals'
import pluginJs from '@eslint/js'
import neostandard from 'neostandard'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...neostandard(),
	eslintConfigPrettier
]
