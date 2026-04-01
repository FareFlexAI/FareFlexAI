import { Flight } from '../types';
import { FlightSearchParams, FlexibleDatePrice } from './types';
import { mockFlights, generateCalendarData } from '../mockData';

export class FlightService {
  async searchFlights(params: FlightSearchParams): Promise<{ flights: Flight[]; error: Error | null }> {
    try {
      await this.simulateDelay();

      let flights = [...mockFlights];

      if (params.maxStops !== undefined) {
        flights = flights.filter(f => f.stops <= params.maxStops!);
      }

      if (params.sortBy === 'price') {
        flights.sort((a, b) => a.price - b.price);
      } else if (params.sortBy === 'duration') {
        flights.sort((a, b) => {
          const durationA = this.parseDuration(a.duration);
          const durationB = this.parseDuration(b.duration);
          return durationA - durationB;
        });
      }

      return { flights, error: null };
    } catch (error) {
      return { flights: [], error: error as Error };
    }
  }

  async getFlexibleDatePrices(
    from: string,
    to: string,
    month: number,
    year: number
  ): Promise<{ prices: FlexibleDatePrice[]; error: Error | null }> {
    try {
      await this.simulateDelay();

      const calendarData = generateCalendarData(month, year);
      const prices = calendarData.map(day => ({
        date: day.date,
        price: day.price,
        isCheapest: day.isCheapest,
      }));

      return { prices, error: null };
    } catch (error) {
      return { prices: [], error: error as Error };
    }
  }

  async getCheapestFlightPrice(from: string, to: string, departDate: string): Promise<number> {
    await this.simulateDelay();
    const allPrices = mockFlights.map(f => f.price);
    return Math.min(...allPrices);
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    return hours * 60 + minutes;
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const flightService = new FlightService();
