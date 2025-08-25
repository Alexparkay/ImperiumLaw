import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMicrophone, HiOutlineXMark } from 'react-icons/hi2';

interface VapiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  startSpeaking?: () => void;
}

// Voice bar visualization component
const VoiceVisualizer = () => {
  const [heights, setHeights] = useState<number[]>(Array(16).fill(10));

  // Animate the heights of the voice bars
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(heights.map(() => 5 + Math.random() * 30));
    }, 100);
    
    return () => clearInterval(interval);
  }, [heights]);

  return (
    <div className="flex items-center justify-center space-x-1 my-4">
      {heights.map((height, i) => (
        <motion.div 
          key={i} 
          className="w-1 bg-accent-primary rounded-full"
          initial={{ height: 5 }}
          animate={{ 
            height: height,
            transition: { duration: 0.1 }
          }}
        />
      ))}
    </div>
  );
};

const VapiPopup: React.FC<VapiPopupProps> = ({ isOpen, onClose, isListening, startSpeaking }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="glass-panel bg-background-secondary/90 backdrop-blur-md border border-white/10 shadow-xl shadow-black/40 rounded-xl p-5 w-80 relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-3 right-3 text-text-secondary hover:text-text-primary p-1 rounded-full"
              onClick={onClose}
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineMicrophone className="w-8 h-8 text-accent-primary" />
              </div>

              <h3 className="text-lg font-medium text-text-primary mb-2">
                {isListening ? "Listening..." : "Ready to listen"}
              </h3>

              <p className="text-sm text-text-secondary mb-4">
                {isListening 
                  ? "Speak now. I'm listening to your query." 
                  : "Click the microphone button to start speaking."}
              </p>

              {/* Voice visualizer - only show when listening */}
              {isListening && <VoiceVisualizer />}

              {/* Call-to-action button */}
              {!isListening && (
                <button
                  onClick={startSpeaking}
                  className="w-full py-2 px-4 bg-accent-primary text-white rounded-lg font-medium mt-2"
                >
                  Start Speaking
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VapiPopup; 