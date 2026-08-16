'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { loginBrowserAccount, registerBrowserAccount } from '@/lib/browser-auth'

import styles from './auth-screen.module.css'

type AuthMode = 'login' | 'signup'

export function AuthScreen({ mode }: { readonly mode: AuthMode }) {
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isSignup = mode === 'signup'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setIsSubmitting(true)
    const result = isSignup
      ? await registerBrowserAccount({
          name: String(form.get('name') ?? ''),
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
          passwordConfirmation: String(form.get('password-confirmation') ?? ''),
        })
      : await loginBrowserAccount({
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
        })

    if (!result.ok) {
      setStatus(result.message)
      setIsSubmitting(false)
      return
    }

    setStatus(`${result.account.name}님, 프로젝트를 선택해 주세요.`)
    router.push('/replay')
  }

  return <main className={styles.page}><section className={styles.shell}>
    <div className={styles.videoLayer} aria-hidden="true"><video autoPlay className={styles.video} loop muted playsInline src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4" /></div>
    <div className={styles.message}><Link href="/">PersonaFlight</Link><div><h1>사용자 피드백을 받고,<br />성공적인 배포 테스트를<br />마치세요.</h1><p>출시 전 UX 결함을 확인합니다.</p></div></div>
    <div className={styles.card}><div className={styles.cardHeader}><h2>{isSignup ? '회원가입' : '로그인'}</h2><Link href="/">닫기</Link></div><p className={styles.intro}>{isSignup ? '첫 Flight Record를 시작할 준비가 되셨나요?' : '가입한 계정으로 PersonaFlight에 로그인하세요.'}</p>
      <form onSubmit={handleSubmit}>{isSignup ? <label>이름<input name="name" required type="text" /></label> : null}<label>이메일<input name="email" required type="email" /></label><label>비밀번호<input minLength={8} name="password" required type="password" /></label>{isSignup ? <label>비밀번호 확인<input minLength={8} name="password-confirmation" required type="password" /></label> : null}<button disabled={isSubmitting} type="submit">{isSubmitting ? '확인 중...' : isSignup ? '회원가입하고 시작하기' : '로그인하고 시작하기'} <span aria-hidden="true">→</span></button></form>
      <p aria-live="polite" className={styles.status}>{status}</p><p className={styles.switcher}>{isSignup ? '이미 계정이 있으신가요?' : '회원가입을 하시겠습니까?'} <Link href={isSignup ? '/login' : '/signup'}>{isSignup ? '로그인' : '회원가입'}</Link></p>
    </div>
  </section></main>
}
