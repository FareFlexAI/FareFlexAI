import { AIInsight } from '../types';
import { AIInsightRequest } from './types';
import { mockAIInsights } from '../mockData';

export class AIService {
  async generateSavingsInsights(request: AIInsightRequest): Promise<{ insights: AIInsight[]; error: Error | null }> {
    try {
      await this.simulateDelay();

      const insights = [...mockAIInsights];

      return { insights, error: null };
    } catch (error) {
      return { insights: [], error: error as Error };
    }
  }

  async analyzePriceTrends(
    from: string,
    to: string,
    departDate: string
  ): Promise<{ recommendation: string; confidence: number; error: Error | null }> {
    try {
      await this.simulateDelay();

      const recommendations = [
        'Book now - prices are rising',
        'Wait - prices may drop in 2 weeks',
        'Good price - consider booking',
      ];

      const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
      const confidence = 0.7 + Math.random() * 0.25;

      return { recommendation, confidence, error: null };
    } catch (error) {
      return { recommendation: '', confidence: 0, error: error as Error };
    }
  }

  async predictPriceChange(
    currentPrice: number,
    route: string,
    daysUntilDeparture: number
  ): Promise<{ prediction: 'increase' | 'decrease' | 'stable'; probability: number; error: Error | null }> {
    try {
      await this.simulateDelay();

      const predictions: Array<'increase' | 'decrease' | 'stable'> = ['increase', 'decrease', 'stable'];
      const prediction = predictions[Math.floor(Math.random() * predictions.length)];
      const probability = 0.6 + Math.random() * 0.3;

      return { prediction, probability, error: null };
    } catch (error) {
      return { prediction: 'stable', probability: 0, error: error as Error };
    }
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
}

export const aiService = new AIService();
