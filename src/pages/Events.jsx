import React, { useState } from 'react';

// Mock Event Data based on your screenshots
const EVENTS_DATA = [
  {
    id: 'evt-1',
    category: 'PERFORMANCE',
    dateNum: '06',
    dateMonth: 'SEP',
    color: '#EB4C47', // Coral Red
    location: 'NAIROBI',
    title: 'Open Mic',
    description: 'Monthly open-mic where artists air the unsaid: poetry, rap, spoken word. The only rule is to air it out.'
  },
  {
    id: 'evt-2',
    category: 'DIALOGUE',
    dateNum: '20',
    dateMonth: 'SEP',
    color: '#389A51', // Green
    location: 'NAIROBI',
    title: 'Community Dialogue Forum',
    description: 'A guided conversation where lived experience meets policy, with art opening the room to what\'s hard to say.'
  },
  {
    id: 'evt-3',
    category: 'WORKSHOP',
    dateNum: '05',
    dateMonth: 'OCT',
    color: '#E8A850', // Gold
    location: 'NAIROBI',
    title: 'Art Therapy Workshop Series',
    description: 'Hands-on sessions using creative practice for healing, expression and wellbeing.'
  },
  {
    id: 'evt-4',
    category: 'PERFORMANCE',
    dateNum: '26',
    dateMonth: 'NOV',
    color: '#EB4C47', // Coral Red
    location: 'NAIROBI',
    title: 'Heritage Arts Festival',
    description: 'A celebration of African heritage through performance, visual art and cultural exchange.'
  }
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null); // Triggers modal when set
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', whatsAppConsent: true });

  const filteredEvents = activeCategory === 'ALL' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(evt => evt.category === activeCategory);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // API call trigger to Node.js backend (e.g., POST /api/v1/events/register)
    console.log('Submitting Registration:', { eventId: selectedEvent.id, ...formData });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSelectedEvent(null);
      setFormData({ fullName: '', phone: '', whatsAppConsent: true });
    }, 2500);
  };

  return (
    <div className="bg-[#F8F6E9] min-h-screen text-black font-sans">
      
      {/* 1. HERO SECTION (Dark Container) */}
      <section className="bg-[#0D0D0D] text-white px-8 py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight font-serif mb-4">
            EVENTS
          </h1>
          <p className="text-lg md:text-xl text-[#E8A850] italic max-w-xl font-serif">
            Performances, forums, workshops, spaces where things that have been waiting to be said, get said.
          </p>
        </div>
      </section>

      {/* 2. FEATURED / UPCOMING EVENT BLOCK */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 mb-16">
        <span className="text-[#EB4C47] text-xs font-black uppercase tracking-widest block mb-3">
          UPCOMING EVENT
        </span>
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Featured Image Frame */}
          <div className="md:col-span-6 bg-black relative min-h-[300px]">
            <img 
              src="https://via.placeholder.com/600x600/000000/FFFFFF?text=SEMA-ANIKA+FESTIVAL" 
              alt="Featured Event Poster" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Event Summary */}
          <div className="md:col-span-6 p-8 flex flex-col justify-between bg-white">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-2">
                Sema-Anika Festival 2026: Voices of East Africa
              </h2>
              <p className="text-[#EB4C47] font-bold text-sm mb-2">15-18 May 2026</p>
              <p className="text-[#389A51] font-bold text-sm mb-4">Kenya Cultural Centre, Nairobi</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Our flagship annual gathering brings together 150+ regional artists, spoken-word poets, environmentalists and human-rights activists for four days of public theatre, street installations and legislative poetry art.
              </p>
            </div>
            <button 
              onClick={() => setSelectedEvent({ title: 'Sema-Anika Festival 2026: Voices of East Africa' })}
              className="bg-[#EB4C47] text-white font-bold py-3 px-6 uppercase text-sm tracking-wider rounded-md hover:bg-black transition-colors w-fit"
            >
              REGISTER FOR FESTIVAL
            </button>
          </div>
        </div>
      </section>

      {/* 3. OTHER EVENTS FILTERABLE LIST */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <span className="text-[#EB4C47] text-xs font-black uppercase tracking-widest block mb-6">
          OTHER EVENTS
        </span>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-300 pb-3 mb-8 text-xs font-bold uppercase tracking-wider text-gray-500">
          <button 
            onClick={() => setActiveCategory('ALL')} 
            className={`flex items-center gap-2 ${activeCategory === 'ALL' ? 'text-black border-b-2 border-black pb-3 -mb-3.5' : ''}`}
          >
            <span className="w-2.5 h-2.5 bg-black inline-block"></span> ALL
          </button>
          <button 
            onClick={() => setActiveCategory('PERFORMANCE')} 
            className={`flex items-center gap-2 ${activeCategory === 'PERFORMANCE' ? 'text-black border-b-2 border-black pb-3 -mb-3.5' : ''}`}
          >
            <span className="w-2.5 h-2.5 bg-[#EB4C47] inline-block"></span> PERFORMANCE
          </button>
          <button 
            onClick={() => setActiveCategory('DIALOGUE')} 
            className={`flex items-center gap-2 ${activeCategory === 'DIALOGUE' ? 'text-black border-b-2 border-black pb-3 -mb-3.5' : ''}`}
          >
            <span className="w-2.5 h-2.5 bg-[#389A51] inline-block"></span> DIALOGUE
          </button>
          <button 
            onClick={() => setActiveCategory('WORKSHOP')} 
            className={`flex items-center gap-2 ${activeCategory === 'WORKSHOP' ? 'text-black border-b-2 border-black pb-3 -mb-3.5' : ''}`}
          >
            <span className="w-2.5 h-2.5 bg-[#E8A850] inline-block"></span> WORKSHOP
          </button>
        </div>

        {/* Dynamic Event Items */}
        <div className="space-y-4">
          {filteredEvents.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Date Block */}
                <div 
                  className="min-w-[72px] h-[72px] rounded-lg flex flex-col items-center justify-center text-white font-black leading-none"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-2xl">{item.dateNum}</span>
                  <span className="text-xs uppercase tracking-wider mt-1">{item.dateMonth}</span>
                </div>

                {/* Thumbnail Image */}
                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  <img src="https://via.placeholder.com/150" alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Event Details */}
                <div>
                  <div className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: item.color }}>
                    {item.category} • {item.location}
                  </div>
                  <h3 className="text-lg font-bold text-black">{item.title}</h3>
                  <p className="text-gray-500 text-xs mt-1 max-w-xl">{item.description}</p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedEvent(item)}
                className="w-full md:w-auto bg-[#EB4C47] text-white font-bold text-xs uppercase px-6 py-3 rounded hover:bg-black transition-colors"
              >
                REGISTER
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. REGISTRATION MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
            >
              ✕
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-black mb-2">Registration Confirmed!</h3>
                <p className="text-sm text-gray-600">
                  Check your WhatsApp for instant confirmation details and calendar invites.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold text-[#EB4C47] uppercase tracking-widest block mb-1">
                  EVENT REGISTRATION
                </span>
                <h3 className="text-xl font-extrabold text-black mb-4">{selectedEvent.title}</h3>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="First and Last name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-gray-100 border-b-2 border-black p-3 text-sm focus:outline-none focus:bg-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-700">WhatsApp Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-100 border-b-2 border-black p-3 text-sm focus:outline-none focus:bg-gray-200"
                    />
                  </div>

                  <div className="bg-[#389A51]/10 p-3 rounded border border-[#389A51]/30 flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="whatsAppConsent"
                      checked={formData.whatsAppConsent}
                      onChange={(e) => setFormData({...formData, whatsAppConsent: e.target.checked})}
                      className="mt-1 accent-[#389A51]"
                    />
                    <label htmlFor="whatsAppConsent" className="text-xs text-gray-700 leading-tight cursor-pointer">
                      <strong>Receive instant updates via WhatsApp.</strong> Get event reminders 24hrs prior and post-event survey links.
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#EB4C47] text-white font-extrabold py-3 uppercase tracking-wider text-sm rounded hover:bg-black transition-colors"
                  >
                    CONFIRM REGISTRATION
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}