import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";

const Gallery = () => {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/gallery-data.json");
        if (!response.ok) {
          throw new Error("Hey mehn failed to load gallery");
        }
        const data = await response.json();
        setAllImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Howdy! Error loading gallery:", error);
        setAllImages([
          { src: "/anika team.jpg", alt: "Anika Team" },
          { src: "/jaaziya.jpg", alt: "Jaaziya" },
          { src: "/KWAJ.jpg", alt: "KWAJ" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="font-sans bg-[#FAF7F2] text-[#1E1A18] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6A15E] mx-auto">
            <p className="mt-4 text-gray-600 text-sm">
              Loading gallery....Dilettante
            </p>
          </div>
        </div>
      </div>
    );
  }

  const galleryItems = allImages.slice(0, 6);

  const openLightbox = (item) => {
    setSelectedImage(item);
    setShowAllModal(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const handleViewAll = () => {
    setShowAllModal(true);
  };

  return (
    <div className="font-sans bg-[#FAF7F2] text-[#1E1A18] min-h-screen">
      <section className="relative bg-black px-4 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="inline-block text-[#E6A15E] font-semibold text-sm tracking-[0.3em] uppercase mb-2">
            Visual Archive
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-['Anton'] tracking-wider leading-tight">
            GALLERY
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#E6A15E] font-light">
            The rooms, the mics, the faces. Art airing in real time.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E6A15E] to-transparent opacity-30"></div>
      </section>
    </div>
  );
};
export default Gallery;
