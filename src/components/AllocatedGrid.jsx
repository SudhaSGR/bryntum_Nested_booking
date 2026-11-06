import { useEffect, useRef, useState } from 'react'
import {
  BryntumSchedulerPro,
  BryntumSchedulerProProjectModel,
} from '@bryntum/schedulerpro-react'
import { fetchResources } from '../api/allocated'
import './AllocatedGrid.css'

const columns = [
  { text: 'Resources', field: 'name', flex: 1, minWidth: 180 },
]

function getDefaultDateRange() {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 14)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 3)
  endDate.setHours(0, 0, 0, 0)

  return { startDate, endDate }
}

/**
 * Allocated grid — loads RMS Resources API into Bryntum.
 */
function AllocatedGrid(props) {
  const projectRef = useRef(null)
  const [resources, setResources] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const { startDate, endDate } = getDefaultDateRange()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setStatus('loading')
        setError(null)
        // fetchResources() → Resources API → map → [{ id, name, ... }]
        const mapped = await fetchResources()
        if (cancelled) return
        setResources(mapped)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load allocated resources', err)
        setError(err?.message || 'Unknown error')
        setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="allocated-grid">
      <div className="allocated-grid__status">
        {status === 'loading' && 'Loading resources from RMS…'}
        {status === 'ready' && `Loaded ${resources.length} resource(s)`}
        {status === 'error' && `Failed to load resources: ${error}`}
      </div>

      <BryntumSchedulerProProjectModel
        ref={projectRef}
        resources={resources}
      />

      <BryntumSchedulerPro
        project={projectRef}
        columns={columns}
        startDate={startDate}
        endDate={endDate}
        autoAdjustTimeAxis={false}
        rowHeight={40}
        barMargin={5}
        emptyText={
          status === 'loading'
            ? 'Loading…'
            : status === 'error'
              ? 'Failed to load'
              : 'No resources'
        }
        {...props}
      />
    </div>
  )
}

export default AllocatedGrid
