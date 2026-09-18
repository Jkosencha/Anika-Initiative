import { apiRequest } from './api'

export function fetchPartners() {
  return apiRequest('/api/partners')
}

/** payload: { name, category, logoFile? } -- logoFile is a File, not a data URL. */
export function createPartner({ name, category, logoFile }) {
  const body = new FormData()
  body.append('name', name)
  body.append('category', category)
  if (logoFile) body.append('logo', logoFile)
  return apiRequest('/api/partners', { method: 'POST', body })
}

export function updatePartner(id, { name, category, logoFile }) {
  const body = new FormData()
  if (name !== undefined) body.append('name', name)
  if (category !== undefined) body.append('category', category)
  if (logoFile) body.append('logo', logoFile)
  return apiRequest(`/api/partners/${id}`, { method: 'PATCH', body })
}

export function deletePartner(id) {
  return apiRequest(`/api/partners/${id}`, { method: 'DELETE' })
}
