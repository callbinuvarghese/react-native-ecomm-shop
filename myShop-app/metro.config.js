const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for Windows 'node:sea' path issue
// This prevents Metro from trying to create directories with colons
config.resolver.platforms = ['ios', 'android', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
