/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@runwayml/avatars-node-rpc')
    }
    return config
  },
}
module.exports = nextConfig
