import React from 'react';
import { Share2, X } from 'lucide-react';

interface SharedFlightBannerProps {
  onDismiss: () => void;
}

const SharedFlightBanner: React.FC<SharedFlightBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Share2 className="text-white" size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">Shared Flight</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            You're viewing a flight shared by someone. Search to find more options.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors flex-shrink-0"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SharedFlightBanner;
