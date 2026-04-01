import { Flight, Hotel, AIInsight, SearchParams } from '../types';

export interface FlightSearchParams extends SearchParams {
  sortBy?: 'price' | 'duration' | 'departure';
  maxStops?: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  sortBy?: 'price' | 'rating';
  minRating?: number;
}

export interface FlexibleDatePrice {
  date: string;
  price: number;
  isCheapest: boolean;
}

export interface SavedTrip {
  id: string;
  userId: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  travelers: number;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  tripId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface AIInsightRequest {
  searchParams: SearchParams;
  currentFlights: Flight[];
  currentHotels?: Hotel[];
}

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}
