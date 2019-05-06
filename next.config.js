module.exports = (phase, { defaultConfig }) => {
  return {
    publicRuntimeConfig: {
      defaultEnvironmentSettings: 'test',
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
      // XXX https://github.com/evanw/node-source-map-support/issues/155
      config.node = {
        fs: 'empty',
        module: 'empty',
      };
      return config;
    },
  };
};
