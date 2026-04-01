import { Flight, Hotel, AIInsight, SavedTrip, CalendarDay } from './types';

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'United',
    departureTime: '8:00 AM',
    arrivalTime: '4:30 PM',
    returnDepartureTime: '9:15 AM',
    returnArrivalTime: '5:45 PM',
    stops: 0,
    duration: '5h 30m',
    price: 298,
    badge: 'cheapest'
  },
  {
    id: '2',
    airline: 'Delta',
    departureTime: '6:30 AM',
    arrivalTime: '2:15 PM',
    returnDepartureTime: '7:00 AM',
    returnArrivalTime: '2:50 PM',
    stops: 0,
    duration: '5h 45m',
    price: 324,
    badge: 'best-value'
  },
  {
    id: '3',
    airline: 'Alaska',
    departureTime: '10:15 AM',
    arrivalTime: '6:00 PM',
    returnDepartureTime: '11:30 AM',
    returnArrivalTime: '7:15 PM',
    stops: 0,
    duration: '5h 45m',
    price: 342,
    badge: 'fastest'
  },
  {
    id: '4',
    airline: 'American',
    departureTime: '11:45 AM',
    arrivalTime: '8:30 PM',
    returnDepartureTime: '12:20 PM',
    returnArrivalTime: '9:10 PM',
    stops: 1,
    duration: '8h 45m',
    price: 276,
  },
  {
    id: '5',
    airline: 'Southwest',
    departureTime: '2:30 PM',
    arrivalTime: '10:45 PM',
    returnDepartureTime: '3:15 PM',
    returnArrivalTime: '11:35 PM',
    stops: 1,
    duration: '8h 15m',
    price: 289,
  },
  {
    id: '6',
    airline: 'JetBlue',
    departureTime: '5:20 PM',
    arrivalTime: '11:55 PM',
    returnDepartureTime: '6:10 PM',
    returnArrivalTime: '12:45 AM',
    stops: 0,
    duration: '6h 35m',
    price: 398,
  }
];

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'The Modern Downtown',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    neighborhood: 'Downtown',
    rating: 4.7,
    reviewCount: 1243,
    nightlyPrice: 189,
    totalPrice: 756,
    freeCancellation: true
  },
  {
    id: '2',
    name: 'Riverside Boutique Hotel',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    neighborhood: 'Riverfront',
    rating: 4.5,
    reviewCount: 892,
    nightlyPrice: 156,
    totalPrice: 624,
    freeCancellation: true
  },
  {
    id: '3',
    name: 'City Center Suites',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    neighborhood: 'City Center',
    rating: 4.3,
    reviewCount: 567,
    nightlyPrice: 134,
    totalPrice: 536,
    freeCancellation: false
  },
  {
    id: '4',
    name: 'Skyline Plaza Hotel',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
    neighborhood: 'Business District',
    rating: 4.8,
    reviewCount: 2103,
    nightlyPrice: 245,
    totalPrice: 980,
    freeCancellation: true
  },
  {
    id: '5',
    name: 'Garden View Inn',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    neighborhood: 'Garden District',
    rating: 4.6,
    reviewCount: 734,
    nightlyPrice: 167,
    totalPrice: 668,
    freeCancellation: true
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'date',
    title: 'Fly Tuesday instead of Friday',
    savings: 124,
    description: 'Shifting your departure from Friday to Tuesday saves $124 per person',
    confidence: 'high',
    details: 'Based on 90 days of historical price data, Tuesday departures are consistently 29% cheaper than Friday departures on this route. Airlines reduce mid-week prices due to lower business travel demand. The pattern is particularly strong for this city pair, with Tuesday showing the lowest average fares in our database.'
  },
  {
    id: '2',
    type: 'timing',
    title: 'Book now, prices trending up',
    savings: 67,
    description: 'Current prices are 18% below average and rising fast',
    confidence: 'high',
    details: 'Our AI analyzed 180 days of price movements for this route and departure window. Current fares are $67 below the 60-day average. Price prediction models show an 84% probability of increases over the next 14 days as inventory decreases. We recommend booking within 48 hours to lock in these rates.'
  },
  {
    id: '3',
    type: 'airport',
    title: 'Oakland airport could save $43',
    savings: 43,
    description: 'OAK has cheaper options than SFO, just 25 minutes away',
    confidence: 'medium',
    details: 'Oakland International (OAK) is 25 minutes from SFO via public transit. Current fares from OAK average $43 less than SFO for your dates. The savings exceed transportation costs, and OAK typically has shorter security lines. Consider this option if schedule flexibility allows.'
  }
];

export const mockSavedTrips: SavedTrip[] = [
  {
    id: '1',
    from: 'SFO',
    to: 'LAX',
    departDate: '2024-05-15',
    returnDate: '2024-05-19',
    currentPrice: 342,
    aiRecommendation: 'Wait - prices may drop in 2 weeks',
    createdAt: '2024-04-01'
  },
  {
    id: '2',
    from: 'SFO',
    to: 'NYC',
    departDate: '2024-06-10',
    returnDate: '2024-06-17',
    currentPrice: 487,
    aiRecommendation: 'Book now - prices are rising',
    createdAt: '2024-03-28'
  },
  {
    id: '3',
    from: 'SFO',
    to: 'SEA',
    departDate: '2024-07-04',
    returnDate: '2024-07-07',
    currentPrice: 298,
    aiRecommendation: 'Good price - consider booking',
    createdAt: '2024-03-25'
  }
];

export const generateCalendarData = (month: number, year: number): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const basePrice = 350;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    let priceVariation = 0;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      priceVariation = Math.random() * 100 + 50;
    } else if (dayOfWeek === 2 || dayOfWeek === 3) {
      priceVariation = -(Math.random() * 80 + 40);
    } else {
      priceVariation = (Math.random() - 0.5) * 60;
    }

    const price = Math.round(basePrice + priceVariation);

    days.push({
      date: date.toISOString().split('T')[0],
      price,
      isSelected: false,
      isCheapest: false
    });
  }

  const minPrice = Math.min(...days.map(d => d.price));
  days.forEach(day => {
    if (day.price === minPrice) {
      day.isCheapest = true;
    }
  });

  return days;
};

export const mockQuickDeals = [
  {
    destination: 'Los Angeles',
    from: 'SFO',
    price: 89,
    image: 'https://images.pexels.com/photos/2695679/pexels-photo-2695679.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    destination: 'Las Vegas',
    from: 'SFO',
    price: 67,
    image: 'https://images.pexels.com/photos/161772/las-vegas-nevada-strasse-street-161772.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    destination: 'Seattle',
    from: 'SFO',
    price: 134,
    image: 'https://images.pexels.com/photos/1823680/pexels-photo-1823680.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];
