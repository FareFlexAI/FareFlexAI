import React, { useState } from 'react';
import { Plane, Clock, TrendingDown, Bookmark, Share2 } from 'lucide-react';
import { Flight } from '../types';
import { useApp } from '../context/AppContext';
import { generateShareUrl, copyToClipboard } from '../utils/shareUtils';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const { searchParams, addSavedTrip } = useApp();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'cheapest':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30';
      case 'best-value':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30';
      case 'fastest':
        return 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30';
      default:
        return '';
    }
  };

  const getBadgeText = (badge?: string) => {
    switch (badge) {
      case 'cheapest':
        return 'Best Price';
      case 'best-value':
        return 'Best Value';
      case 'fastest':
        return 'Fastest';
      default:
        return '';
    }
  };

  const handleSaveTrip = () => {
    if (!searchParams) return;

    setLoading(true);
    addSavedTrip({
      id: Date.now().toString(),
      origin: searchParams.from,
      destination: searchParams.to,
      depart_date: searchParams.departDate,
      return_date: searchParams.returnDate,
      flexibility: searchParams.flexibility,
      travelers: searchParams.travelers,
      cabin_class: searchParams.cabinClass,
      needs_hotel: searchParams.needsHotel,
      budget: searchParams.budget,
      best_price: flight.price,
      ai_summary: `Monitor this ${searchParams.from} to ${searchParams.to} trip for the best deals.`,
    });
    setSaved(true);
    setLoading(false);
  };

  const handleShare = async () => {
    if (!searchParams) return;

    const shareUrl = generateShareUrl({ flight, searchParams });

    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 transition-all duration-300 border border-gray-100 hover:border-blue-200">
      {flight.badge && (
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${getBadgeStyle(flight.badge)}`}>
            <TrendingDown size={14} strokeWidth={3} />
            {getBadgeText(flight.badge)}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{flight.airline}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span className="font-medium">{flight.duration}</span>
            <span>•</span>
            <span className="font-medium">
              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">${flight.price}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">per person</p>
        </div>
      </div>

      <div className="space-y-4 mb-5">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plane className="text-blue-600 transform rotate-45" size={16} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outbound</p>
          </div>
          <p className="font-bold text-gray-900 text-lg">
            {flight.departureTime} → {flight.arrivalTime}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plane className="text-blue-600 transform -rotate-45" size={16} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Return</p>
          </div>
          <p className="font-bold text-gray-900 text-lg">
            {flight.returnDepartureTime} → {flight.returnArrivalTime}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30">
          Select Flight
        </button>
        <button
          onClick={handleShare}
          className={`px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            copied
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
          }`}
          title={copied ? 'Link copied!' : 'Share flight'}
        >
          <Share2 size={20} />
        </button>
        <button
          onClick={handleSaveTrip}
          disabled={loading || saved}
          className={`px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            saved
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
          }`}
          title={saved ? 'Saved' : 'Save trip'}
        >
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
