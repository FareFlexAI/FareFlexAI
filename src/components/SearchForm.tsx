import React, { useState } from 'react';
import { Plane, Calendar, Users, Bed, DollarSign } from 'lucide-react';
import { SearchParams, FlexibilityOption, CabinClass } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('SFO');
  const [to, setTo] = useState('LAX');
  const [departDate, setDepartDate] = useState('2024-05-15');
  const [returnDate, setReturnDate] = useState('2024-05-19');
  const [isFlexible, setIsFlexible] = useState(true);
  const [flexibility, setFlexibility] = useState<FlexibilityOption>('±3 days');
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');
  const [needsHotel, setNeedsHotel] = useState(false);
  const [budget, setBudget] = useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from,
      to,
      departDate,
      returnDate,
      isFlexible,
      flexibility,
      travelers,
      cabinClass,
      needsHotel,
      budget,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Plane className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="relative">
          <Plane className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Flexible dates</span>
            <button
              type="button"
              onClick={() => setIsFlexible(!isFlexible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isFlexible ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFlexible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isFlexible && (
            <div className="grid grid-cols-4 gap-2">
              {(['Exact', '±1 day', '±3 days', 'Entire month'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFlexibility(option)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    flexibility === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option === 'Exact' ? 'Exact' : option === '±1 day' ? '±1' : option === '±3 days' ? '±3' : 'Month'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Traveler' : 'Travelers'}
                </option>
              ))}
            </select>
          </div>

          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as CabinClass)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
          </select>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Bed className="text-gray-600" size={20} />
            <span className="text-sm font-medium text-gray-700">Need hotel?</span>
          </div>
          <button
            type="button"
            onClick={() => setNeedsHotel(!needsHotel)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              needsHotel ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                needsHotel ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="Budget"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Find My Best Deal
      </button>
    </form>
  );
};

export default SearchForm;
