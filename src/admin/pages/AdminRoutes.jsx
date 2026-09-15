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
import { RoleAccessProvider, useRoleAccess } from '../access/RoleAccessContext';
import WhatsAppBroadcast from '../pages/WhatsAppBroadcast';
import WhatsAppInbox from '../pages/WhatsAppInbox';
import WhatsAppAssistant from '../pages/WhatsAppAssistant';
import AdminRegistrations from '../pages/Registrations';
import AdminEvents from '../pages/Events';
import Impact from '../pages/Impact';
import Reports from '../pages/Reports';
import Newsletter from '../pages/Newsletter';

function AdminRoutesInner() {
  const { pageAccess, loading } = useRoleAccess();

  // Avoid a flash of "redirected to dashboard" while the real, backend-held
  // access map is still loading -- same reasoning ProtectedRoute already
  // applies to auth loading.
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute allowedRoles={pageAccess.dashboard}><Dashboard /></ProtectedRoute>} />
        <Route path="contacts" element={<ProtectedRoute allowedRoles={pageAccess.contacts}><Contacts /></ProtectedRoute>} />
        <Route path="partners" element={<ProtectedRoute allowedRoles={pageAccess.partners}><Partners /></ProtectedRoute>} />
        <Route path="events" element={<ProtectedRoute allowedRoles={pageAccess.events}><AdminEvents /></ProtectedRoute>} />
        <Route path="registrations" element={<ProtectedRoute allowedRoles={pageAccess.registrations}><AdminRegistrations /></ProtectedRoute>} />
        <Route path="applications" element={<ProtectedRoute allowedRoles={pageAccess.applications}><Application /></ProtectedRoute>} />
        <Route path="stories" element={<ProtectedRoute allowedRoles={pageAccess.stories}><Stories /></ProtectedRoute>} />
        <Route path="gallery" element={<ProtectedRoute allowedRoles={pageAccess.gallery}><AdminGallery /></ProtectedRoute>} />
        <Route path="whatsapp/broadcast" element={<ProtectedRoute allowedRoles={pageAccess.whatsappBroadcast}><WhatsAppBroadcast /></ProtectedRoute>} />
        <Route path="whatsapp/inbox" element={<ProtectedRoute allowedRoles={pageAccess.whatsappInbox}><WhatsAppInbox /></ProtectedRoute>} />
        <Route path="whatsapp/assistant" element={<ProtectedRoute allowedRoles={pageAccess.whatsappAssistant}><WhatsAppAssistant /></ProtectedRoute>} />
        <Route path="donations" element={<ProtectedRoute allowedRoles={pageAccess.donations}><Donations /></ProtectedRoute>} />
        <Route path="impact" element={<ProtectedRoute allowedRoles={pageAccess.impact}><Impact /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={pageAccess.reports}><Reports /></ProtectedRoute>} />
        <Route path="team" element={<ProtectedRoute allowedRoles={pageAccess.team}><Team /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute allowedRoles={pageAccess.settings}><Settings /></ProtectedRoute>} />
        <Route path="roles" element={<ProtectedRoute allowedRoles={pageAccess.roles}><RolesAccess /></ProtectedRoute>} />
        <Route path="newsletter" element={<ProtectedRoute allowedRoles={pageAccess.newsletter}><Newsletter /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function AdminRoutes() {
  return (
    <RoleAccessProvider>
      <AdminRoutesInner />
    </RoleAccessProvider>
  );
}
