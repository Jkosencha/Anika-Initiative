import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { DEFAULT_PAGE_ACCESS, buildPageAccess } from '../access'
import { fetchRoleResourceMap } from '../utils/rolesAccessApi'

const RoleAccessContext = createContext(null)

/**
 * Loads the real, backend-enforced role -> resource map once per admin
 * session and exposes it in the page-keyed shape nav.js/AdminRoutes.jsx
 * already expect. Replaces the old localStorage-only override system --
 * what this returns is what the server will actually let each role do.
 */
export function RoleAccessProvider({ children }) {
  const { user } = useAuth()
  const [pageAccess, setPageAccess] = useState(DEFAULT_PAGE_ACCESS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setPageAccess(DEFAULT_PAGE_ACCESS)
      setLoading(false)
      return
    }
    try {
      const map = await fetchRoleResourceMap()
      setPageAccess(buildPageAccess(map))
    } catch {
      // Keep the safe built-in defaults rather than locking everyone out
      // because of a network blip.
      setPageAccess(DEFAULT_PAGE_ACCESS)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <RoleAccessContext.Provider value={{ pageAccess, loading, refresh }}>
      {children}
    </RoleAccessContext.Provider>
  )
}

export function useRoleAccess() {
  const ctx = useContext(RoleAccessContext)
  if (!ctx) throw new Error('useRoleAccess must be used within a RoleAccessProvider')
  return ctx
}
