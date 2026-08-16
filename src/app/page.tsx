import { ReplayCourt } from '@/components/replay-court'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

export default function HomePage() {
  return <ReplayCourt record={createDemoFlightRecord()} />
}
