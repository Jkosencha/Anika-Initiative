import {useState, useEffect} from 'react';
import {ChevronRight, X} from 'lucide-react';

const Gallery= ()=>{
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/gallery-data.json');
        if (!response.ok) {
          throw new Error('Hey mehn failed to load gallery');
        }
        const data = await response.json();
        setAllImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Howdy! Error loading gallery:', error);
        setAllImages([
          { src: '/anika team.jpg', alt: 'Anika Team' },
          { src: '/jaaziya.jpg', alt: 'Jaaziya' },
          { src: '/KWAJ.jpg', alt: 'KWAJ' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading){
    return(
      <div className="font-sans bg-[#FAF7F2] text-[#1E1A18] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6A15E] mx-auto">
            <p className="mt-4 text-gray-600 text-sm">Loading gallery....Dilettante</p>
          </div>
        </div>
      </div>
    );
  }

  const galleryItems=allImages.slice(0,6);

  const openLightbox=(item)=>{
    setSelectedImage(item);
    setShowAllModal(false);
    document.body.style.overflow='hidden';
  };

  const closeLightbox=()=>{
    setSelectedImage(null);
    document.body.style.overflow='auto';
  };

  const handleViewAll=()=>{
    setShowAllModal(true);
  };
}
export default Gallery