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
}
export default Gallery