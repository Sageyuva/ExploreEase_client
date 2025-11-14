import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export  const Toast = ({ type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 min-w-80 max-w-md p-4 rounded-lg shadow-2xl backdrop-blur-sm border animate-slide-in ${
      isSuccess 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
    }`}>
      {/* Icon */}
      <div className={`flex-shrink-0 p-2 rounded-full ${
        isSuccess 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
          : 'bg-gradient-to-r from-red-600 to-pink-600'
      }`}>
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : (
          <XCircle className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className={`font-semibold text-sm ${
          isSuccess ? 'text-blue-900' : 'text-red-900'
        }`}>
          {isSuccess ? 'Success!' : 'Error!'}
        </p>
        <p className={`text-sm ${
          isSuccess ? 'text-blue-700' : 'text-red-700'
        }`}>
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-full transition-colors ${
          isSuccess 
            ? 'hover:bg-blue-200 text-blue-600' 
            : 'hover:bg-red-200 text-red-600'
        }`}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
        isSuccess 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
          : 'bg-gradient-to-r from-red-600 to-pink-600'
      }`}
        style={{
          animation: `shrink ${duration}ms linear forwards`
        }}
      />

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

