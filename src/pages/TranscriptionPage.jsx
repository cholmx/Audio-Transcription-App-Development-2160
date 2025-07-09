import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FileUploader from '../components/FileUploader';
import TranscriptionResult from '../components/TranscriptionResult';
import Header from '../components/Header';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { transcribeAudio } from '../utils/transcriptionService';

const { FiFileText } = FiIcons;

const TranscriptionPage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const handleFileUpload = (file) => {
    setAudioFile(file);
    setTranscription('');
    setError('');
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;
    
    setIsTranscribing(true);
    setError('');
    
    try {
      // Show a processing message while we wait for the transcription
      setTranscription("Processing your audio file with AssemblyAI...");
      
      // Call the transcription service with the audio file
      const result = await transcribeAudio(audioFile);
      setTranscription(result);
    } catch (err) {
      console.error("Transcription error:", err);
      setError(err.message || 'Failed to transcribe audio. Please try again.');
      setTranscription('');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setTranscription('');
    setError('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <FileUploader
            onFileUpload={handleFileUpload}
            audioFile={audioFile}
            onTranscribe={handleTranscribe}
            onReset={handleReset}
            isTranscribing={isTranscribing}
            audioRef={audioRef}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <TranscriptionResult
            transcription={transcription}
            isTranscribing={isTranscribing}
          />

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SafeIcon icon={FiFileText} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload your audio file using the file selector or drag & drop</li>
                  <li>• Preview your audio using the built-in player</li>
                  <li>• Click "Start Transcription" to process the file</li>
                  <li>• Your audio is sent to AssemblyAI's API for transcription</li>
                  <li>• Copy or download your transcription when ready</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3">
                  This application uses AssemblyAI's speech-to-text API for accurate transcription results.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TranscriptionPage;