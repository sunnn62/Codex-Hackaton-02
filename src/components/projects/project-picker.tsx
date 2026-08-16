'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { FiFolder, FiGithub, FiLink } from 'react-icons/fi'

import { RadialCarousel, type GalleryItem } from '@/components/ui/radial-carousel'
import ButtonGroup1 from '@/components/ui/button-group-1'
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
  { id: 'folder', name: '폴더에서 추가', icon: <FiFolder aria-hidden="true" /> },
  { id: 'github', name: 'GitHub 연결', icon: <FiGithub aria-hidden="true" /> },
  { id: 'preview', name: 'Preview URL 추가', icon: <FiLink aria-hidden="true" /> },
]

export function ProjectPicker() {
  const router = useRouter()
  const folderInput = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<readonly Project[]>(PROJECTS)
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null)
  const [notice, setNotice] = useState('원형으로 펼쳐진 프로젝트를 클릭해 Replay Court를 시작하세요.')
  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  useEffect(() => {
    folderInput.current?.setAttribute('webkitdirectory', '')
    folderInput.current?.setAttribute('directory', '')
  }, [])

  function selectProject(item: GalleryItem) {
    const project = projects.find((candidate) => candidate.id === item.id)
    setSelectedProjectId(item.id)
    if (project?.ready) {
      setNotice(`${project.title} 프로젝트를 선택했습니다. 아래 버튼을 눌러 페르소나를 고르세요.`)
      return
    }
    setNotice(`${project?.title ?? '이 프로젝트'}는 아직 Preview 연결을 기다리고 있습니다.`)
  }

  function continueWithProject() {
    if (!selectedProject?.ready) {
      setNotice(`${selectedProject?.title ?? '선택한 프로젝트'}는 아직 Preview 연결을 기다리고 있습니다.`)
      return
    }
    router.push('/replay/focus-list/personas')
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
        <p>프로젝트를 고른 뒤, 아래 선택 버튼으로 페르소나 테스트를 시작합니다.</p>
        <input className={styles.folderInput} multiple onChange={addProject} ref={folderInput} type="file" />
        <div className={styles.actions}>
          <div className={styles.addProject}>
            <ShareSheet
              onShareComplete={chooseAddSource}
              triggerLabel="프로젝트 추가하기"
              users={ADD_SOURCES}
              renderTrigger={({ label, onClick }) => <ButtonGroup1 actionLabel={label} countLabel="3가지 방식" onClick={onClick} />}
            />
          </div>
          {selectedProject && <button className={styles.selectProject} disabled={!selectedProject.ready} onClick={continueWithProject} type="button">
            {selectedProject.ready ? `${selectedProject.title} 프로젝트 선택` : 'Preview 연결 대기'} <span aria-hidden="true">→</span>
          </button>}
        </div>
      </div>
      <div className={styles.orbit}>
        <RadialCarousel centerSize={380} items={[...projects]} onItemSelect={selectProject} radius={150} thumbnailSize={170} />
      </div>
    </section>
    <p className={styles.screenReaderNotice} aria-live="polite">{notice}</p>
  </main>
}
