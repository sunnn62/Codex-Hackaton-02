import Link from 'next/link'

import styles from './landing.module.css'

export default function HomePage() {
  return <main className={styles.page} id="top"><section className={styles.hero}>
    <div className={styles.videoLayer} aria-hidden="true"><video autoPlay className={styles.video} loop muted playsInline src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4" /></div>
    <div className={styles.content}><span className={styles.eyebrow}>PRE-RELEASE UX REGRESSION</span><h1>PersonaFlight</h1><p>바이브 코더가 놓친 UX 결함을 재현 가능한 조건으로 발견하고, 증거에 근거한 코드 수정과 동일 조건 replay로 개선을 증명하는 출시 전 UX 회귀 도구입니다.</p><Link className={styles.login} href="/login">로그인 <span aria-hidden="true">→</span></Link></div>
  </section></main>
}
