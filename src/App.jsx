import { Routes, Route } from 'react-router-dom'
import { PartnerProvider } from './features/about/context/PartnerContext'
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
import DonationThankYou from './pages/DonationThankYou'
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
import AdminGallery from './admin/pages/AdminGallery'
import Partners from './admin/pages/Partners'
import StoriesAdmin from './admin/pages/stories/Stories'
import Settings from './admin/pages/Settings'
import AdminEvents from './admin/pages/Events'
import AdminRegistrations from './admin/pages/Registrations'
import WhatsAppBroadcast from './admin/pages/WhatsAppBroadcast'
import WhatsAppInbox from './admin/pages/WhatsAppInbox'
import WhatsAppAssistant from './admin/pages/WhatsAppAssistant'

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
          <Route path="/donate/thank-you" element={<DonationThankYou />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}

function App() {
  return (
    <PartnerProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="contacts" element={<Contacts/>} />
          <Route path="partners" element={<Partners />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="applications" element={<Application />} />
          <Route path="stories" element={<StoriesAdmin />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="whatsapp/broadcast" element={<WhatsAppBroadcast />} />
          <Route path="whatsapp/inbox" element={<WhatsAppInbox />} />
          <Route path="whatsapp/assistant" element={<WhatsAppAssistant />} />
          <Route path="messages" element={<AdminComingSoon title="Messages" />} />
          <Route path="donations" element={<Donations />} />
          <Route path="impact" element={<AdminComingSoon title="Impact" />} />
          <Route path="reports" element={<AdminComingSoon title="Reports" />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="settings" element={<Settings />} />
          <Route path="roles" element={<AdminRolesAccess />} />
        </Route>
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </PartnerProvider>
  )
}

export default App