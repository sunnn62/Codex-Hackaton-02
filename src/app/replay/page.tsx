import { ReplayCourt } from '@/components/replay-court'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'
export default function ReplayPage() { return <ReplayCourt record={createDemoFlightRecord()} /> }
