import { Hotel } from '../types';
import { HotelSearchParams } from './types';
import { mockHotels } from '../mockData';

export class HotelService {
  async searchHotels(params: HotelSearchParams): Promise<{ hotels: Hotel[]; error: Error | null }> {
    try {
      await this.simulateDelay();

      let hotels = [...mockHotels];

      if (params.minRating) {
        hotels = hotels.filter(h => h.rating >= params.minRating!);
      }

      if (params.sortBy === 'price') {
        hotels.sort((a, b) => a.totalPrice - b.totalPrice);
      } else if (params.sortBy === 'rating') {
        hotels.sort((a, b) => b.rating - a.rating);
      }

      return { hotels, error: null };
    } catch (error) {
      return { hotels: [], error: error as Error };
    }
  }

  async getHotelById(id: string): Promise<{ hotel: Hotel | null; error: Error | null }> {
    try {
      await this.simulateDelay();
      const hotel = mockHotels.find(h => h.id === id);
      return { hotel: hotel || null, error: null };
    } catch (error) {
      return { hotel: null, error: error as Error };
    }
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const hotelService = new HotelService();
