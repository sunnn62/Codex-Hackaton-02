import type { NextConfig } from 'next'

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubPagesBuild
    ? {
        output: 'export' as const,
        basePath: '/Codex-Hackaton-02',
      }
    : {}),
}

export default nextConfig
