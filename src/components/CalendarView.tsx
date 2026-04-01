import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, Sparkles } from 'lucide-react';
import { generateCalendarData } from '../mockData';

const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const calendarData = generateCalendarData(currentMonth, currentYear);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPriceColor = (price: number, allPrices: number[]) => {
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min;
    const position = (price - min) / range;

    if (position < 0.33) return 'bg-gradient-to-br from-green-50 to-emerald-100 text-green-800 border-2 border-green-300 shadow-sm';
    if (position < 0.66) return 'bg-gradient-to-br from-yellow-50 to-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm';
    return 'bg-gradient-to-br from-red-50 to-rose-100 text-red-800 border-2 border-red-300 shadow-sm';
  };

  const allPrices = calendarData.map(d => d.price);
  const cheapestPrice = Math.min(...allPrices);
  const cheapestDays = calendarData.filter(d => d.price === cheapestPrice);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-2xl shadow-green-600/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl">Best Days to Fly</h3>
          </div>
          <div className="space-y-2.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-sm font-medium text-green-100">Cheapest departure</p>
              <p className="text-lg font-bold">{new Date(cheapestDays[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${cheapestPrice}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-sm font-medium text-green-100">Flexible date savings</p>
              <p className="text-lg font-bold">Up to ${Math.max(...allPrices) - cheapestPrice} less</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h3 className="text-xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wide py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {calendarData.map((day) => {
            const date = new Date(day.date);
            const dayNum = date.getDate();
            return (
              <button
                key={day.date}
                className={`p-3 rounded-xl transition-all hover:scale-105 ${getPriceColor(
                  day.price,
                  allPrices
                )} ${day.isCheapest ? 'ring-4 ring-green-500 ring-offset-2' : ''}`}
              >
                <div className="text-sm font-bold mb-1">{dayNum}</div>
                <div className="text-xs font-bold">${day.price}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-lg shadow-sm" />
              <span className="text-sm font-semibold text-gray-700">Low price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-amber-300 rounded-lg shadow-sm" />
              <span className="text-sm font-semibold text-gray-700">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-300 rounded-lg shadow-sm" />
              <span className="text-sm font-semibold text-gray-700">High price</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
