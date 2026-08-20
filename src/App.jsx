import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from "./pages/about";
import Programs from './pages/Programs'
import Events from './pages/Events'
import Impact from './pages/Impact'
import Stories from './pages/Stories'
import Gallery from './pages/Gallery'
import GetInvolved from './pages/GetInvolved'
import Donate from './pages/Donate'
import {Toaster} from "sonner";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
