export interface Airport {
  code: string;
  city: string;
  name: string;
}

export type FlexibilityOption = 'Exact' | '±1 day' | '±3 days' | 'Entire month';
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';
export type TravelerType = 'Solo' | 'Couple' | 'Group';

export interface SearchParams {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  isFlexible: boolean;
  flexibility: FlexibilityOption;
  travelers: number;
  cabinClass: CabinClass;
  needsHotel: boolean;
  budget: number;
}

export interface Flight {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime: string;
  returnArrivalTime: string;
  stops: number;
  duration: string;
  price: number;
  badge?: 'cheapest' | 'best-value' | 'fastest';
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  nightlyPrice: number;
  totalPrice: number;
  freeCancellation: boolean;
}

export interface AIInsight {
  id: string;
  type: 'date' | 'airport' | 'timing' | 'price';
  title: string;
  savings: number;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  details: string;
}

export interface SavedTrip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  depart_date: string;
  return_date: string | null;
  flexibility: FlexibilityOption;
  travelers: number;
  cabin_class: CabinClass;
  needs_hotel: boolean;
  budget: number | null;
  best_price: number | null;
  ai_summary: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export type AlertType = 'price_below_target' | 'significant_price_change' | 'book_now_recommendation';

export interface Alert {
  id: string;
  user_id: string;
  trip_id: string;
  alert_type: AlertType;
  target_price: number | null;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface AIRecommendation {
  id: string;
  user_id: string;
  trip_id: string;
  summary: string;
  confidence: ConfidenceLevel;
  details: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  home_airport: string | null;
  nearby_airports_enabled: boolean;
  flexibility_default: FlexibilityOption;
  preferred_currency: string;
  traveler_type: TravelerType;
  alerts_enabled: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  date: string;
  price: number;
  isSelected: boolean;
  isCheapest: boolean;
}

export interface OnboardingData {
  homeAirport: string;
  nearbyAirportsEnabled: boolean;
  flexibilityDefault: FlexibilityOption;
  preferredCurrency: string;
  travelerType: TravelerType;
  alertsEnabled: boolean;
}

export interface PriceSnapshot {
  id: string;
  trip_id: string;
  supplier: string;
  product_type: 'flight' | 'hotel' | 'package';
  total_price: number;
  currency: string;
  observed_at: string;
}
