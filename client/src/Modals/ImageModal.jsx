import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Check } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const ImageModal = ({ image, onClose, isPublished }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [userName, setUserName] = useState("")
  const [isSavable, setIsSavable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAppContext();
  const location = useLocation();
  
   //useEffect for checking if the image is either fetched from the temporary list of community images or user-generated from API
  useEffect(() => {
    if (image?.imageUrl != undefined || location.pathname === '/community') {
      setImageUrl(image?.imageUrl);
      setIsSavable(false);
      setUserName(image.userName);
      
    }
    else {
      setImageUrl(image);
      setIsSavable(true);
      setUserName(user.name);
    }
  }, [image])



  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
          >
            <X size={22} />
          </button>

            {/* Image + hover controls */}
          <motion.div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => e.stopPropagation()}
          >

          {/**Bookmark button */}
          <AnimatePresence>
             {isSavable && isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Bookmark clicked");
                }}
              >
              {isPublished ? (
                <>
                <Bookmark fill="currentColor" />
                  <Check
                    size={12}
                    className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full"
                  />
                </>
                ):(
                
                <Bookmark size={20} className="cursor-pointer" />
      
                )}
                
              </motion.button>
            )}
          </AnimatePresence>
          

          {/* Image */}
          
          <motion.img
            src={imageUrl}
            alt={`Posted by ${image.userName}`}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            
          />
          </motion.div>

          {/* Username */}
          <div className="absolute bottom-6 text-white text-sm opacity-90">
            @{userName}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
