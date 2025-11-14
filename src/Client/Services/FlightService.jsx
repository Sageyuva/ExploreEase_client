import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plane, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Filter,
  X,
  CheckCircle,
  ArrowUpDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserGetFlightsApi, UserBookFlightApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import WeekCalendar from '../../components/WeekCalendar';

const FlightService = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // Search and filter states
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState(searchParams.get('date') || '');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedFrom = useDebounce(searchFrom, 500);
  const debouncedTo = useDebounce(searchTo, 500);
  const debouncedDate = useDebounce(searchDate, 500);

  // Fetch flights function
  const fetchFlights = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetFlightsApi(
        debouncedFrom || undefined, 
        debouncedTo || undefined, 
        debouncedDate || undefined, 
        sortBy, 
        sortOrder
      );
      setFlights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setToast({
        type: 'error',
        message: 'Failed to fetch flights. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFrom, debouncedTo, debouncedDate, sortBy, sortOrder]);

  // Sync URL params with state
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam && dateParam !== searchDate) {
      setSearchDate(dateParam);
    }
  }, [searchParams]);

  // Fetch flights on component mount and when filters change
  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleClearFilters = () => {
    setSearchFrom('');
    setSearchTo('');
    setSearchDate('');
    setSortBy('price');
    setSortOrder('asc');
    setSearchParams({});
  };

  const handleDateSelect = (date) => {
    setSearchDate(date);
    setSearchParams({ date });
  };

  const handleBookFlight = (flight) => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      setToast({
        type: 'error',
        message: 'Please login to book a flight',
      });
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    setSelectedFlight(flight);
    setSeatsToBook(1);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedFlight) return;
    
    if (seatsToBook > selectedFlight.availableSeats) {
      setToast({
        type: 'error',
        message: `Only ${selectedFlight.availableSeats} seats available`,
      });
      return;
    }

    setIsBooking(true);
    try {
      const response = await UserBookFlightApi(selectedFlight._id, seatsToBook);
      
      setToast({
        type: 'success',
        message: response.message || 'Flight booked successfully!',
      });

      // Update the flight in the list
      setFlights(prevFlights => 
        prevFlights.map(flight => 
          flight._id === selectedFlight._id
            ? { ...flight, availableSeats: response.booking.availableSeats }
            : flight
        )
      );

      setShowBookingModal(false);
      setSelectedFlight(null);
      setSeatsToBook(1);
    } catch (error) {
      console.error('Error booking flight:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to book flight. Please try again.',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasActiveFilters = searchFrom || searchTo || searchDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors hover:bg-white/50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search, compare, and book flights to anywhere in the world
          </p>
        </div>

        {/* Week Calendar */}
        <div className="mb-8">
          <WeekCalendar onDateSelect={handleDateSelect} selectedDate={searchDate} />
        </div>

        {/* Modern Search Bar */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* From */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Enter origin city"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* To */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Enter destination city"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Date */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters && sortBy === 'price' && sortOrder === 'asc'}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium text-gray-900"
              >
                <option value="price">Price</option>
                <option value="seats">Available Seats</option>
                <option value="date">Date Added</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                {searchFrom && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    From: {searchFrom}
                    <button onClick={() => setSearchFrom('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTo && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    To: {searchTo}
                    <button onClick={() => setSearchTo('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchDate && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    Date: {new Date(searchDate).toLocaleDateString()}
                    <button onClick={() => setSearchDate('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-gray-600">
              {flights.length === 0 
                ? 'No flights found' 
                : `Found ${flights.length} flight${flights.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Flights List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-lg text-gray-600">Searching flights...</p>
            </div>
          </div>
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
              <Plane className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">No flights found</p>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <div
                key={flight._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {flight.flightName || 'Flight'}
                      </h3>
                      {flight.vendorId?.orgName && (
                        <p className="text-sm text-gray-500">{flight.vendorId.orgName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-gray-900">{flight.from || 'N/A'}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-semibold text-gray-900">{flight.to || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {flight.availableSeats || 0} / {flight.totalSeats || 0} seats
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-xl font-bold text-gray-900">
                        ${flight.price ? flight.price.toLocaleString() : '0.00'}
                      </span>
                    </div>
                  </div>

                  {flight.runDays && flight.runDays.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                      {flight.runDays.map((day, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBookFlight(flight)}
                  disabled={!flight.availableSeats || flight.availableSeats === 0}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                    flight.availableSeats && flight.availableSeats > 0
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {flight.availableSeats && flight.availableSeats > 0
                    ? 'Book Now'
                    : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedFlight && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Flight</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Flight</p>
                  <p className="font-bold text-lg text-gray-900">{selectedFlight.flightName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Route</p>
                  <p className="font-semibold text-gray-900">
                    {selectedFlight.from} → {selectedFlight.to}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price per seat</p>
                    <p className="font-semibold text-gray-900">
                      ${selectedFlight.price?.toLocaleString() || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available seats</p>
                    <p className="font-semibold text-gray-900">
                      {selectedFlight.availableSeats || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedFlight.availableSeats || 1}
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedFlight.availableSeats || 1)))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg font-semibold"
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-5 text-white">
                  <p className="text-sm opacity-90 mb-1">Total Price</p>
                  <p className="text-3xl font-bold">
                    ${((selectedFlight.price || 0) * seatsToBook).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBooking || seatsToBook > selectedFlight.availableSeats}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightService;
