const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva work
    return config;
  },
};

module.exports = nextConfig;
