import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiFileText } = FiIcons;

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
          <SafeIcon icon={FiMic} className="text-white text-3xl" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        Audio Transcription with AssemblyAI
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Upload your audio file and get accurate transcription powered by AssemblyAI's speech-to-text technology. 
        Supports various audio formats including MP3, WAV, and more.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
        <SafeIcon icon={FiFileText} className="text-lg" />
        <span>Powered by AssemblyAI</span>
      </div>
    </motion.div>
  );
};

export default Header;