import { motion } from 'framer-motion';

export default function PageTransitionWrapper({ children }) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0, filter: 'blur(4px)' }}
      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
      exit={{ x: '-100%', opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="w-full h-full absolute inset-0 pt-4"
    >
      {children}
    </motion.div>
  );
}
