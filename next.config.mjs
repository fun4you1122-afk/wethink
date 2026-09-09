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

  async headers() {
    return [
      {
        // The profile PDF previews inline by default, which is what you want
        // when someone taps a link on a phone. But in-app browsers, the ones
        // inside WhatsApp and Instagram, render it with no save control at
        // all, so ?download=1 on the same URL forces it to the file system.
        source: '/WeThink-Company-Profile.pdf',
        has: [{ type: 'query', key: 'download' }],
        headers: [
          {
            key: 'Content-Disposition',
            value: 'attachment; filename="WeThink-Company-Profile.pdf"',
          },
        ],
      },
    ]
  },
}

export default nextConfig
