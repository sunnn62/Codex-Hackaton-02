'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import styles from './feedback-session.module.css'

interface SessionPersona {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly avatar: string
  readonly quote: string
}

const PERSONAS: readonly SessionPersona[] = [
  { id: 'kim-seoyeon', name: '김서연', role: '대학생 · ISFJ', avatar: '/personas/kim-seoyeon.png', quote: '저장한 뒤에 결과가 바로 보이면 다음 행동을 결정하기 편해요.' },
  { id: 'park-jiwoo', name: '박지우', role: '마케팅 인턴 · ENFP', avatar: '/personas/park-jiwoo.png', quote: '새 기능을 눌렀을 때 어떤 변화가 생겼는지 빠르게 알고 싶어요.' },
  { id: 'lee-sumin', name: '이수민', role: '회계사 · ISTJ', avatar: '/personas/lee-sumin.png', quote: '한 번의 행동이 저장인지 닫기인지 명확해야 다시 확인하지 않아요.' },
  { id: 'choi-minjun', name: '최민준', role: '컴퓨터공학과 학생 · INTP', avatar: '/personas/choi-minjun-v2.png', quote: '상태가 바뀌는 순간을 확인할 수 있으면 오류를 빠르게 구분할 수 있어요.' },
  { id: 'jeong-hyeonwoo', name: '정현우', role: '스타트업 PM · ESTP', avatar: '/personas/jeong-hyeonwoo.png', quote: '다음 단계가 한눈에 보여야 흐름이 끊기지 않아요.' },
  { id: 'kang-doyoon', name: '강도윤', role: '기획팀 팀장 · ENTJ', avatar: '/personas/kang-doyoon.png', quote: '핵심 결과가 분명하면 검토 시간을 줄일 수 있어요.' },
  { id: 'oh-junhyeok', name: '오준혁', role: '콘텐츠 크리에이터 · ESFP', avatar: '/personas/oh-junhyeok.png', quote: '주요 행동과 완료 상태가 시각적으로 구분되면 좋겠어요.' },
  { id: 'han-jihoon', name: '한지훈', role: '중소기업 운영자 · ISTP', avatar: '/personas/han-jihoon.png', quote: '필요한 기능을 찾은 뒤 결과까지 짧게 확인할 수 있어야 해요.' },
]

const CONDITIONS = [
  'Small viewport에서 저장 버튼의 노출 범위를 점검합니다.',
  '저장 이후 지연되는 피드백이 충분히 보이는지 확인합니다.',
  '모호한 버튼 문구가 행동을 혼동시키지 않는지 확인합니다.',
] as const

const DEFAULT_PERSONA = PERSONAS[0]

export function FeedbackSession() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const persona = PERSONAS.find((item) => item.id === searchParams.get('persona')) ?? DEFAULT_PERSONA

  function finishSession() {
    window.localStorage.setItem('personaflight:focus-list:feedback', JSON.stringify({
      persona: persona.name,
      quote: persona.quote,
      summary: '저장 상태와 다음 행동이 즉시 확인되도록 개선이 필요합니다.',
    }))
    router.push('/replay/focus-list')
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">PersonaFlight</Link>
        <span>ANALYSIS SESSION / PREPARING</span>
      </header>
      <section className={styles.loading} aria-live="polite" aria-labelledby="loading-title">
        <div className={styles.loadingAvatar}><Image alt={`${persona.name} 페르소나`} height={160} src={persona.avatar} width={160} /></div>
        <p className={styles.eyebrow}>PERSONA SIGNALS</p>
        <h1 id="loading-title">{persona.name}의 관점으로<br />피드백을 정리하고 있어요.</h1>
        <p>FocusList 미션을 3가지 공개 조건에서 확인 중입니다.</p>
        <ol className={styles.loadingSteps}>{CONDITIONS.map((condition, index) => <li key={condition}><span>{String(index + 1).padStart(2, '0')}</span>{condition}</li>)}</ol>
      </section>
    </main>
  }

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/">PersonaFlight</Link>
      <Link className={styles.back} href="/replay/focus-list/personas">다른 페르소나 선택 <span aria-hidden="true">↗</span></Link>
    </header>

    <section className={styles.session} aria-labelledby="session-title">
      <aside className={styles.personaPanel}>
        <div className={styles.avatarFrame}><Image alt={`${persona.name} 페르소나`} height={270} priority src={persona.avatar} width={270} /></div>
        <p className={styles.personaMeta}>{persona.role}</p>
        <h2>{persona.name}</h2>
        <div className={styles.quote}><span aria-hidden="true">“</span><p>{persona.quote}</p></div>
        <p className={styles.panelNote}>선택한 페르소나의 관점으로 기록한 세션입니다.</p>
      </aside>

      <article className={styles.feedbackPanel}>
        <div className={styles.feedbackHeader}>
          <div><p className={styles.eyebrow}>FEEDBACK SESSION · COMPLETE</p><h1 id="session-title">{persona.name}의<br />피드백</h1></div>
          <strong>3 CONDITIONS<br />REVIEWED</strong>
        </div>
        <p className={styles.summary}>할 일 저장 미션에서 <b>행동의 결과를 확신하기 어려운 순간</b>이 반복됐습니다. 특히 화면 범위, 응답 대기, 문구 해석에서 다음 행동이 분명하지 않았습니다.</p>

        <div className={styles.feedbackList}>
          <section><div><span>01</span><strong>화면 안의 행동</strong><code>before-touch-small-viewport-evidence</code></div><h3>작은 화면에서는 저장 버튼이 잘려 탭 대상을 확인하기 어렵습니다.</h3><p>버튼을 화면 안에 유지하고, 입력 영역과 분리해 고정하세요.</p></section>
          <section><div><span>02</span><strong>기다림의 근거</strong><code>before-low-patience-delayed-feedback-evidence</code></div><h3>저장 후 완료 상태가 보이지 않아 진행 여부를 판단하기 어렵습니다.</h3><p>저장 중·저장 완료 상태를 같은 위치에 지속적으로 표시하세요.</p></section>
          <section><div><span>03</span><strong>행동의 언어</strong><code>before-reduced-inference-ambiguous-copy-evidence</code></div><h3>“Done”만으로는 저장과 닫기 중 어떤 행동인지 알기 어렵습니다.</h3><p>버튼 이름을 “할 일 저장”으로 바꾸고 결과를 바로 연결하세요.</p></section>
        </div>

        <footer className={styles.nextAction}><div><span>SESSION VERDICT</span><strong>REVIEW REQUIRED</strong></div><button onClick={finishSession} type="button">마치기 <span aria-hidden="true">→</span></button></footer>
      </article>
    </section>
    <p className={styles.disclaimer}>Synthetic conditions are evidence, not a replacement for user research.</p>
  </main>
}
