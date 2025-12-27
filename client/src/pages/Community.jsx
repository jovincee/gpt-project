import React, { useState, useEffect } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import ImageGridBox from '../components/ImageGridBox'
import ImageModal from '../Modals/ImageModal'
import toast from "react-hot-toast";
import { motion } from "framer-motion";


const Community = () => {
  //state variables

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null);
  const { darkMode, publishedImages, fetchPublishedImages } = useAppContext();

  const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  };

  //need an async function since it communicates to the backend to fetch the images
  const fetchImages = async () => {
    const tempImg = await fetchPublishedImages();
    setImages(publishedImages)
    setLoading(false)   //set loading to false; initially loading because we are trying to collect the images from the backend
  }

  useEffect(()=>{
    fetchImages()

  },[])

  useEffect(() => {
  const root = document.documentElement;

  if (darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

//need async function since it saves the image to the backend
const handleSaveImage = async (image) => {
  console.log("Saved:", image);
  // later:
  // POST /api/images/save
   // Simulate backend save
  await new Promise((res) => setTimeout(res, 400));

  toast.success("Saved to your collection");
};


  if (loading) return <Loading />
  
  return (
    <motion.div 
      className="relative h-full bg-gray-50 dark:bg-gray-900"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
    
    
    
    
    
    
    >
      {/* Fixed header */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-lg font-semibold">
          Community Images
        </h1>
      </header>
   

      {/** check if array of images is empty or not */}
      <div
        className="absolute left-0 right-0 bottom-0 pt-10 overflow-y-auto custom-scrollbar"
        style={{ top: '4rem' }} // header height
      >
      {images.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 pb-6">
          <ImageGridBox images={images} onSave={handleSaveImage} onImageClick={setSelectedImage}/>
          </div>
        
      ) : 
      (<p>
        No Images Available

      </p>)}
      

      </div>
      <ImageModal 
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      
      />

     </motion.div>
 
  )
}

export default Community    
