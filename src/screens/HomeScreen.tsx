import React from 'react';
import { Sparkles, TrendingDown, Calendar, Zap, ArrowRight } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { useApp } from '../context/AppContext';
import { SearchParams } from '../types';
import { mockQuickDeals } from '../mockData';

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, setSearchParams } = useApp();

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 pb-24">
      <div className="max-w-screen-sm mx-auto px-5 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">FareFlex AI</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">Travel smarter. Spend less.</p>
          <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto">
            AI-powered insights that find you the best flight deals
          </p>
        </div>

        <SearchForm onSearch={handleSearch} />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Weekend Getaways</h2>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
              View all
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid gap-4">
            {mockQuickDeals.map((deal, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex">
                  <div className="relative w-32 flex-shrink-0 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-0.5">{deal.destination}</h3>
                      <p className="text-sm text-gray-500 font-medium">Roundtrip from {deal.from}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                          <TrendingDown size={12} />
                          Great deal
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">${deal.price + 45}</div>
                      <p className="text-3xl font-bold text-blue-600">${deal.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Why FareFlex AI?</h2>

          <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-2xl shadow-blue-600/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">AI-Powered Savings</h3>
                  <p className="text-blue-50 text-sm leading-relaxed">
                    Our AI analyzes millions of price points to find you the best deals
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">$234</div>
                  <div className="text-blue-100 text-xs font-medium">Avg. savings per trip</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">94%</div>
                  <div className="text-blue-100 text-xs font-medium">Success rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="text-green-600" size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">Flexible Dates</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                See the best prices across an entire month
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                <Zap className="text-amber-600" size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">Price Alerts</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get notified when prices drop on your trips
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
