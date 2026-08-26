import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Handshake,
  Heart,
  Users,
  Send,
  Mic,
  Mail,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const roles = [
  {
    id: "artist",
    label: "Artist or Creative",
    icon: Mic,
    subject: "artist",
    prompt: "Tell us about your practice and what you're applying for.",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    icon: Users,
    subject: "volunteer",
    prompt: "Tell us how you'd like to give your time.",
  },
  {
    id: "partner",
    label: "Partner or CSO",
    icon: Handshake,
    subject: "partnership",
    prompt: "Tell us about your organisation and the collaboration you have in mind.",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: Mail,
    subject: "newsletter",
    prompt: "",
  },
];

const roleColors = {
  artist: {
    bg: "bg-[#eb4c47]/10",
    border: "border-[#eb4c47]",
    ring: "ring-[#eb4c47]",
    text: "text-[#eb4c47]",
    button: "bg-[#eb4c47] hover:bg-[#d43d3a]",
    icon: "text-[#eb4c47]",
    box: "bg-[#eb4c47]",
  },
  volunteer: {
    bg: "bg-green-50",
    border: "border-green-500",
    ring: "ring-green-500",
    text: "text-green-700",
    button: "bg-green-600 hover:bg-green-700",
    icon: "text-green-600",
    box: "bg-green-500",
  },
  partner: {
    bg: "bg-orange-50",
    border: "border-orange-500",
    ring: "ring-orange-500",
    text: "text-orange-700",
    button: "bg-orange-600 hover:bg-orange-700",
    icon: "text-orange-600",
    box: "bg-orange-500",
  },
  newsletter: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    ring: "ring-blue-500",
    text: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
    icon: "text-blue-600",
    box: "bg-blue-500",
  },
};

const subjectOptions = [
  { value: "volunteer", label: "Volunteer Sign-up" },
  { value: "partnership", label: "Partnership Enquiry" },
  { value: "artist", label: "Artist Application / Residency" },
  { value: "newsletter", label: "Newsletter Subscription" },
  { value: "event", label: "Event Participation" },
  { value: "other", label: "Other" },
];

const GetInvolved = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    country: "",
    subject: "",
    message: "",
  });
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("artist");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewsletter = selectedRole === "newsletter";
  const currentColors = roleColors[selectedRole] || roleColors.artist;
  const currentRole = roles.find((r) => r.id === selectedRole) || roles[0];

  const waysToGetInvolved = [
    {
      icon: CalendarDays,
      title: "Attend Events",
      description:
        "join our forums, open-mic nights and workshops across East Africa",
      cta: "SEE CALENDAR",
      action: () => navigate("/events"),
    },
    {
      icon: Heart,
      title: "Support our work",
      description:
        "Give once via our donation page or become a monthly donor to support our work",
      cta: "DONATE NOW",
      action: () => navigate("/donate"),
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    // Keep the subject dropdown in sync with the chosen role by default,
    // but leave it editable so e.g. an artist can still flag "Event
    setFormData((prev) => ({ ...prev, subject: role.subject }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // mmh lets simulate a network request with a timeout
    const loadingToast = toast.loading(
      isNewsletter ? "Subscribing you..." : "Sending your message...",
    );

    setTimeout(() => {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);

      const roleLabel = currentRole.label;

      toast.success(
        <div>
          <p className="font-semibold text-sm">
            {isNewsletter ? "Howdy! You're subscribed " : "Howdy! Message Sent "}
          </p>
          <p className="mt-1 text-base text-gray-600">
            {isNewsletter ? (
              <>Thanks for subscribing to updates from ANIKA.</>
            ) : (
              <>
                Thanks for reaching out as a <strong>{roleLabel}</strong>.
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isNewsletter
              ? "You'll hear from us with stories, events and campaign updates."
              : "We will get back to you within 48 hours."}
          </p>
        </div>,
        {
          duration: 6000,
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        },
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        organisation: "",
        country: "",
        subject: "",
        message: "",
      });
      setWhatsappOptIn(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1E1A18] font-body">
      <section className="relative overflow-hidden bg-charcoal text-cream py-16 text-cream md:py-12">
        <img
          src="/anika-flower.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 w-md rotate-0 opacity-90"
        />
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-wider">
            GET INVOLVED
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#E6A15E] font-editorial italic">
            Whether you volunteer, apply as an artist, partner with us or
            just want the stories in your inbox, there's a place for you at
            ANIKA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {waysToGetInvolved.map((way) => {
            const Icon = way.icon;
            return (
              <article
                key={way.title}
                className="flex min-h-[320px] flex-col items-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eb4c47]/10 text-[#eb4c47]">
                  <Icon size={34} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">{way.title}</h2>
                <p className="mb-7 flex-1 leading-7 text-gray-600">
                  {way.description}
                </p>
                <button
                  type="button"
                  onClick={way.action}
                  className="rounded-md  bg-[#eb4c47] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#d43d3a] focus:outline-none focus:ring-2 focus:ring-[#eb4c47] focus:ring-offset-2 cursor-pointer"
                >
                  {way.cta}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 bg-[#FAF7F2]" id="get-involved-form">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Get in touch.</h2>
            <p className="mt-2 font-editorial text-lg italic text-gray-600">
              We begin with the voice, not the institution. Tell us who you are
              and what you need to say.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              I am joining as:
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = selectedRole === role.id;
                const colors = roleColors[role.id];

                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className="flex flex-col items-center cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? colors.icon : "text-gray-400"
                        }`}
                      />
                      <span>{role.label}</span>
                    </div>
                    <div
                      className={`mt-1.5 w-full h-0.5 rounded transition-colors ${
                        isActive ? colors.box : "bg-gray-200"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`rounded-2xl p-8 md:p-10 border-2 shadow-lg transition-all duration-300 ${currentColors.border} ${currentColors.bg}`}
          >
            {currentRole.prompt && (
              <p className={`mb-6 text-sm font-medium ${currentColors.text}`}>
                {currentRole.prompt}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  YOUR NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What do people call you?"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                />
              </div>

              {!isNewsletter && (
                <>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      PHONE / WHATSAPP NUMBER
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254 7XX XXX XXX"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      COUNTRY
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Where are you based?"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organisation"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      ORGANISATION{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      value={formData.organisation}
                      onChange={handleChange}
                      placeholder="If applicable"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      SUBJECT
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90 appearance-none"
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      YOUR MESSAGE
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What needs to be said?"
                      required
                      rows={5}
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 bg-white/90"
                    />
                  </div>
                </>
              )}
            </div>

            <label
              htmlFor="whatsappOptIn"
              className="mt-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-white/70 p-4 cursor-pointer"
            >
              <input
                id="whatsappOptIn"
                name="whatsappOptIn"
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#eb4c47] focus:ring-[#eb4c47]"
              />
              <span className="text-sm text-gray-600 flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                <span>
                  Send me confirmations and updates on WhatsApp. You can reply{" "}
                  <strong>STOP</strong> at any time to opt out.
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full rounded-lg px-6 py-3.5 font-bold text-white transition-all flex items-center justify-center gap-2 ${currentColors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentColors.ring} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  {isNewsletter ? "SUBSCRIBING..." : "SENDING..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {isNewsletter ? "SUBSCRIBE" : "SEND MESSAGE"}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              {isNewsletter
                ? "You can unsubscribe at any time. Your information is kept confidential."
                : "We'll respond within 48 hours. Your information is kept confidential."}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default GetInvolved;
