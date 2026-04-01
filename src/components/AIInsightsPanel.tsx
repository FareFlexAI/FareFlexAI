import React from 'react';
import { Sparkles, ChevronDown, ChevronUp, TrendingDown, Plane, Clock, Zap } from 'lucide-react';
import { AIInsight } from '../types';
import { useApp } from '../context/AppContext';

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights }) => {
  const { showInsightDetails, setShowInsightDetails } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'date':
        return TrendingDown;
      case 'airport':
        return Plane;
      case 'timing':
        return Clock;
      default:
        return Sparkles;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-100 border border-amber-400/30';
      case 'low':
        return 'bg-orange-500/20 text-orange-100 border border-orange-400/30';
      default:
        return 'bg-gray-500/20 text-gray-100 border border-gray-400/30';
    }
  };

  const totalSavings = insights.reduce((sum, insight) => sum + insight.savings, 0);

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-6 shadow-2xl shadow-blue-600/30 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AI Savings Insights</h2>
              <p className="text-blue-100 text-xs font-medium mt-0.5">Personalized for your search</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl px-4 py-2.5 shadow-lg shadow-green-500/30">
            <div className="flex items-center gap-1.5">
              <Zap size={16} className="text-white" strokeWidth={3} />
              <div className="text-right">
                <p className="text-white text-xs font-semibold leading-none">Save up to</p>
                <p className="text-white text-xl font-bold leading-tight">${totalSavings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {insights.map((insight, index) => {
            const Icon = getIcon(insight.type);
            return (
              <div
                key={insight.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Icon className="text-white" size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-base leading-snug">{insight.title}</h3>
                      <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-3 py-1.5 shadow-md">
                        <span className="text-white font-bold text-base">
                          ${insight.savings}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{insight.description}</p>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-lg ${getConfidenceColor(
                        insight.confidence
                      )}`}
                    >
                      {insight.confidence.charAt(0).toUpperCase() + insight.confidence.slice(1)} confidence
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowInsightDetails(!showInsightDetails)}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-white/30 hover:border-white/50"
        >
          {showInsightDetails ? (
            <>
              Hide Detailed Analysis
              <ChevronUp size={20} strokeWidth={2.5} />
            </>
          ) : (
            <>
              See Detailed Analysis
              <ChevronDown size={20} strokeWidth={2.5} />
            </>
          )}
        </button>

        {showInsightDetails && (
          <div className="mt-5 space-y-3 pt-5 border-t border-white/30">
            {insights.map((insight) => (
              <div key={`detail-${insight.id}`} className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{insight.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{insight.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
