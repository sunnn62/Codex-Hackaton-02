import type { NextConfig } from 'next'

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'
const githubPagesBasePath = isGitHubPagesBuild ? '/Codex-Hackaton-02' : ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
  },
  ...(isGitHubPagesBuild
    ? {
        output: 'export' as const,
        basePath: githubPagesBasePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
}

export default nextConfig
