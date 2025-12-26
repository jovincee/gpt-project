import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const ImageModal = ({ image, onClose }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [userName, setUserName] = useState("")
  const { user } = useAppContext();
  
   //useEffect for checking if the image is either fetched from the temporary list of community images or user-generated from API
  useEffect(() => {
    if (image?.imageUrl != undefined) {
      setImageUrl(image.imageUrl);
    }
    else {
      setImageUrl(image);
    }
  }, [image])

   //useEffect for checking if the userName is either fetched from the temporary list of community images or user-generated from API
   useEffect(() => {
    if (image?.userName != undefined) {
      setUserName(image.userName);
    }
    else {
      setUserName(user.name);
    }
  }, [image])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
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
