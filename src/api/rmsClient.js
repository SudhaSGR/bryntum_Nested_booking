const API_ROOT =
  import.meta.env.VITE_RMS_API_ROOT ||
  '/pronto/rest/i780m_m.rmssched/secureapi'

/**
 * Thin RMS secureapi client.
 * Auth: Vite proxy injects X-Pronto-Token from RMS_TOKEN in .env
 */
export async function rmsGet(endPoint, params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  })

  const query = search.toString()
  const url = `${API_ROOT}/${endPoint}${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Pronto-Content': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`RMS ${endPoint} failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export { API_ROOT }
