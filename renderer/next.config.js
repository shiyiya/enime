module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) return config;

    return Object.assign(config, {
      target: 'electron-renderer',
    });
  },
};
