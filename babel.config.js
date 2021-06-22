module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.png',
        ],
        alias: {
          components: './src/components',
          assets: './src/assets',
          actions: './src/actions',
          reducers: './src/reducers',
          hooks: './src/hooks',
          domain: './src/domain',
          app: './src/',
          i18n: './src/i18n',
          utils: './src/utils',
          mocks: './__mock__',
        },
      },
    ],
  ],
};
