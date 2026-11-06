/**
 * unallocated/events.js  (beginner-friendly)
 * ------------------------------------------
 * Fetches unallocated Events from RMS (type 23 = service calls on hold).
 *
 * Use:
 *   import { fetchUnallocatedServiceCallsOnHold } from '../api/unallocated/events'
 */

import { rmsGet } from '../rmsClient'
import { mapRmsEventsToBryntum } from './mapEvents'

/** UNALLOCATED_SERVICE_CALLS_ON_HOLD */
export const UNALLOCATED_SERVICE_CALLS_ON_HOLD = 23

const DEFAULT_PAGE_SIZE = 100

/**
 * Fetch unallocated on-hold service calls (type 23) from RMS Events API.
 */
export async function fetchUnallocatedServiceCallsOnHold({
  top = DEFAULT_PAGE_SIZE,
  skip = 0,
} = {}) {
  // 1) Call API: /Events?$top=100&$skip=0&type=23
  const data = await rmsGet('Events', {
    $top: top,
    $skip: skip,
    type: UNALLOCATED_SERVICE_CALLS_ON_HOLD,
  })

  // 2) Read events from response
  const events = data?.EventsResponse?.events ?? []

  // 3) Map to Bryntum { resources, events }
  return mapRmsEventsToBryntum(events)
}
