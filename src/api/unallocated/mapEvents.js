/**
 * unallocated/mapEvents.js
 * ------------------------
 * Map RMS EventsResponse.events → Bryntum resources + events.
 */

/** Strip RMS Date(yyyy-mm-dd) wrapper → yyyy-mm-dd */
function formatDateString(date) {
  if (!date) return ''
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10)
  }
  return String(date).replace('Date(', '').replace(')', '')
}

function buildEventName(event) {
  if (event.customEventDescription) return String(event.customEventDescription)
  if (event.description2) {
    return `${event.description1 ?? ''} - ${event.description2}`
  }
  return String(event.description1 ?? event.resourceId ?? '')
}

/**
 * Map RMS EventsResponse.events → Bryntum resources + events (type 23 shape).
 */
export function mapRmsEventsToBryntum(rmsEvents = []) {
  const resources = []
  const events = []

  for (const event of rmsEvents) {
    const id = event.resourceId
    if (!id) continue

    const startDateRaw = formatDateString(event.startDate)
    const startDate =
      startDateRaw && event.startTime
        ? new Date(`${startDateRaw} ${event.startTime}`)
        : startDateRaw
          ? new Date(startDateRaw)
          : new Date()

    const name = buildEventName(event)
    const type = Number(event.type)

    resources.push({
      id,
      name,
      customerName: event.customerName,
      customerCode: event.customerCode,
      description1: event.description1,
      description2: event.description2,
      type,
      owner: event.owner,
      key1: event.key1,
      key2: event.key2,
    })

    events.push({
      id,
      resourceId: id,
      name,
      startDate,
      duration: event.duration,
      durationUnit: event.durationScale || 'hour',
      type,
      eventColor: event.eventColor,
      eventStyle: event.duration ? event.eventStyle : undefined,
      icon: event.icon,
      key1: event.key1,
      key2: event.key2,
      customerName: event.customerName,
      customerCode: event.customerCode,
      address: event.address,
      resizable: event.resizable !== 'false',
    })
  }

  return { resources, events }
}
