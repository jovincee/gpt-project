 import { Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ImageGridBox = ({ images, onSave, onImageClick }) => {
  const [savingUrl, setSavingUrl] = useState(null);

  const handleSave = async (image) => {
    setSavingUrl(image.imageUrl);

    await onSave?.(image);

    setTimeout(() => setSavingUrl(null), 600);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => {
        const isSaving = savingUrl === image.imageUrl;

        return (
          <div
            key={image.imageUrl}
            className="
              group relative overflow-hidden rounded-2xl
              bg-gray-100 dark:bg-white/5
              shadow-sm hover:shadow-xl
              transition-all duration-300 cursor-pointer
            "
            onClick={() => onImageClick(image)}
          >
            {/* Image */}
            <div className="aspect-square bg-black flex items-center justify-center">
              <img
                src={image.imageUrl}
                alt={`Posted by ${image.userName}`}
                loading="lazy"
                className="
                  max-w-full max-h-full object-contain
                  transition-transform duration-300
                  group-hover:scale-105 
                "
              />
            </div>

            {/* Dark hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Username */}
            <p 
          className="
            absolute
            bottom-0
            right-0
            text-xs
            bg-black/50
            backdrop-blur
            text-white
            px-4
            py-1
            rounded-tl-xl
            opacity-0
            group-hover:opacity-100
            transition
            duration-300
          ">
            Created by {image.userName}
          </p>

            {/* Save button */}
            <button
              onClick={(e) => {e.stopPropagation(); handleSave(image);}}
              className="
                absolute top-3 right-3
                bg-black/60 hover:bg-black/80
                text-white p-2 rounded-full
                backdrop-blur
                opacity-0 group-hover:opacity-100
                transition-opacity cursor-pointer
              "
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saved"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    ✓
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Bookmark size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGridBox;