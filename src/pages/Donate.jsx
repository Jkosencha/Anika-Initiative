import { useState } from "react";
import {
  Heart,
  Phone,
  MessageCircle,
  CheckCircle,
  Gift,
  Users,
  Mic,
  Globe,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

const DonationPage = () => {
  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [donationMethod, setDonationMethod] = useState("mpesa");

  const presetAmountsKES = [100, 500, 1000, 5000];
  const presetMethodsUSD = [5, 10, 25, 50];

  const impactStats = [
    { icon: Users, label: "Artists Supported", value: "150+" },
    { icon: Mic, label: "Events Held", value: "100+" },
    { icon: Globe, label: "African Countries", value: "14" },
    { icon: Heart, label: "Lives Impacted", value: "2500+" },
  ];

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };
  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setDonationAmount(Number(value));
    }
  };
  const handleDonate = () => {
    if (donationMethod === "mpesa") {
      if (!phoneNumber || phoneNumber.length < 9) {
        toast.error("Hey! Please enter a valid M-Pesa phone number.");
        return;
      }
      const loadingToastId = toast.loading(
        "Processing your M-Pesa donation...",
      );
      setTimeout(() => {
        toast.dismiss(loadingToastId);
        toast.success(
          <div>
            <p className="font-semibold">Thank You!</p>
            <p className="text-sm">
              Your donation of KES {donationAmount.toLocaleString()} was
              successful.
            </p>
            <p className="text-xs mt-1">Receipt sent to your phone.</p>
          </div>,
          {
            duration: 5000,
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          },
        );
      }, 2000);
    } else {
      toast.info(
        <div>
          <p className="font-semibold">Redirecting to secure payment...</p>
          <p className="text-sm">You will be taken to our USD payment page.</p>
          <p className="text-xs mt-1">Amount: ${donationAmount.toFixed(2)}</p>
        </div>,
        {
          duration: 5000,
          icon: <CreditCard className="w-5 h-5 text-[#E6A15E]" />,
        },
      );
    }
  };

  const presetAmounts =
    donationMethod === "mpesa" ? presetAmountsKES : presetMethodsUSD;
  const currencySymbol = donationMethod === "mpesa" ? "KES" : "USD";
  const currencyLabel = donationMethod === "mpesa" ? "KES" : "$";

  return (
    <div className="font-body bg-[#FAF7F2] text-[#1E1A18] min-h-screen">
      <section className="relative px-4 py-20 md:py-24 bg-ink text-cream text-white overflow-hidden">
        <div className="relative z-10 text-center mr-150">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mr-20 font-display">
            SUPPORT OUR WORK
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[#E6A15E] font-editorial italic">
            Your gift keeps the rooms open, the mics on and the conversation going
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-6 h-6 text-[#E6A15E]" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#1E1A18]">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[#E6A15E] font-semibold text-sm tracking-widest uppercase">
              Why Give
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Some realities can't be understood through reports alone.
            </h2>

            <div className="space-y-4">
              <div className="bg-[#F4EFE9] p-6 rounded-2xl border border-[#E6DED5]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E6A15E] p-2 rounded-full flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">
                      Your support makes a direct impact
                    </h4>
                    <p className="text-sm text-gray-600">
                      100% of your donation goes to programs, venues, artist
                      stipends and safe spaces.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-64 bg-[#E6DED5] rounded-2xl flex items-center justify-center text-[#8a8074] overflow-hidden">
                <img
                  src="/image6.jpg"
                  alt="Spoken word"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-2">Make a Donation</h3>
            <p className="text-sm text-gray-500 mb-6">
              Choose your amount and preferred method.
            </p>

            {/* //toggling donatoin method */}
            <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl">
              <button
                onClick={() => setDonationMethod("mpesa")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  donationMethod === "mpesa"
                    ? "bg-[#E6A15E] text-[#1E1A18] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                M-Pesa
              </button>
              <button
                onClick={() => setDonationMethod("usd")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  donationMethod === "usd"
                    ? "bg-[#E6A15E] text-[#1E1A18] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                USD (Card / PayPal)
              </button>
            </div>

            {/* //amountselections after toggling between hiyo ya kes and usd*/}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    donationAmount === amount && !customAmount
                      ? "border-[#E6A15E] bg-[#FDF6EE] text-[#1E1A18]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {currencySymbol}
                  {amount.toLocaleString()}
                </button>
              ))}
            </div>

            {/* //custom amount keyiing */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmount}
                placeholder={`Enter custom amount (${currencyLabel})`}
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E6A15E] focus:ring-2 focus:ring-[#E6A15E]/20 outline-none transition-all bg-cream/95"
              />
            </div>

            {/* //mpesa fields if toggled mpesa       */}
            {donationMethod === "mpesa" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-PESA Phone Number
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-[#E6A15E] focus-within:ring-2 focus-within:ring-[#E6A15E]/20 transition-all">
                    <span className="pl-4 text-gray-500 font-medium">+254</span>
                    <input
                      type="tel"
                      placeholder="712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-3 pl-2 outline-none bg-cream/95"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <input
                    type="checkbox"
                    id="whatsapp"
                    checked={sendWhatsApp}
                    onChange={() => setSendWhatsApp(!sendWhatsApp)}
                    className="w-5 h-5 accent-[#E6A15E]"
                  />
                  <label
                    htmlFor="whatsapp"
                    className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Send to whatsApp
                  </label>
                </div>
              </>
            )}

            {/* usd showing mockup */}
            {donationMethod === "usd" && (
              <div className="mb-6 p-4 bg-[#FDF6EE] rounded-xl border border-[#E6DED5]">
                <p className="text-sm text-gray-700">
                  You will be redirected to our secure payment page to complete
                  your USD donation.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Amount: ${donationAmount.toFixed(2)} USD
                </p>
              </div>
            )}
            <button
              onClick={handleDonate}
              className="w-full py-4 bg-[#1E1A18] hover:bg-[#3D3530] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {donationMethod === "mpesa" ? (
                <>
                  <Phone className="w-5 h-5" /> Donate KES{" "}
                  {donationAmount.toLocaleString()}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Donate $
                  {donationAmount.toFixed(2)}
                </>
              )}
            </button>
            {donationMethod === "mpesa" && (
              <p className="text-xs text-center text-gray-400 mt-3">
                STK push sent to your phone confirm.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* making of impact stories */}
      <section className="py-16 px-4 bg-[#F4EFE9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E6A15E] font-semibold text-sm tracking-widest uppercase">
              Impact Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Where your support goes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-[#FDF6EE] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-[#E6A15E]" />
              </div>
              <h4 className="font-bold text-lg mb-2">Open Mic Nights</h4>
              <p className="text-sm text-gray-600">
                Monthly events where artists air the unsaid. Your support keeps the stage open.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-[#FDF6EE] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#E6A15E]" />
              </div>
              <h4 className="font-bold text-lg mb-2">Artist Residencies</h4>
              <p className="text-sm text-gray-600">
                Cross-border collaborations that bring African artists together to create.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-[#FDF6EE] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#E6A15E]" />
              </div>
              <h4 className="font-bold text-lg mb-2">Safe Spaces</h4>
              <p className="text-sm text-gray-600">
                Therapy workshops and forums where hard conversations finally happen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DonationPage;