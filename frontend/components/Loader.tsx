import React, { useState, useEffect } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import { LOADING_MESSAGES } from '../constants';

interface LoaderProps {
  status: string; // Initial status
}

const Loader: React.FC<LoaderProps> = ({ status }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex flex-col items-center justify-center z-50 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/90 shadow-2xl w-80 text-center">
        <div className="relative">
            <SparklesIcon className="w-12 h-12 text-indigo-500" />
            <SparklesIcon className="w-4 h-4 text-indigo-400 absolute top-0 right-0 animate-ping" />
            <SparklesIcon className="w-5 h-5 text-blue-400 absolute bottom-1 left-0 animate-pulse" />
        </div>
        <div className="mt-4 text-lg font-medium text-slate-700">{LOADING_MESSAGES[currentMessageIndex]}</div>
        <p className="text-sm text-slate-500 mt-1">({status})</p>
      </div>
    </div>
  );
};

export default Loader;