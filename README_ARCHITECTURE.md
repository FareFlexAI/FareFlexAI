# FareFlex AI - Architecture Documentation

## Overview

FareFlex AI is a travel search application with AI-powered savings insights. The architecture is designed to be modular and ready for backend integration.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Full-page screens
├── context/            # React Context for state management
├── hooks/              # Custom React hooks
├── services/           # Backend service layer
│   ├── auth.service.ts
│   ├── flight.service.ts
│   ├── hotel.service.ts
│   ├── ai.service.ts
│   ├── savedTrips.service.ts
│   ├── alerts.service.ts
│   └── types.ts
├── lib/                # Third-party library configurations
│   └── supabase.ts
├── types.ts            # TypeScript type definitions
└── mockData.ts         # Mock data for development
```

## Service Layer Architecture

### 1. Authentication Service (`auth.service.ts`)

Handles user authentication using Supabase Auth.

**Methods:**
- `signUp(email, password)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `onAuthStateChange(callback)` - Listen for auth state changes

**Usage:**
```typescript
import { authService } from './services';

const { user, error } = await authService.signIn(email, password);
```

### 2. Flight Service (`flight.service.ts`)

Manages flight search and flexible date pricing.

**Methods:**
- `searchFlights(params)` - Search for flights based on parameters
- `getFlexibleDatePrices(from, to, month, year)` - Get price calendar
- `getCheapestFlightPrice(from, to, departDate)` - Find lowest price

**Current Implementation:** Uses mock data from `mockData.ts`

**Integration Points:**
- Replace with Amadeus, Skyscanner, or Kiwi.com API
- Add caching layer for performance
- Implement rate limiting

### 3. Hotel Service (`hotel.service.ts`)

Manages hotel search functionality.

**Methods:**
- `searchHotels(params)` - Search for hotels
- `getHotelById(id)` - Get hotel details

**Current Implementation:** Uses mock data from `mockData.ts`

**Integration Points:**
- Replace with Booking.com, Hotels.com, or Amadeus API
- Add filtering and sorting capabilities
- Implement price tracking

### 4. AI Service (`ai.service.ts`)

Generates AI-powered savings insights and recommendations.

**Methods:**
- `generateSavingsInsights(request)` - Generate personalized insights
- `analyzePriceTrends(from, to, departDate)` - Analyze price patterns
- `predictPriceChange(currentPrice, route, daysUntilDeparture)` - Predict prices

**Current Implementation:** Uses mock insights from `mockData.ts`

**Integration Points:**
- Connect to OpenAI, Anthropic, or custom ML model
- Implement historical price analysis
- Add personalization based on user behavior

### 5. Saved Trips Service (`savedTrips.service.ts`)

Manages user's saved trips using Supabase.

**Methods:**
- `getSavedTrips(userId)` - Get all saved trips for user
- `saveTrip(userId, params)` - Save a new trip
- `deleteTrip(userId, tripId)` - Delete saved trip
- `updateTripPrice(tripId, newPrice)` - Update trip price

**Database Schema:**
```sql
saved_trips (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  departure_city text,
  destination text,
  departure_date date,
  return_date date,
  budget numeric,
  initial_price numeric,
  flight_data jsonb,
  hotel_data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
```

### 6. Alerts Service (`alerts.service.ts`)

Manages price alerts for saved trips.

**Methods:**
- `getAlerts(userId)` - Get all alerts for user
- `createAlert(userId, params)` - Create new price alert
- `toggleAlert(alertId, isActive)` - Enable/disable alert
- `deleteAlert(userId, alertId)` - Delete alert
- `checkPriceDrops(userId)` - Check for price drops

**Database Schema:**
```sql
price_alerts (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  departure_city text,
  destination text,
  departure_date date,
  target_price numeric,
  current_price numeric,
  alert_enabled boolean,
  created_at timestamptz
)
```

## Custom Hooks

### `useAuth`

Provides authentication state and methods.

```typescript
const { user, loading, signUp, signIn, signOut } = useAuth();
```

### `useFlights`

Provides flight search functionality.

```typescript
const { flights, loading, error, searchFlights, getFlexibleDatePrices } = useFlights();
```

### `useSavedTrips`

Provides saved trips management.

```typescript
const { trips, loading, saveTrip, deleteTrip, refreshTrips } = useSavedTrips(userId);
```

## Data Flow

1. **User Action** → Component
2. **Component** → Hook or Context
3. **Hook/Context** → Service
4. **Service** → API/Database (Supabase)
5. **Response** ← Service
6. **State Update** ← Hook/Context
7. **UI Update** ← Component

## Backend Integration Roadmap

### Phase 1: Authentication (Ready)
- ✅ Supabase Auth integration
- ✅ User session management
- ✅ Protected routes

### Phase 2: Data Persistence (Ready)
- ✅ Saved trips in Supabase
- ✅ Price alerts in Supabase
- ✅ Row Level Security (RLS) policies

### Phase 3: Flight & Hotel APIs (Placeholder)
- ⏳ Integrate flight search API (Amadeus, Skyscanner, Kiwi)
- ⏳ Integrate hotel search API (Booking.com, Amadeus)
- ⏳ Implement caching strategy
- ⏳ Add error handling and retry logic

### Phase 4: AI Integration (Placeholder)
- ⏳ Connect to AI service (OpenAI, Claude)
- ⏳ Implement price prediction model
- ⏳ Add historical price analysis
- ⏳ Personalized recommendations

### Phase 5: Real-time Features
- ⏳ Price monitoring with Edge Functions
- ⏳ Email/push notifications
- ⏳ Real-time price updates
- ⏳ WebSocket for live updates

## Environment Variables

Required environment variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional for future integrations:
```env
VITE_AMADEUS_API_KEY=your_amadeus_key
VITE_AMADEUS_API_SECRET=your_amadeus_secret
VITE_OPENAI_API_KEY=your_openai_key
```

## Testing Strategy

### Unit Tests
- Test each service independently
- Mock Supabase client
- Test error handling

### Integration Tests
- Test service + database interaction
- Test authentication flow
- Test API integrations

### E2E Tests
- Test complete user flows
- Test search → save → alert flow
- Test authentication flows

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS policies
2. **API Keys**: Store in environment variables, never commit
3. **Rate Limiting**: Implement on API calls
4. **Input Validation**: Validate all user inputs
5. **CORS**: Configure properly for production
6. **SQL Injection**: Use parameterized queries (Supabase handles this)

## Performance Optimizations

1. **Caching**: Implement Redis for API responses
2. **Lazy Loading**: Load data on demand
3. **Debouncing**: Debounce search inputs
4. **Pagination**: Implement for large result sets
5. **Image Optimization**: Use CDN for hotel images
6. **Code Splitting**: Split by route

## Next Steps for Developers

1. **Add Real Flight API**:
   - Update `flight.service.ts` to call external API
   - Implement caching layer
   - Add error handling

2. **Add Real Hotel API**:
   - Update `hotel.service.ts` to call external API
   - Implement filtering and sorting
   - Add price comparison

3. **Implement AI Service**:
   - Create Edge Function for AI processing
   - Integrate OpenAI or Claude API
   - Add prompt engineering for insights

4. **Add Notifications**:
   - Create Edge Function for price monitoring
   - Implement email service (SendGrid, Resend)
   - Add push notifications (OneSignal)

5. **Add Analytics**:
   - Integrate analytics (PostHog, Mixpanel)
   - Track user behavior
   - Monitor API performance
