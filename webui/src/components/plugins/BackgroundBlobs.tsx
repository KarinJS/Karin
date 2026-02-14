import { motion } from 'framer-motion'

export const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ 
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"
    />
    <motion.div 
      animate={{ 
        x: [0, -70, 0],
        y: [0, 100, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
      className="absolute top-1/3 right-0 w-125 h-125 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-60"
    />
    <motion.div 
      animate={{ 
        x: [0, 50, 0],
        y: [0, 50, 0],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 5 }}
      className="absolute -bottom-32 left-1/3 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl opacity-50"
    />
  </div>
);
