import React from 'react';
import { ExternalLink } from 'lucide-react';

interface DealSite {
  name: string;
  price: string;
  reason: string;
  url: string;
}

const dealSites: DealSite[] = [
  {
    name: 'Google Flights',
    price: '$XXX',
    reason: 'Cheapest option',
    url: '#'
  },
  {
    name: 'Kiwi',
    price: '$XXX',
    reason: 'Best nonstop',
    url: '#'
  },
  {
    name: 'Airline Direct',
    price: '$XXX',
    reason: 'Best overall value',
    url: '#'
  }
];

const BestDealSites: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Best Deal Sites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {dealSites.map((site) => (
          <div
            key={site.name}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{site.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">{site.price}</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">{site.reason}</p>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                View Deal
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestDealSites;
