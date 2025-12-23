import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function AnimatedRoutes({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>{children}</div>
    </AnimatePresence>
  );
}