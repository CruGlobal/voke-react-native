/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: false,
        resetCache: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'],
  },
};
