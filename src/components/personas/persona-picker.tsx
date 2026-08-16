'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import styles from './persona-picker.module.css'

interface Persona {
  readonly id: string
  readonly name: string
  readonly age: number
  readonly mbti: string
  readonly role: string
  readonly trait: string
  readonly interests: string
  readonly avatar: string
  readonly note: string
}

const PERSONAS: readonly Persona[] = [
  {
    id: 'kim-seoyeon', name: '김서연', age: 21, mbti: 'ISFJ', role: '대학생',
    trait: '꼼꼼하게 비교 후 결정, 새로운 서비스 가입을 부담스러워함', interests: '생산성 앱, 학업 관리',
    avatar: '/personas/kim-seoyeon.png', note: '가입 단계에서 필요한 정보가 한 번에 이해되는지 살펴봅니다.',
  },
  {
    id: 'park-jiwoo', name: '박지우', age: 26, mbti: 'ENFP', role: '마케팅 인턴',
    trait: '호기심 많고 트렌드에 민감, 새로운 서비스 체험을 좋아함', interests: 'SNS, 브랜딩, 콘텐츠',
    avatar: '/personas/park-jiwoo.png', note: '새 기능을 처음 발견하는 흐름이 자연스러운지 확인합니다.',
  },
  {
    id: 'lee-sumin', name: '이수민', age: 31, mbti: 'ISTJ', role: '회계사',
    trait: '효율성과 정확성을 중시, 복잡한 UI를 싫어함', interests: '재테크, 업무 자동화',
    avatar: '/personas/lee-sumin.png', note: '핵심 작업까지의 단계와 정보 밀도를 점검합니다.',
  },
  {
    id: 'choi-minjun', name: '최민준', age: 22, mbti: 'INTP', role: '컴퓨터공학과 학생',
    trait: '기능을 깊게 파고드는 성향, 오류 발견에 민감', interests: '개발, AI, 오픈소스',
    avatar: '/personas/choi-minjun.png', note: '기능의 상태 변화와 오류 피드백이 충분한지 봅니다.',
  },
  {
    id: 'jeong-hyeonwoo', name: '정현우', age: 28, mbti: 'ESTP', role: '스타트업 PM',
    trait: '빠른 의사결정 선호, 불필요한 단계를 싫어함', interests: '스타트업, UX, IT 트렌드',
    avatar: '/personas/jeong-hyeonwoo.png', note: '목표를 향한 다음 행동이 즉시 보이는지 확인합니다.',
  },
  {
    id: 'kang-doyoon', name: '강도윤', age: 35, mbti: 'ENTJ', role: '기획팀 팀장',
    trait: '목표 중심적, 생산성 도구를 적극 활용', interests: '프로젝트 관리, 비즈니스',
    avatar: '/personas/kang-doyoon.png', note: '작업 결과와 우선순위를 빠르게 파악할 수 있는지 봅니다.',
  },
  {
    id: 'oh-junhyeok', name: '오준혁', age: 24, mbti: 'ESFP', role: '콘텐츠 크리에이터',
    trait: '직관적인 디자인 선호, 시각적 요소에 민감', interests: '영상 제작, SNS',
    avatar: '/personas/oh-junhyeok.png', note: '시각적 위계와 반응이 직관적인지 확인합니다.',
  },
  {
    id: 'han-jihoon', name: '한지훈', age: 42, mbti: 'ISTP', role: '중소기업 운영자',
    trait: '필요한 기능만 사용, 학습 비용이 큰 서비스를 꺼림', interests: '업무 효율화, AI 도구',
    avatar: '/personas/han-jihoon.png', note: '처음 보는 화면에서도 필요한 기능만 빠르게 찾는지 봅니다.',
  },
]

export function PersonaPicker() {
  const router = useRouter()

  function choosePersona(persona: Persona) {
    router.push(`/replay/focus-list?persona=${persona.id}`)
  }

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/">PersonaFlight</Link>
      <Link className={styles.back} href="/replay">프로젝트 다시 선택하기 <span aria-hidden="true">↗</span></Link>
    </header>

    <section className={styles.intro} aria-labelledby="persona-title">
      <p className={styles.eyebrow}>FOCUSLIST · STEP 01 OF 02</p>
      <h1 id="persona-title">Persona</h1>
      <p>이번 Flight Record에 함께할 페르소나를 선택하세요.</p>
      <small>선택한 페르소나의 관점으로 미션과 3가지 UX 조건을 확인합니다.</small>
    </section>

    <section className={styles.grid} aria-label="테스트 페르소나 목록">
      {PERSONAS.map((persona, index) => <article className={styles.card} key={persona.id}>
        <div className={`${styles.cardShade} ${styles[`shade${index % 4}`]}`} aria-hidden="true" />
        <div className={styles.bubble}>{persona.note}</div>
        <div className={styles.avatar}>
          <Image alt={`${persona.name} 페르소나`} height={230} priority={index < 2} src={persona.avatar} width={230} />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.identity}>{persona.age}세 · {persona.mbti} · {persona.role}</p>
          <h2>{persona.name}</h2>
          <dl>
            <div><dt>TEST TENDENCY</dt><dd>{persona.trait}</dd></div>
            <div><dt>INTERESTS</dt><dd>{persona.interests}</dd></div>
          </dl>
          <button aria-label={`${persona.name} 페르소나로 Replay Court 시작`} onClick={() => choosePersona(persona)} type="button">
            이 페르소나로 시작하기 <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>)}
    </section>

    <p className={styles.disclaimer}>페르소나는 테스트 조건을 살피는 보조 도구이며, 실제 사용자 조사를 대체하지 않습니다.</p>
  </main>
}
