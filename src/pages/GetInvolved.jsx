import React, { useState } from "react";
import {
  CalendarDays,
  Handshake,
  Heart,
  User,
  Users,
  Send,
  Mic,
  Sparkles,
  CheckCircle,
} from "lucid-react";
import { Toaster } from "sonner";

const GetInvolved = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [selectedRole, setSelectedRole] = useState("artist");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const waysToGetInvolved = [
    {
      icon: CalendarDays,
      title: "Attend Events",
      description:
        "join our forums, open-mic nights and workshops across East Africa",
      cta: "SEE CALENDAR",
      color: "red",
    },
    {
      icon: Heart,
      title: "Support our work",
      description:
        "Give once via our donation page or become a monthly donor to support our work",
      cta: "DONATE NOW",
      color: "red",
    },
    {
        icon:Handshake,
        title:'Partner with us',
        description:'Collaborate on research, programming and campaigns as part of the alliance.',
        cta:'ENQUIRE NOW',
        color:'red'
    }
  ];

  const roles=[
    {id:'artist',label:'Artist or Creative',icon: Mic},
    {id:'community',label:'Community Member',icon: Users},
    {id:'partner',label:'Partner or Civil Society',icon: Handshake},
    {id:'donor',label:'Donor',icon: Heart},
    {id:'other',label:'Other',icon: Sparkles}
  ];

  const roleColors={
    artist:{
     bg: 'bg-red-50',
      border: 'border-red-500',
      ring: 'ring-red-500',
      text: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600',
      formBg: 'from-purple-50 to-white',
    },
    community: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      ring: 'ring-green-500',
      text: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700',
      icon: 'text-green-600',
      formBg: 'from-blue-50 to-white',
    },
    partner: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      ring: 'ring-orange-500',
      text: 'text-orange-700',
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: 'text-orange-600',
      formBg: 'from-green-50 to-white',
    },
    donor: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      ring: 'ring-blue-500',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600',
      formBg: 'from-yellow-50 to-white',
    },
    media: {
      bg: 'bg-black-50',
      border: 'border-black-500',
      ring: 'ring-black-500',
      text: 'text-black-700',
      button: 'bg-black-600 hover:bg-black-700',
      icon: 'text-black-600',
      formBg: 'from-black-50 to-white',
    },
  };
};
