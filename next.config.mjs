/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Enable Webpack 5
    config.experiments = { ...config.experiments, topLevelAwait: true };

    // Optional: Adjust other Webpack settings for better debugging
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }

    return config;
  },
  reactStrictMode: true, // Helps with debugging React-related issues
  productionBrowserSourceMaps: true, // Enables source maps in production to help with debugging
};

export default nextConfig;
