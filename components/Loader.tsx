"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 1800); // بعد 1.8 ثانية
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.2, rotate: 720 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="text-yellow-400 text-5xl font-bold drop-shadow-[0_0_30px_#facc15]"
          >
            🛡️ 1.drk SYSTEM
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
