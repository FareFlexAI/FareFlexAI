import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, Bell, DollarSign } from 'lucide-react';
import { OnboardingData } from '../types';

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => Promise<void>;
}

const popularAirports = [
  { code: 'JFK', name: 'New York JFK' },
  { code: 'LAX', name: 'Los Angeles' },
  { code: 'ORD', name: 'Chicago O\'Hare' },
  { code: 'ATL', name: 'Atlanta' },
  { code: 'DFW', name: 'Dallas/Fort Worth' },
  { code: 'SFO', name: 'San Francisco' },
  { code: 'MIA', name: 'Miami' },
  { code: 'SEA', name: 'Seattle' },
  { code: 'LAS', name: 'Las Vegas' },
  { code: 'BOS', name: 'Boston' },
];

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    homeAirport: '',
    nearbyAirportsEnabled: true,
    flexibilityDefault: 'Exact',
    preferredCurrency: 'USD',
    travelerType: 'Solo',
    alertsEnabled: true,
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!data.homeAirport) return;

    setLoading(true);
    try {
      await onComplete(data);
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return data.homeAirport.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FareFlex AI</h1>
          <p className="text-gray-600">Let's personalize your travel experience</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    s <= step
                      ? 'bg-gradient-to-br from-blue-600 to-orange-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 md:w-24 h-1 ${
                      s < step ? 'bg-gradient-to-r from-blue-600 to-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you based?</h2>
                  <p className="text-gray-600">We'll use this as your default departure airport</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Airport
                  </label>
                  <select
                    value={data.homeAirport}
                    onChange={(e) => setData({ ...data, homeAirport: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your home airport</option>
                    {popularAirports.map((airport) => (
                      <option key={airport.code} value={airport.code}>
                        {airport.code} - {airport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="nearbyAirports"
                    checked={data.nearbyAirportsEnabled}
                    onChange={(e) => setData({ ...data, nearbyAirportsEnabled: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="nearbyAirports" className="text-sm text-gray-700">
                    Include nearby airports in searches for better deals
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">How flexible are you?</h2>
                  <p className="text-gray-600">Set your default date flexibility</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'Exact', label: 'Exact Dates', desc: 'Specific dates only' },
                    { value: '±1 day', label: '±1 Day', desc: '1 day flexibility' },
                    { value: '±3 days', label: '±3 Days', desc: '3 days flexibility' },
                    { value: 'Entire month', label: 'Entire Month', desc: 'Maximum savings' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, flexibilityDefault: option.value as OnboardingData['flexibilityDefault'] })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        data.flexibilityDefault === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Who do you travel with?</h2>
                  <p className="text-gray-600">Choose your typical travel style</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'Solo', label: 'Solo', icon: '👤' },
                    { value: 'Couple', label: 'Couple', icon: '👫' },
                    { value: 'Group', label: 'Group', icon: '👥' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, travelerType: option.value as OnboardingData['travelerType'] })}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        data.travelerType === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    value={data.preferredCurrency}
                    onChange={(e) => setData({ ...data, preferredCurrency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay informed</h2>
                  <p className="text-gray-600">Get notified about price drops and deals</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="alerts"
                      checked={data.alertsEnabled}
                      onChange={(e) => setData({ ...data, alertsEnabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="alerts" className="font-medium text-gray-900 block">
                        Enable Price Alerts
                      </label>
                      <p className="text-sm text-gray-600">
                        Get notified when prices drop on your saved trips
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">You're all set!</h3>
                    <p className="text-sm text-gray-600">
                      Start searching for flights and hotels. Our AI will help you find the best deals based on your preferences.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
