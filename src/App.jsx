import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import About from "./pages/about";
import Programs from './pages/Programs'
import Events from './pages/Events'
import Impact from './pages/Impact'
import Stories from './pages/Stories'
import StoryDetail from './pages/StoryDetail'
import Gallery from './pages/Gallery'
import GetInvolved from './pages/GetInvolved'
import Donate from './pages/Donate'
import AlliancePage from './pages/AlliancePage'
import {Toaster} from "sonner";
import ScrollToTop from './components/ScrollToTop'
import WhatsAppFab from './components/WhatsAppFab'
import AdminLayout from './admin/layout/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import AdminTeam from './admin/pages/Team'
import AdminRolesAccess from './admin/pages/RolesAccess'
import AdminComingSoon from './admin/pages/ComingSoon'
import Contacts from './admin/pages/Contacts';
import Application from './admin/pages/Application'
import Donations from './admin/pages/Donations'
import StoriesAdmin from './admin/pages/stories/Stories'

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SplashScreen />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/alliance" element={<AlliancePage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="contacts" element={<Contacts/>} />
          <Route path="partners" element={<AdminComingSoon title="Partners" />} />
          <Route path="events" element={<AdminComingSoon title="Events" />} />
          <Route path="registrations" element={<AdminComingSoon title="Registrations" />} />
          <Route path="applications" element={<Application />} />
          <Route path="stories" element={<StoriesAdmin />} />
          <Route path="gallery" element={<AdminComingSoon title="Gallery" />} />
          <Route path="whatsapp/broadcast" element={<AdminComingSoon title="WhatsApp Broadcast" />} />
          <Route path="whatsapp/inbox" element={<AdminComingSoon title="WhatsApp Inbox" />} />
          <Route path="messages" element={<AdminComingSoon title="Messages" />} />
          <Route path="donations" element={<Donations />} />
          <Route path="impact" element={<AdminComingSoon title="Impact" />} />
          <Route path="reports" element={<AdminComingSoon title="Reports" />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="settings" element={<AdminComingSoon title="Settings" />} />
          <Route path="roles" element={<AdminRolesAccess />} />
        </Route>
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App