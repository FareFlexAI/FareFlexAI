# FareFlex AI - AI-Powered Travel Savings Platform

A modern, mobile-first travel search application with AI-powered savings insights, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Authentication & User Management
- Email/password authentication with Supabase Auth
- Secure session management
- Password reset functionality
- Protected routes and screens

### Onboarding Experience
- Multi-step onboarding flow for new users
- Personalized travel preferences:
  - Home airport selection
  - Date flexibility preferences
  - Travel style (solo, couple, group)
  - Currency preferences
  - Price alerts preferences

### Core Functionality
- Flight search with flexible dates
- Hotel search and filtering
- AI-powered savings insights
- Saved trips management
- Price alerts

### User Profile
- Editable user preferences
- Home airport management
- Notification settings
- Account management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Toast.tsx       # Toast notification component
│   ├── FlightCard.tsx
│   ├── HotelCard.tsx
│   └── ...
├── screens/            # Full-page screens
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SearchResultsScreen.tsx
│   ├── SavedTripsScreen.tsx
│   └── ProfileScreen.tsx
├── services/           # Backend service layer
│   ├── auth.service.ts
│   ├── profile.service.ts
│   ├── flight.service.ts
│   ├── hotel.service.ts
│   ├── ai.service.ts
│   ├── savedTrips.service.ts
│   └── alerts.service.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useFlights.ts
│   ├── useSavedTrips.ts
│   └── useToast.ts
├── context/            # React Context providers
│   └── AppContext.tsx
├── lib/                # Third-party configurations
│   └── supabase.ts
├── types.ts            # TypeScript type definitions
└── mockData.ts         # Mock data for development
```

## Database Schema

### user_profiles
Stores user preferences and settings.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- full_name (text)
- home_airport (text)
- nearby_airports_enabled (boolean)
- flexibility_default ('exact' | '±1' | '±3' | 'month')
- preferred_currency (text)
- traveler_type ('solo' | 'couple' | 'group')
- alerts_enabled (boolean)
- onboarding_completed (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### saved_trips
Stores user's saved flight searches.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- departure_city (text)
- destination (text)
- departure_date (date)
- return_date (date)
- flexibility (text)
- travelers (integer)
- cabin_class (text)
- needs_hotel (boolean)
- budget (numeric)
- best_price (numeric)
- ai_summary (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### price_alerts
Manages price alerts for saved trips.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- trip_id (uuid, references saved_trips)
- departure_city (text)
- destination (text)
- departure_date (date)
- alert_type (text)
- target_price (numeric)
- current_price (numeric)
- is_active (boolean)
- created_at (timestamptz)
```

### ai_recommendations
Stores AI-generated travel recommendations.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- trip_id (uuid, references saved_trips)
- summary (text)
- confidence (numeric)
- details (jsonb)
- created_at (timestamptz)
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fareflex-ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Run database migrations
- The migrations are already applied via Supabase MCP tools
- Check `README_ARCHITECTURE.md` for migration details

5. Start development server
```bash
npm run dev
```

6. Build for production
```bash
npm run build
```

## User Flow

### New User Journey
1. **Sign Up** - Create account with email/password
2. **Onboarding** - Set preferences (airport, flexibility, travel style, currency)
3. **Home Screen** - Search for flights and hotels
4. **Results** - View search results with AI insights
5. **Save Trip** - Save interesting trips for monitoring
6. **Alerts** - Set up price alerts for saved trips
7. **Profile** - Manage preferences and account

### Returning User Journey
1. **Login** - Authenticate with credentials
2. **Home Screen** - Start new search or view saved trips
3. **Saved Trips** - Monitor prices and alerts
4. **Profile** - Update preferences

## Service Architecture

### Authentication Service
- Handles user signup, login, logout
- Manages session state
- Provides auth state listeners

### Profile Service
- Creates and updates user profiles
- Manages user preferences
- Handles onboarding data

### Flight Service
- Searches for flights (currently mocked)
- Provides flexible date pricing
- Ready for API integration

### Hotel Service
- Searches for hotels (currently mocked)
- Filters and sorts results
- Ready for API integration

### Saved Trips Service
- CRUD operations for saved trips
- Integrates with Supabase database
- Updates trip prices

### Alerts Service
- Creates and manages price alerts
- Supports multiple alert types
- Toggles alert activation

### AI Service
- Generates savings insights (currently mocked)
- Analyzes price trends
- Ready for AI API integration

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated users can only access their own data
- Secure password handling via Supabase Auth
- Protected API routes
- Input validation on all forms

## Future Enhancements

### Phase 1: Real APIs
- [ ] Integrate Amadeus or Skyscanner API for flights
- [ ] Integrate Booking.com or Hotels.com API
- [ ] Add caching layer for API responses

### Phase 2: AI Integration
- [ ] Connect OpenAI or Claude API for insights
- [ ] Implement historical price analysis
- [ ] Add personalized recommendations

### Phase 3: Notifications
- [ ] Email notifications for price drops
- [ ] Push notifications (OneSignal)
- [ ] SMS alerts (Twilio)

### Phase 4: Advanced Features
- [ ] Multi-city searches
- [ ] Trip sharing
- [ ] Group bookings
- [ ] Loyalty program integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact support.
