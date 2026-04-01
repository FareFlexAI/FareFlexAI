export { authService, AuthService } from './auth.service';
export { flightService, FlightService } from './flight.service';
export { hotelService, HotelService } from './hotel.service';
export { aiService, AIService } from './ai.service';
export { savedTripsService, SavedTripsService } from './savedTrips.service';
export { alertsService, AlertsService } from './alerts.service';
export { profileService, ProfileService } from './profile.service';

export type {
  FlightSearchParams,
  HotelSearchParams,
  FlexibleDatePrice,
  AIInsightRequest,
  ServiceResponse,
} from './types';

export type { AuthUser } from './auth.service';
export type { SaveTripParams } from './savedTrips.service';
export type { CreateAlertParams } from './alerts.service';
