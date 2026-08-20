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
      </section>

       <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-[#E6A15E] font-semibold text-sm tracking-[0.2em] uppercase">
              Moments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-[#1E1A18]">
              The rooms, the mics, the faces.
            </h2>
            <p className="text-gray-600 max-w-2xl mt-2 text-sm md:text-base">
              Art airing in real time. Moments where something shifts.
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#E6A15E] font-medium hover:gap-3 transition-all duration-300 group"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Main grid showing 6 images only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.src}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200 aspect-[4/3] cursor-pointer"
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Hover overlay with alt text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <span className="text-[#E6A15E] font-medium text-sm tracking-wide bg-[#1E1A18]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#E6A15E]/30 shadow-lg">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Gallery;
