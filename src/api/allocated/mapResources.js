/**
 * allocated/mapResources.js
 * -------------------------
 * Converts RMS "Resources" API objects into Bryntum resource rows.
 *
 * RMS gives us fields like: resourceId, name, description, masterCode...
 * Bryntum needs at least:    id, name
 */

/**
 * Map one RMS resource → one Bryntum resource row
 */
function mapOneResource(rmsResource) {
  return {
    // Bryntum uses "id" to match rows and events
    id: rmsResource.resourceId,

    // Shown in the left column
    name: rmsResource.name || rmsResource.description || rmsResource.resourceId,

    // Extra RMS fields (useful later for columns / tooltips)
    description: rmsResource.description,
    masterCode: rmsResource.masterCode,
    resourceNo: rmsResource.resourceNo,
    type: rmsResource.type,
    typeCode: rmsResource.typeCode,
    group: rmsResource.group,
    groupCode: rmsResource.groupCode,
    engineer: rmsResource.engineer,
    email: rmsResource.email,
    phone: rmsResource.phone,
    mobile: rmsResource.mobile,
  }
}

/**
 * Map a list of RMS resources → Bryntum resources array
 *
 * @param {Array} rmsResources - data.ResourcesResponse.resources
 * @returns {Array} resources ready for BryntumSchedulerProProjectModel
 */
export function mapRmsResourcesToBryntum(rmsResources = []) {
  return rmsResources
    .filter((item) => item && item.resourceId) // skip bad rows
    .map(mapOneResource)
}
