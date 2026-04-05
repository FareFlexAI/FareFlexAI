import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Insight {
  text: string;
}

const insights: Insight[] = [
  { text: 'Flying midweek may reduce cost' },
  { text: 'Nearby airports could offer better deals' },
  { text: 'Prices may drop if you adjust dates slightly' },
  { text: 'Booking in advance typically saves 15-20%' }
];

const AISavingsInsights: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">AI Savings Insights</h2>
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Lightbulb size={20} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mt-1">Money-Saving Tips</h3>
        </div>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{insight.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AISavingsInsights;
