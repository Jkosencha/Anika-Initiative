import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Team from '../pages/Team';
import RolesAccess from '../pages/RolesAccess';
import Contacts from '../pages/Contacts';
import Application from '../pages/Application';
import Donations from '../pages/Donations';
import AdminGallery from '../pages/AdminGallery';
import Partners from '../pages/Partners';
import Stories from '../pages/stories/Stories';
import Settings from '../pages/Settings';
import ComingSoon from '../pages/ComingSoon';
import { PAGE_ACCESS } from '../access';

export default function AdminRoutes() {
  return (
     <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute allowedRoles={PAGE_ACCESS.dashboard}><Dashboard /></ProtectedRoute>} />
        <Route path="contacts" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.contacts}><Contacts /></ProtectedRoute>} />
        <Route path="partners" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.partners}><Partners /></ProtectedRoute>} />
        <Route path="events" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.events}><ComingSoon title="Events" /></ProtectedRoute>} />
        <Route path="registrations" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.registrations}><ComingSoon title="Registrations" /></ProtectedRoute>} />
        <Route path="applications" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.applications}><Application /></ProtectedRoute>} />
        <Route path="stories" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.stories}><Stories /></ProtectedRoute>} />
        <Route path="gallery" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.gallery}><AdminGallery /></ProtectedRoute>} />
        <Route path="whatsapp/broadcast" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.whatsappBroadcast}><ComingSoon title="WhatsApp Broadcast" /></ProtectedRoute>} />
        <Route path="whatsapp/inbox" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.whatsappInbox}><ComingSoon title="WhatsApp Inbox" /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.messages}><ComingSoon title="Messages" /></ProtectedRoute>} />
        <Route path="donations" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.donations}><Donations /></ProtectedRoute>} />
        <Route path="impact" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.impact}><ComingSoon title="Impact" /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.reports}><ComingSoon title="Reports" /></ProtectedRoute>} />
        <Route path="team" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.team}><Team /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.settings}><Settings /></ProtectedRoute>} />
        <Route path="roles" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.roles}><RolesAccess /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}