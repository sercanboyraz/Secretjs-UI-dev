const { when, whenDev, whenProd, whenCI, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#503E9D', // primary color for all components
          '@link-color': '#398AB9', // link color
          '@success-color': '#52c41a', // success state color
          '@warning-color': '#faad14', // warning state color
          '@error-color': '#f5222d', // error state color
          '@font-size-base': '14px', // major text font size
          '@heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
          '@text-color': 'rgba(0, 0, 0, 0.65)', // major text color
          '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
          '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
          '@border-radius-base': '2px', // major border radius
          '@border-color-base': '#d9d9d9', // major border color
          '@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
        },
      },
    }
  ],
  webpack: {
    alias: {
    },
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      if (!webpackConfig.plugins) {
        config.plugins = [];
      }
      return webpackConfig;
    },
  },
};
