module.exports = {
  preset: '@react-native/jest-preset',
  // react navigation and its deps ship untranspiled esm, so they have to be
  // transformed rather than skipped like the rest of node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(?:@?react-native|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};
