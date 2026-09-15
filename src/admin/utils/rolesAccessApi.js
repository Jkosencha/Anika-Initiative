import { apiRequest } from './api'

/** { leadership: [...], comms: [...], programs: [...], mel: [...] } */
export function fetchRoleResourceMap() {
  return apiRequest('/api/roles-access')
}

export function saveRoleResources(role, resources) {
  return apiRequest(`/api/roles-access/${role}`, { method: 'PUT', body: { resources } })
}
