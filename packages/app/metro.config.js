/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

const reactNativePath = require.resolve('react-native');
const reactNativeFolder = `${
    reactNativePath.split('node_modules/react-native/')[0]
}node_modules/react-native/`;

module.exports = {
    transformer: {
        publicPath: '/assets/dark/magic',
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        })
    },
    resolver: {
        extraNodeModules: require('node-libs-browser'),
        blacklistRE: new RegExp(
            `^((?!${reactNativeFolder.replace(
                '/',
                '\\/'
            )}).)*\\/node_modules\\/react-native\\/.*$`
        )
    },
    server: {
        enhanceMiddleware: (middleware) => {
            return (req, res, next) => {
                if (req.url.startsWith('/assets/dark/magic')) {
                    req.url = req.url.replace('/assets/dark/magic', '/assets');
                } else if (req.url.startsWith('/assets/dark')) {
                    req.url = req.url.replace('/assets/dark', '/assets/..');
                } else if (req.url.startsWith('/assets')) {
                    req.url = req.url.replace('/assets', '/assets/../..');
                }
                return middleware(req, res, next);
            };
        }
    },
    projectRoot: path.resolve(__dirname, '../../')
};
