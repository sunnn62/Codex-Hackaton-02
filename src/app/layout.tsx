import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'PersonaFlight · Replay Court',
  description:
    '같은 UX 조건으로 실패를 발견하고 수정 후 다시 증명하는 출시 전 베타테스트 플랫폼',
}

interface RootLayoutProps {
  readonly children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
