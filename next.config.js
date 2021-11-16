// Reference: https://github.com/vercel/next.js/issues/7755#issuecomment-812805708
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  experimental: {
    concurrentFeatures: true
  },
}
