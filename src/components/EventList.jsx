import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import { fetchEvents, submitRegistration } from '../lib/api';
import { 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Users as UsersIcon, 
  CheckCircle2 as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon
} from 'lucide-react';

const FEATURED_EVENT = {
  id: 'evt-featured',
  pillar: 'PERFORMANCE',
  title: 'Sema-Anika Festival 2026: Voices of East Africa',
  image: '/SEMA%20ANIKA%20POSTER.jpg',
  dateStr: '15-18 May 2026',
  timeStr: '10:00 AM - 8:00 PM EAT',
  location: 'Kenya Cultural Centre, Nairobi',
  seats: '500+ seats',
  description: 'Our flagship annual gathering brings together 150+ regional artists, spoken-word poets, environmentalists and human-rights activists for four days of public theatre, street installations and legislative poetry art.',
  quote: 'When art opens the room, policy learns to listen.'
};

const OTHER_EVENTS = [
  {
    id: 'evt-1',
    pillar: 'PERFORMANCE',
    pillarColor: '#EB4C47',
    badgeBg: 'bg-coral',
    dateNum: '06',
    dateMonth: 'SEP',
    title: 'Open Mic',
    image: '/slim.jpg',
    location: 'Nairobi',
    dateStr: 'Saturday, 06 Sept 2026',
    timeStr: '18:00 EAT',
    seats: '80 seats',
    description: 'Monthly open-mic where artists air the unsaid: poetry, rap, spoken word. The only rule is to air it out.',
    quote: 'Art brings into the open what is hidden, unheard, difficult to express, or too easily ignored.'
  },
  {
    id: 'evt-2',
    pillar: 'DIALOGUE',
    pillarColor: '#2D9CDB',
    badgeBg: 'bg-[#219653]',
    dateNum: '20',
    dateMonth: 'SEP',
    title: 'Community Dialogue Forum',
    image: '/listener.jpg',
    location: 'Nairobi',
    dateStr: 'Sunday, 20 Sept 2026',
    timeStr: '14:00 EAT',
    seats: '120 seats',
    description: "A guided conversation where lived experience meets policy, with art opening the room to what's hard to say.",
    quote: 'Every story aired is a step toward a world where no voice is left unheard.'
  },
  {
    id: 'evt-3',
    pillar: 'WORKSHOP',
    pillarColor: '#F2994A',
    badgeBg: 'bg-[#E2A03F]',
    dateNum: '05',
    dateMonth: 'OCT',
    title: 'Art Therapy Workshop Series',
    image: '/image6.jpg',
    location: 'Nairobi',
    dateStr: 'Monday, 05 Oct 2026',
    timeStr: '10:00 EAT',
    seats: '30 seats',
    description: 'Hands-on sessions using creative practice for healing, expression and wellbeing.',
    quote: 'The stage is a mirror. Poetry is what we do when we refuse to look away.'
  },
  {
    id: 'evt-4',
    pillar: 'PERFORMANCE',
    pillarColor: '#EB4C47',
    badgeBg: 'bg-coral',
    dateNum: '26',
    dateMonth: 'NOV',
    title: 'Heritage Arts Festival',
    image: '/KWAJ.jpg',
    location: 'Nairobi',
    dateStr: 'Thursday, 26 Nov 2026',
    timeStr: '11:00 EAT',
    seats: '300 seats',
    description: 'A celebration of African heritage through performance, visual art and cultural exchange.',
    quote: 'When she speaks, the whole room leans in. That is healing.'
  }
];

const PILLAR_STYLE = {
  PERFORMANCE: { color: '#EB4C47', badge: 'bg-coral' },
  DIALOGUE: { color: '#219653', badge: 'bg-[#219653]' },
  WORKSHOP: { color: '#E2A03F', badge: 'bg-[#E2A03F]' },
};

// Maps the backend /api/events public shape to the card shape used below.
function mapApiEvent(ev) {
  const style = PILLAR_STYLE[ev.pillar] || PILLAR_STYLE.PERFORMANCE;
  const dateMatch = /(\d{1,2})[/\s-]?(\w{3})?/.exec(ev.dateStr || '');
  return {
    id: ev.id,
    pillar: ev.pillar,
    pillarColor: style.color,
    badgeBg: style.badge,
    dateNum: dateMatch?.[1] || '-',
    dateMonth: (dateMatch?.[2] || '').toUpperCase() || '-',
    title: ev.title,
    image: ev.image,
    location: ev.location,
    dateStr: ev.dateStr,
    timeStr: ev.timeStr,
    seats: ev.seats,
    description: ev.description,
    quote: '',
  };
}

export default function EventsList() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [openFormId, setOpenFormId] = useState(null);
  const [formStates, setFormStates] = useState({});
  const [loading, setLoading] = useState({});
  const [successMsg, setSuccessMsg] = useState({});
  const [events, setEvents] = useState(OTHER_EVENTS);

  // Load events from the backend when available; fall back to the static list.
  useEffect(() => {
    fetchEvents().then(({ rows }) => {
      if (rows && rows.length) {
        setEvents(rows.map(mapApiEvent));
      }
    });
  }, []);

  const categories = [
    { name: 'ALL', color: '#000000' },
    { name: 'PERFORMANCE', color: '#EB4C47' },
    { name: 'DIALOGUE', color: '#219653' },
    { name: 'WORKSHOP', color: '#E2A03F' }
  ];

  const filteredEvents = activeTab === 'ALL'
    ? events
    : events.filter(evt => evt.pillar === activeTab);

  const toggleForm = (id) => {
    setOpenFormId(prev => (prev === id ? null : id));
  };

  const handleInputChange = (eventId, field, value) => {
    setFormStates(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  const handleRegister = async (e, eventId) => {
    e.preventDefault();
    const currentForm = formStates[eventId] || { fullName: '', whatsappNumber: '', optIn: true };
    const eventTitle =
      eventId === FEATURED_EVENT.id
        ? FEATURED_EVENT.title
        : (events.find(ev => ev.id === eventId)?.title || 'ANIKA Event');

    setLoading(prev => ({ ...prev, [eventId]: true }));
    try {
      await submitRegistration({
        name: currentForm.fullName,
        phone: currentForm.whatsappNumber,
        eventTitle,
        consent: currentForm.optIn,
        source: 'web',
      });
      setSuccessMsg(prev => ({ ...prev, [eventId]: 'Confirmed! Registration details sent via WhatsApp.' }));
      setFormStates(prev => ({ ...prev, [eventId]: { fullName: '', whatsappNumber: '', optIn: true } }));
    } catch {
      setSuccessMsg(prev => ({ ...prev, [eventId]: 'Could not confirm right now. Please try again.' }));
    } finally {
      setLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="bg-cream min-h-screen text-gray-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <Reveal>
        <section className="relative overflow-hidden bg-charcoal py-16 text-cream">
          <img
            src="/anika-blue-blob.png"
            alt=""
            aria-hidden="true"
            className='absolute -top-10 right-0 w-64 h-64 md:w-80 md:h-80 object-contain pointer-events-none select-none'
          />
          <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6">
            <div>
              <h1 className="font-display text-5xl uppercase md:text-6xl">
                EVENTS
              </h1>
              <p className="mt-4 max-w-md font-editorial text-lg italic text-gold">
                Performances, forums, workshops, spaces where things that have been waiting to be said, get said.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 2. MAIN CONTAINER */}
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">

        {/* 2A. UPCOMING FEATURED EVENT */}
        <Reveal>
        <section>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-3">
            UPCOMING EVENT
          </span>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md grid grid-cols-1 md:grid-cols-12">
            
            {/* Poster Image */}
            <div className="relative h-80 overflow-hidden bg-black md:col-span-5 md:h-104">
              <img 
                src={FEATURED_EVENT.image} 
                alt={FEATURED_EVENT.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details & Action */}
            <div className="flex flex-col justify-between space-y-5 p-6 md:col-span-7 md:p-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                  {FEATURED_EVENT.title}
                </h2>
                <p className="text-xs font-semibold text-coral mt-1">
                  {FEATURED_EVENT.dateStr}
                </p>
                <p className="text-xs font-semibold text-[#219653] mt-0.5">
                  {FEATURED_EVENT.location}
                </p>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  {FEATURED_EVENT.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => toggleForm(FEATURED_EVENT.id)}
                  className="bg-coral hover:bg-[#d43f3a] text-white font-bold text-xs uppercase px-6 py-3 rounded tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  {openFormId === FEATURED_EVENT.id ? 'CLOSE FORM' : 'REGISTER FOR FESTIVAL'}
                  {openFormId === FEATURED_EVENT.id ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Inline Form Drawer for Featured Event */}
          {openFormId === FEATURED_EVENT.id && (
            <div className="-mt-1 rounded-b-lg border-x border-b border-gray-200 bg-white p-6 shadow-md md:p-8">
              {renderRegistrationForm(FEATURED_EVENT.id, formStates, handleInputChange, handleRegister, loading, successMsg)}
            </div>
          )}
        </section>
        </Reveal>


        {/* 2B. OTHER EVENTS SECTION */}
        <Reveal>
        <section className="space-y-6">
          <span className="text-xs font-bold text-coral uppercase tracking-wider block">
            OTHER EVENTS
          </span>

          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-gray-300/60 pb-3">
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
              {categories.map((cat) => {
                const isActive = activeTab === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveTab(cat.name)}
                    className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
                      isActive ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    {cat.name !== 'ALL' && (
                      <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: cat.color }} />
                    )}
                    {cat.name === 'ALL' && isActive && (
                      <span className="w-2 h-2 bg-black inline-block" />
                    )}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event List */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                
                {/* Horizontal Card Row */}
                <div className="flex flex-col justify-between gap-5 p-4 md:flex-row md:items-center md:gap-6 md:p-5">
                  <div className="flex items-center gap-4">
                    
                    {/* Colored Date Badge */}
                    <div className={`${evt.badgeBg} text-white text-center py-3 px-4 rounded-md min-w-16.25 shrink-0`}>
                      <div className="text-2xl font-black leading-none">{evt.dateNum}</div>
                      <div className="text-[10px] font-bold tracking-widest mt-0.5">{evt.dateMonth}</div>
                    </div>

                    {/* Thumbnail */}
                    <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-200 sm:block">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta Details */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: evt.pillarColor }}>
                        {evt.pillar} • {evt.location}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {evt.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-base text-gray-500">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {/* Register Trigger */}
                  <div className="shrink-0 self-end md:self-center">
                    <button
                      onClick={() => toggleForm(evt.id)}
                      className="bg-coral hover:bg-[#d43f3a] text-white text-xs font-bold uppercase px-5 py-2.5 rounded tracking-wider transition-colors inline-flex items-center gap-1.5"
                    >
                      REGISTER
                      {openFormId === evt.id ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Registration Drawer */}
                {openFormId === evt.id && (
                  <div className="border-t border-gray-200 bg-[#FAF9F5] p-5 md:p-8">
                    
                    {/* Rich Meta Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-700 font-medium mb-5 pb-4 border-b border-gray-200">
                      <p className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-coral" /> {evt.dateStr}</p>
                      <p className="flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5 text-gray-500" /> {evt.timeStr}</p>
                      <p className="flex items-center gap-1.5"><MapPinIcon className="w-3.5 h-3.5 text-coral" /> {evt.location}</p>
                      <p className="flex items-center gap-1.5"><UsersIcon className="w-3.5 h-3.5 text-gray-500" /> {evt.seats}</p>
                    </div>

                    {renderRegistrationForm(evt.id, formStates, handleInputChange, handleRegister, loading, successMsg)}
                  </div>
                )}

              </div>
            ))}
          </div>

        </section>
        </Reveal>

      </main>
    </div>
  );
}

// Helper function rendering the form inside drawers
function renderRegistrationForm(eventId, formStates, handleInputChange, handleRegister, loading, successMsg) {
  const currentForm = formStates[eventId] || { fullName: '', whatsappNumber: '', optIn: true };

  if (successMsg[eventId]) {
    return (
      <div className="bg-[#219653]/10 border border-[#219653] p-4 rounded text-center flex items-center justify-center gap-2">
        <CheckIcon className="w-4 h-4 text-[#219653]" />
        <p className="text-xs font-bold text-[#219653]">{successMsg[eventId]}</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleRegister(e, eventId)} className="max-w-2xl space-y-5 rounded-md border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
        FAST REGISTRATION VIA WHATSAPP
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="First and Last Name"
            value={currentForm.fullName}
            onChange={(e) => handleInputChange(eventId, 'fullName', e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-3 text-sm focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">WhatsApp Number *</label>
          <input
            type="tel"
            required
            placeholder="+254 712 345 678"
            value={currentForm.whatsappNumber}
            onChange={(e) => handleInputChange(eventId, 'whatsappNumber', e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-3 text-sm focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded border border-gray-200 bg-[#F8F6E9] p-3">
        <input
          type="checkbox"
          id={`optIn-${eventId}`}
          checked={currentForm.optIn}
          onChange={(e) => handleInputChange(eventId, 'optIn', e.target.checked)}
          className="mt-0.5 accent-[#219653]"
        />
        <label htmlFor={`optIn-${eventId}`} className="text-xs leading-relaxed text-gray-600">
          Receive instant registration updates and event reminders directly on WhatsApp.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading[eventId]}
        className="inline-flex items-center rounded bg-coral px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d43f3a]"
      >
        {loading[eventId] ? 'CONFIRMING...' : 'CONFIRM SEAT'}
      </button>
    </form>
  );
}