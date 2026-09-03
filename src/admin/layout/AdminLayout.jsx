import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AccountModal from '../components/AccountModal'
import { lightColors, darkColors } from '../theme'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('admin-theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('admin-theme', theme)
  }, [theme])

  return (
    <div className="flex h-screen overflow-hidden bg-cream font-body text-ink dark:bg-charcoal dark:text-cream">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
          <div className="p-6">
            <Outlet context={{ theme }} />
          </div>
        </main>
      </div>

      {accountOpen && (
        <AccountModal onClose={() => setAccountOpen(false)} colors={theme === 'dark' ? darkColors : lightColors} />
      )}
    </div>
  )
}

export default AdminLayout
