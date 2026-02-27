// Docusaurus plugin for using react-icons (for iOS-like icons)
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-react-icons',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            'react-icons': require.resolve('react-icons'),
          },
        },
      };
    },
  };
};
