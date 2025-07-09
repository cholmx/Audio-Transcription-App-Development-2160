import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiPlay, FiPause, FiRotateCcw, FiFile } = FiIcons;

const FileUploader = ({ 
  onFileUpload, 
  audioFile, 
  onTranscribe, 
  onReset, 
  isTranscribing, 
  audioRef 
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      {!audioFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors duration-200"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-full">
              <SafeIcon icon={FiUpload} className="text-blue-500 text-3xl" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Upload Audio File
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop your audio file here, or click to browse
              </p>
              
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 cursor-pointer">
                <SafeIcon icon={FiFile} className="mr-2" />
                Choose File
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-400">
              Supports MP3, WAV, M4A, and other audio formats
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <SafeIcon icon={FiFile} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{audioFile.name}</h4>
                  <p className="text-sm text-gray-500">{formatFileSize(audioFile.size)}</p>
                </div>
              </div>
              
              <button
                onClick={onReset}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiRotateCcw} className="text-lg" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioFile)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="flex-1"
                controls
              />
              
              <button
                onClick={togglePlayPause}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              >
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTranscribe}
              disabled={isTranscribing}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isTranscribing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Transcribing...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiFile} />
                  <span>Start Transcription</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FileUploader;