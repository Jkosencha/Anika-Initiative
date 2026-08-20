import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Users as UsersIcon, 
  ArrowRight as ArrowRightIcon, 
  CheckCircle2 as CheckIcon 
} from 'lucide-react';

const MOCK_EVENTS = [
  {
    id: 'evt-1',
    pillar: 'YOUTH & MIGRATION',
    dateNum: '12',
    dateMonth: 'SEPT',
    title: 'SEMA-ANIKA COMMUNITY DIALOGUE FORUM',
    image: 'https://via.placeholder.com/600x300',
    dateStr: 'Saturday, 12 Sept 2026',
    timeStr: '14:00 EAT',
    location: 'Nairobi Cultural Centre',
    seats: '120 seats',
    description: "ANIKA's flagship dialogue forum — an interactive session using spoken word to explore community safety, mental health and healing.",
    quote: 'Art brings into the open what is hidden, unheard, difficult to express, or too easily ignored.'
  },
  {
    id: 'evt-2',
    pillar: 'YOUTH & MIGRATION',
    dateNum: '24',
    dateMonth: 'SEPT',
    title: 'TRY MY SHOE – YOUTH STORYTELLING LAB',
    image: 'https://via.placeholder.com/600x300',
    dateStr: 'Thursday, 24 Sept 2026',
    timeStr: '10:00 EAT',
    location: 'Kilimani Creative Space, Nairobi',
    seats: '40 seats',
    description: 'A hands-on residency where young storytellers craft and share lived experiences of migration, belonging and host-community relationships.',
    quote: 'Every story aired is a step toward a world where no voice is left unheard.'
  },
  {
    id: 'evt-3',
    pillar: 'EXPRESSIONS',
    dateNum: '03',
    dateMonth: 'OCT',
    title: 'GRIPHON X ANIKA – POETRY & BEAT NIGHT',
    image: 'https://via.placeholder.com/600x300',
    dateStr: 'Saturday, 3 Oct 2026',
    timeStr: '19:00 EAT',
    location: 'The GoDown Arts Centre, Nairobi',
    seats: '200 seats',
    description: 'A curated night of spoken word, live beats and open-mic slots celebrating the power of the spoken word to heal and connect.',
    quote: 'The stage is a mirror. Poetry is what we do when we refuse to look away.'
  },
  {
    id: 'evt-4',
    pillar: 'GENDER EQUALITY',
    dateNum: '21',
    dateMonth: 'NOV',
    title: 'HER STORY – OPEN MIC & HEALING FORUM',
    image: 'https://via.placeholder.com/600x300',
    dateStr: 'Saturday, 21 Nov 2026',
    timeStr: '16:00 EAT',
    location: 'Kenya National Theatre, Nairobi',
    seats: '150 seats',
    description: 'Women and marginalised voices take the mic to share stories, assert agency and shape conversations on gender equality, SRHR and SGBV.',
    quote: 'When she speaks, the whole room leans in. That is healing.'
  }
];

export default function EventsList() {
  const [activePillar, setActivePillar] = useState('ALL');
  const [formStates, setFormStates] = useState({});
  const [loading, setLoading] = useState({});
  const [successMsg, setSuccessMsg] = useState({});

  const pillars = ['ALL PILLARS', 'ARTS & CULTURE', 'YOUTH & MIGRATION', 'EXPRESSIONS', 'GENDER EQUALITY', 'GOVERNANCE'];

  const filteredEvents = activePillar === 'ALL' || activePillar === 'ALL PILLARS'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter(evt => evt.pillar === activePillar);

  const handleInputChange = (eventId, field, value) => {
    setFormStates(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  const handleRegister = (e, eventId) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, [eventId]: true }));

    // Mock API delay for frontend testing
    setTimeout(() => {
      setSuccessMsg(prev => ({ ...prev, [eventId]: 'Confirmed! Check WhatsApp.' }));
      setFormStates(prev => ({ ...prev, [eventId]: { fullName: '', whatsappNumber: '', optIn: true } }));
      setLoading(prev => ({ ...prev, [eventId]: false }));
    }, 800);
  };

  return (
    <div className="py-10 px-4 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PILLAR FILTER TABS */}
        <div className="flex flex-wrap gap-2 justify-start border-b border-gray-300 pb-4">
          {pillars.map((pillar) => {
            const key = pillar === 'ALL PILLARS' ? 'ALL' : pillar;
            const isActive = activePillar === key;
            return (
              <button
                key={pillar}
                onClick={() => setActivePillar(key)}
                className={`px-4 py-2 text-xs font-black tracking-wider uppercase border-2 border-black transition-all ${
                  isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {pillar}
              </button>
            );
          })}
        </div>

        {/* EVENT CARDS */}
        {filteredEvents.map((evt) => {
          const currentForm = formStates[evt.id] || { fullName: '', whatsappNumber: '', optIn: true };
          
          return (
            <div key={evt.id} className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: DETAILS */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white text-center py-1 px-3 font-black">
                    <div className="text-xl leading-none">{evt.dateNum}</div>
                    <div className="text-[10px] tracking-widest">{evt.dateMonth}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#EB4C47] uppercase tracking-widest block">UPCOMING</span>
                    <h2 className="text-xl font-black uppercase text-black leading-tight">{evt.title}</h2>
                  </div>
                </div>

                <div className="border border-black overflow-hidden h-48 bg-gray-100">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                </div>

                <div className="text-xs space-y-1 font-semibold text-gray-700">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#EB4C47]" /> {evt.dateStr}
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="w-3.5 h-3.5 text-gray-500" /> {evt.timeStr}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#EB4C47]" /> {evt.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <UsersIcon className="w-3.5 h-3.5 text-gray-500" /> {evt.seats}
                  </p>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{evt.description}</p>
                <blockquote className="border-l-2 border-[#EB4C47] pl-3 italic text-xs text-gray-800 font-serif">
                  "{evt.quote}"
                </blockquote>
              </div>

              {/* RIGHT COLUMN: INLINE FORM */}
              <div className="lg:col-span-5 bg-[#F9F9F9] border-2 border-black p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-black border-b border-black pb-2 mb-4">
                    REGISTER TO ATTEND
                  </h3>

                  {successMsg[evt.id] ? (
                    <div className="bg-[#389A51]/10 border border-[#389A51] p-4 text-center flex items-center justify-center gap-2">
                      <CheckIcon className="w-4 h-4 text-[#389A51]" />
                      <p className="text-xs font-bold text-[#389A51]">{successMsg[evt.id]}</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleRegister(e, evt.id)} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1">FULL NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="First and Last"
                          value={currentForm.fullName}
                          onChange={(e) => handleInputChange(evt.id, 'fullName', e.target.value)}
                          className="w-full bg-gray-200 border-b-2 border-black p-2.5 text-xs focus:outline-none focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1">WHATSAPP NUMBER *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+254 712 345 678"
                          value={currentForm.whatsappNumber}
                          onChange={(e) => handleInputChange(evt.id, 'whatsappNumber', e.target.value)}
                          className="w-full bg-gray-200 border-b-2 border-black p-2.5 text-xs focus:outline-none focus:bg-white"
                        />
                      </div>

                      <div className="bg-[#EAF5ED] border border-[#389A51] p-2.5 flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`optIn-${evt.id}`}
                          checked={currentForm.optIn}
                          onChange={(e) => handleInputChange(evt.id, 'optIn', e.target.checked)}
                          className="mt-0.5 accent-[#389A51]"
                        />
                        <label htmlFor={`optIn-${evt.id}`} className="text-[10px] text-gray-700 leading-tight">
                          Receive instant registration updates, event reminders, and follow-ups via WhatsApp.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading[evt.id]}
                        className="w-full bg-[#EB4C47] text-white font-black py-3 text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                      >
                        {loading[evt.id] ? (
                          'SUBMITTING...'
                        ) : (
                          <>
                            CONFIRM REGISTRATION
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-gray-300 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">
                  ETHICAL RULE: <span className="text-[#EB4C47]">OPEN, NEVER EXPOSE.</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}