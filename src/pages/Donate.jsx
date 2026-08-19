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
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendWhatsapp, setSendWhatsapp] = useState(false);
  const [donationMethod, setDonationMethod] = useState("mpesa");

  const presetAmountsKES = [100, 500, 1000, 5000];
  const presetMethodsUSD = [5, 10, 25, 50];

  const impactstatus = [
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
        toast.error("Please enter a valid M-Pesa phone number.");
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

  const presetAmounts=donationMethod === 'mpesa' ? presetAmountsKES :presetMethodsUSD;
  const currencySymbol=donationMethod ==='mpesa'?'KES':'USD';
  const currencyLabel=donationMethod ==='mpesa'?'KES': '$';
};
export default DonationPage;
