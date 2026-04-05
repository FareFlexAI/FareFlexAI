import React from 'react';
import { Calendar, TrendingDown, Clock } from 'lucide-react';

const SmartStrategy: React.FC = () => {
  const bestDepartureDay = 'Tuesday, March 15';
  const bestReturnDay = 'Monday, March 22';
  const recommendation = 'Book now';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Smart Strategy</h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-2.5 rounded-xl">
            <Calendar size={20} className="text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">Best Departure Day</p>
            <p className="text-lg font-bold text-gray-900">{bestDepartureDay}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <Calendar size={20} className="text-blue-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">Best Return Day</p>
            <p className="text-lg font-bold text-gray-900">{bestReturnDay}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 pt-2">
          <div className={`p-2.5 rounded-xl ${
            recommendation === 'Book now' ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            {recommendation === 'Book now' ? (
              <TrendingDown size={20} className="text-orange-700" />
            ) : (
              <Clock size={20} className="text-gray-700" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">Recommendation</p>
            <p className="text-lg font-bold text-gray-900">{recommendation}</p>
            <p className="text-sm text-gray-600 mt-1">
              {recommendation === 'Book now'
                ? 'Prices are expected to rise in the next few days'
                : 'Prices may drop soon, consider waiting'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartStrategy;
