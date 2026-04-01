import { useState } from 'react';
import { flightService, FlightSearchParams } from '../services';
import { Flight } from '../types';

export function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchFlights = async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);

    const { flights: results, error: searchError } = await flightService.searchFlights(params);

    if (searchError) {
      setError(searchError);
      setFlights([]);
    } else {
      setFlights(results);
    }

    setLoading(false);
    return { flights: results, error: searchError };
  };

  const getFlexibleDatePrices = async (from: string, to: string, month: number, year: number) => {
    setLoading(true);
    setError(null);

    const { prices, error: priceError } = await flightService.getFlexibleDatePrices(from, to, month, year);

    setLoading(false);
    return { prices, error: priceError };
  };

  return {
    flights,
    loading,
    error,
    searchFlights,
    getFlexibleDatePrices,
  };
}
