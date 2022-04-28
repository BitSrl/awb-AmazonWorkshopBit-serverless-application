module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint'],
  rules: {
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
      "error",
      "single"
  ],
    "no-trailing-spaces": [
        "error",
        {
            "ignoreComments": false,
            "skipBlankLines": false
        }
    ]
  }
}