import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerificationStates = ({ state = 'verifying' }) => {
  const [currentState, setCurrentState] = useState<any>(state);

  // Demo state change - remove in production
  useEffect(() => {
    if (state === 'verifying') {
      const timer = setTimeout(() => {
        setCurrentState('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const states: any = {
    verifying: {
      icon: Shield,
      title: "Verifying your access",
      message: "It will take less than a second. Please wait!",
      iconColor: "text-blue-600",
      animation: "animate-pulse"
    },
    success: {
      icon: CheckCircle2,
      title: "Access Verified",
      message: "You now have full access to the platform",
      iconColor: "text-green-500",
      animation: "animate-bounce"
    },
    error: {
      icon: XCircle,
      title: "Verification Failed",
      message: "Please try again or contact support",
      iconColor: "text-red-500",
      animation: "animate-shake"
    },
    loading: {
      icon: Loader2,
      title: "Loading Access Details",
      message: "Retrieving your permissions...",
      iconColor: "text-blue-600",
      animation: "animate-spin"
    }
  };

  useEffect(() => {

    // Add custom animation keyframes to your global CSS
    const style = document.createElement('style');
    style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
  
  .animate-progress {
    animation: progress 2s linear;
  }
`;
    document.head.appendChild(style);
  })
  const CurrentIcon = states[currentState].icon;
  const { title, message, iconColor, animation } = states[currentState];

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full max-w-md mx-auto p-8">
      {/* Main verification container */}
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        {/* Icon container with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-xl opacity-70 -z-10" />
          <CurrentIcon
            className={`h-16 w-16 ${iconColor} ${animation}`}
          />
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">
            {message}
          </p>
        </div>

        {/* Progress bar for verifying state */}
        {currentState === 'verifying' && (
          <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
            <div className="bg-blue-600 h-1.5 rounded-full animate-progress" />
          </div>
        )}

        {/* Error state retry button */}
        {currentState === 'error' && (
          <button
            onClick={() => setCurrentState('verifying')}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};


export default VerificationStates;