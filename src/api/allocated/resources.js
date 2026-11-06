/**
 * allocated/resources.js  (beginner-friendly)
 * -------------------------------------------
 * Step 1: Call RMS Resources API  (GET /Resources)
 * Step 2: Read resources from the JSON response
 * Step 3: Map them to Bryntum format
 *
 * How to use in AllocatedGrid:
 *   import { fetchResources } from '../api/allocated/resources'
 *   const resources = await fetchResources()
 */

import { rmsGet } from '../rmsClient'
import { mapRmsResourcesToBryntum } from './mapResources'

/** How many resources to load in one call */
const DEFAULT_PAGE_SIZE = 100

/**
 * RMS "context" values (same as main RMS app):
 *  0 = ALL
 *  1 = PROJECT
 *  2 = SERVICE
 *  3 = MAINTENANCE
 *
 * Resources API requires context — without it you get HTTP 400.
 */
export const RMS_CONTEXT = {
  ALL: 0,
  PROJECT: 1,
  SERVICE: 2,
  MAINTENANCE: 3,
}

/**
 * Fetch resources from RMS and return Bryntum-ready rows.
 *
 * @param {object} options
 * @param {number} [options.top=100]     - max rows ($top)
 * @param {number} [options.skip=0]      - pagination offset ($skip)
 * @param {number} [options.context=2]   - SERVICE by default
 * @returns {Promise<Array>} Bryntum resources: [{ id, name, ... }]
 */
export async function fetchResources({
  top = DEFAULT_PAGE_SIZE,
  skip = 0,
  context = RMS_CONTEXT.SERVICE,
} = {}) {
  // 1) Call API: /secureapi/Resources?$top=100&$skip=0&context=2
  const data = await rmsGet('Resources', {
    $top: top,
    $skip: skip,
    context,
  })

  // 2) Pull the array from the response
  //    Shape: { ResourcesResponse: { resources: [ ... ] } }
  const rmsResources = data?.ResourcesResponse?.resources ?? []

  // 3) Convert to Bryntum format and return
  return mapRmsResourcesToBryntum(rmsResources)
}
