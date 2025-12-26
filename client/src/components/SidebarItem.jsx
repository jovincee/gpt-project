import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppContext } from '../context/AppContext'
import toast from "react-hot-toast";





const SidebarItem = ({ chatId, icon, text, caption, expanded, isChat, isActive, clickAction }) => {
  const [hovered, setHovered] = useState(false);
  const { deleteChat } = useAppContext();
  
  return (
    <motion.div
      className={`flex items-center gap-4 p-3 mx-2 rounded-lg cursor-pointer 
        ${isActive 
          ? "bg-blue-500 text-white dark:bg-gray-900"
          : "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
        }
      `}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={clickAction}
    >
      {icon}
     
      {expanded && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap"
        >
        <p className="text-black dark:text-gray-500">{text}</p>
        {caption && <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{caption}</p>} 
        </motion.span>
        
      )}

      {/* Trash Icon (only when hovered and sidebar item is a chat) */}
      <AnimatePresence>
        {hovered && isChat && (
          <motion.button
            key="trash"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-3 text-gray-400 hover:text-red-500 cursor-pointer"
            onClick={(e) => toast.promise(deleteChat(e, chatId), {loading: 'deleting chat...', success: 'chat deleted', error: 'User cancelled deletion'})}
          >
            <Trash2 size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


export default SidebarItem

