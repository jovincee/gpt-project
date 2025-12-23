import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Spinner } from "../components/Spinner";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => 
    {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1800); // ⏱ duration of loading screen

    return () => clearTimeout(timer);
    }, [navigate]);

  return (
   <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white dark:bg-gray-900
      "
    >
      <div className="flex flex-col items-center gap-4">
        <div className="spinner dark:border-white/20" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading…
        </span>
      </div>
    </motion.div>
  );
}

export default Loading
