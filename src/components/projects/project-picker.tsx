'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { RadialCarousel, type GalleryItem } from '@/components/ui/radial-carousel'
import { ShareSheet } from '@/components/ui/share-sheet'

import styles from './project-picker.module.css'

interface Project extends GalleryItem {
  readonly ready: boolean
  readonly detail: string
}

function cardArtwork(title: string, detail: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#F7F7F6"/><circle cx="652" cy="138" r="184" fill="${accent}" opacity=".92"/><path d="M-44 628C144 462 310 564 436 718C510 808 642 804 844 686V844H-44Z" fill="#0A1B33"/><rect x="70" y="80" width="218" height="32" rx="16" fill="#0A1B33" opacity=".13"/><text x="70" y="490" fill="#0A1B33" font-size="73" font-family="Arial, sans-serif" font-weight="700">${title}</text><text x="72" y="540" fill="#526071" font-size="28" font-family="Arial, sans-serif">${detail}</text><text x="72" y="702" fill="#FFFFFF" font-size="25" font-family="Arial, sans-serif" letter-spacing="4">PERSONAFLIGHT</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const PROJECTS: readonly Project[] = [
  { id: 'focus-list', title: 'FocusList', detail: '저장 상태 회귀 검사', ready: true, url: cardArtwork('FocusList', 'Save-state regression', '#9CB8FA') },
  { id: 'orbit-notes', title: 'Orbit Notes', detail: 'Preview 연결 대기', ready: false, url: cardArtwork('Orbit Notes', 'Preview pending', '#C9B8EF') },
  { id: 'form-kit', title: 'FormKit', detail: 'Preview 연결 대기', ready: false, url: cardArtwork('FormKit', 'Preview pending', '#E8C89A') },
  { id: 'daily-drop', title: 'DailyDrop', detail: 'Preview 연결 대기', ready: false, url: cardArtwork('DailyDrop', 'Preview pending', '#B9D9C7') },
]

const ADD_SOURCES = [
  { id: 'folder', name: '폴더에서 추가', avatar: cardArtwork('Folder', 'Choose a local folder', '#9CB8FA') },
  { id: 'github', name: 'GitHub 연결', avatar: cardArtwork('GitHub', 'Coming soon', '#C9B8EF') },
  { id: 'preview', name: 'Preview URL 추가', avatar: cardArtwork('Preview', 'Coming soon', '#E8C89A') },
]

export function ProjectPicker() {
  const router = useRouter()
  const folderInput = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<readonly Project[]>(PROJECTS)
  const [notice, setNotice] = useState('원형으로 펼쳐진 프로젝트를 클릭해 Replay Court를 시작하세요.')

  useEffect(() => {
    folderInput.current?.setAttribute('webkitdirectory', '')
    folderInput.current?.setAttribute('directory', '')
  }, [])

  function selectProject(item: GalleryItem) {
    const project = projects.find((candidate) => candidate.id === item.id)
    if (project?.ready) {
      router.push('/replay/focus-list')
      return
    }
    setNotice(`${project?.title ?? '이 프로젝트'}는 아직 Preview 연결을 기다리고 있습니다.`)
  }

  function addProject(event: ChangeEvent<HTMLInputElement>) {
    const firstFile = event.target.files?.[0]
    if (!firstFile) return

    const folderName = firstFile.webkitRelativePath.split('/')[0] || '새 프로젝트'
    const projectId = `local-${folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    setProjects((current) => current.some((project) => project.id === projectId)
      ? current
      : [...current, {
          id: projectId,
          title: folderName,
          detail: 'Preview 연결 대기',
          ready: false,
          url: cardArtwork(folderName, 'Preview pending', '#B8D7CE'),
        }])
    setNotice(`${folderName} 폴더를 프로젝트 목록에 추가했습니다. Preview 연결 후 검증을 시작할 수 있습니다.`)
    event.target.value = ''
  }

  function chooseAddSource(source: { readonly id: string; readonly name: string }) {
    if (source.id === 'folder') {
      folderInput.current?.click()
      return
    }
    setNotice(`${source.name} 방식은 다음 데모 단계에서 연결됩니다.`)
  }

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/">PersonaFlight</Link>
      <span>PROJECT SELECT / DEMO MODE</span>
    </header>
    <section className={styles.content} aria-labelledby="project-picker-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>YOUR PREFLIGHT DESK</p>
        <h1 id="project-picker-title">어떤 프로젝트를<br />검증할까요?</h1>
        <p>프로젝트를 선택하면, 준비된 미션과 3가지 조건으로 Replay Court를 시작합니다.</p>
        <input className={styles.folderInput} multiple onChange={addProject} ref={folderInput} type="file" />
        <div className={styles.addProject}><ShareSheet onShareComplete={chooseAddSource} triggerLabel="프로젝트 추가하기" users={ADD_SOURCES} /></div>
      </div>
      <div className={styles.orbit}>
        <RadialCarousel centerSize={380} items={[...projects]} onItemSelect={selectProject} radius={250} thumbnailSize={104} />
      </div>
      <div className={styles.footer}>
        <div><span className={styles.statusDot} aria-hidden="true" /> <strong>FocusList</strong><span> · 1개 프로젝트 검증 준비 완료</span></div>
        <p aria-live="polite">{notice}</p>
      </div>
    </section>
  </main>
}
