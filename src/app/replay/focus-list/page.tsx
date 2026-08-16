import { ReplayCourt } from '@/components/replay-court'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

export default function FocusListReplayPage() {
  return <ReplayCourt record={createDemoFlightRecord()} />
}
