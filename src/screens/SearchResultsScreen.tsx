import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AIInsightsPanel from '../components/AIInsightsPanel';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import CalendarView from '../components/CalendarView';
import SharedFlightBanner from '../components/SharedFlightBanner';
import BestDealSites from '../components/BestDealSites';
import AISavingsInsights from '../components/AISavingsInsights';
import SmartStrategy from '../components/SmartStrategy';
import { mockFlights, mockHotels, mockAIInsights } from '../mockData';

const SearchResultsScreen: React.FC = () => {
  const { searchParams, setCurrentScreen, isSharedFlight, setIsSharedFlight } = useApp();
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'calendar'>('flights');
  const [sortBy, setSortBy] = useState('price');

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-gray-600">No search results. Please search first.</p>
          <button
            onClick={() => setCurrentScreen('home')}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-screen-sm mx-auto px-5 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">
                {searchParams.from} → {searchParams.to}
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-0.5">
                {new Date(searchParams.departDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                -{' '}
                {new Date(searchParams.returnDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                • {searchParams.travelers} {searchParams.travelers === 1 ? 'traveler' : 'travelers'}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'flights'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'hotels'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {isSharedFlight && (
          <SharedFlightBanner onDismiss={() => setIsSharedFlight(false)} />
        )}

        <AIInsightsPanel insights={mockAIInsights} />

        {(activeTab === 'flights' || activeTab === 'hotels') && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price (low to high)</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure time</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        )}

        {activeTab === 'flights' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Available Flights</h2>
              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                {mockFlights.length} results
              </span>
            </div>
            {mockFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}

            <BestDealSites />
            <AISavingsInsights />
            <SmartStrategy />
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Available Hotels</h2>
              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                {mockHotels.length} results
              </span>
            </div>
            {mockHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        {activeTab === 'calendar' && <CalendarView />}
      </div>
    </div>
  );
};

export default SearchResultsScreen;
