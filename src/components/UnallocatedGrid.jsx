import { useEffect, useRef, useState } from 'react'
import {
  BryntumSchedulerPro,
  BryntumSchedulerProProjectModel,
} from '@bryntum/schedulerpro-react'
import { fetchUnallocatedServiceCallsOnHold } from '../api/unallocated'
import './UnallocatedGrid.css'

const columns = [
  { text: 'Description', field: 'name', flex: 1, minWidth: 180 },
  { text: 'Customer', field: 'customerName', width: 160 },
  { text: 'Code', field: 'customerCode', width: 100 },
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
 * Unallocated grid — loads RMS type 23 (service calls on hold) from Events API.
 */
function UnallocatedGrid(props) {
  const projectRef = useRef(null)
  const [resources, setResources] = useState([])
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const { startDate, endDate } = getDefaultDateRange()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setStatus('loading')
        setError(null)
        const mapped = await fetchUnallocatedServiceCallsOnHold()
        if (cancelled) return
        setResources(mapped.resources)
        setEvents(mapped.events)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load unallocated events (type 23)', err)
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
    <div className="unallocated-grid">
      <div className="unallocated-grid__status">
        {status === 'loading' && 'Loading unallocated service calls (type 23)…'}
        {status === 'ready' && `Loaded ${events.length} unallocated event(s)`}
        {status === 'error' && `Failed to load events: ${error}`}
      </div>

      <BryntumSchedulerProProjectModel
        ref={projectRef}
        resources={resources}
        events={events}
      />

      <BryntumSchedulerPro
        project={projectRef}
        columns={columns}
        startDate={startDate}
        endDate={endDate}
        autoAdjustTimeAxis={false}
        rowHeight={40}
        barMargin={5}
        createEventOnDblClick={false}
        eventDragCreateFeature={false}
        eventEditFeature={false}
        taskEditFeature={false}
        cellEditFeature={false}
        dependenciesFeature={false}
        emptyText={
          status === 'loading'
            ? 'Loading…'
            : status === 'error'
              ? 'Failed to load'
              : 'No unallocated events'
        }
        {...props}
      />
    </div>
  )
}

export default UnallocatedGrid
