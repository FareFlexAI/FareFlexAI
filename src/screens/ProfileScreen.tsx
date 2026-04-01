import React, { useState } from 'react';
import { User, Plane, Bell, DollarSign, Globe, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProfileScreen: React.FC = () => {
  const { userProfile, setUserProfile } = useApp();

  const [homeAirport, setHomeAirport] = useState(userProfile?.homeAirport || 'SFO');
  const [includeNearby, setIncludeNearby] = useState(userProfile?.includeNearbyAirports ?? true);
  const [defaultFlexibility, setDefaultFlexibility] = useState<'exact' | '±1' | '±3' | 'month'>(
    userProfile?.defaultFlexibility || '±3'
  );
  const [currency, setCurrency] = useState(userProfile?.preferredCurrency || 'USD');
  const [notifications, setNotifications] = useState(userProfile?.notificationsEnabled ?? true);

  const handleSave = () => {
    setUserProfile({
      name: 'Travel Explorer',
      homeAirport,
      includeNearbyAirports: includeNearby,
      defaultFlexibility,
      preferredCurrency: currency,
      notificationsEnabled: notifications,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              TE
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Travel Explorer</h2>
              <p className="text-sm text-gray-600">Member since March 2024</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Plane size={18} />
                Home Airport
              </label>
              <input
                type="text"
                value={homeAirport}
                onChange={(e) => setHomeAirport(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., SFO"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Plane className="text-gray-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Include nearby airports</span>
              </div>
              <button
                onClick={() => setIncludeNearby(!includeNearby)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  includeNearby ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeNearby ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Settings size={18} />
                Default Flexibility
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['exact', '±1', '±3', 'month'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDefaultFlexibility(option)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                      defaultFlexibility === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Globe size={18} />
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Bell className="text-gray-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Price alerts</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md mb-4"
        >
          Save Changes
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <DollarSign className="text-gray-600" size={20} />
              <span className="font-medium text-gray-700">Travel Preferences</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Settings className="text-gray-600" size={20} />
              <span className="font-medium text-gray-700">App Settings</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-red-600">
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
