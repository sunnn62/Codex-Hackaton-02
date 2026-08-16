import { Suspense } from 'react'

import { FeedbackSession } from '@/components/feedback/feedback-session'

export default function FeedbackSessionPage() {
  return <Suspense fallback={null}><FeedbackSession /></Suspense>
}
