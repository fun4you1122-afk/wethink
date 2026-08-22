/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    // passkit-generator is ESM-only and ships binary fixtures. Bundling it
    // into the route handler makes Vercel's file tracer walk paths that do
    // not exist in the build output, which fails the deployment after an
    // otherwise clean build. Leaving it external keeps it a plain runtime
    // require and the tracer copies the package as-is.
    serverComponentsExternalPackages: ['passkit-generator'],
  },
}

export default nextConfig
