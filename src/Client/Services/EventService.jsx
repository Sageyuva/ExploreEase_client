import React, { useState, useEffect, useCallback } from 'react';
import { PartyPopper, ArrowLeft, Search, MapPin, DollarSign, Filter, RefreshCw, Calendar, Users, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetEventsApi, UserBookEventApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';
import { useDebounce } from '../../hooks/useDebounce';

const EventService = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortBy, setSortBy] = useState('eventDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Booking Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedDate = useDebounce(searchDate, 500);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetEventsApi(
        debouncedLocation || undefined,
        debouncedDate || undefined,
        sortBy,
        sortOrder
      );
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setToast({ type: 'error', message: 'Failed to fetch events. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedLocation, debouncedDate, sortBy, sortOrder]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleClearFilters = () => {
    setSearchLocation('');
    setSearchDate('');
    setSortBy('eventDate');
    setSortOrder('asc');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setTicketsToBook(1);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsBooking(true);
    try {
      await UserBookEventApi(selectedEvent._id, ticketsToBook);
      setToast({ type: 'success', message: 'Event booked successfully!' });
      setShowBookingModal(false);
      fetchEvents(); // Refresh to update available tickets
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to book event. Please try again.' 
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Event</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-pink-700 mb-1">{selectedEvent.eventName}</h4>
              <p className="text-gray-600 flex items-center gap-1 text-sm mb-4">
                <MapPin className="w-4 h-4" /> {selectedEvent.location}
              </p>
              
              <div className="bg-pink-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-semibold">${selectedEvent.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Tickets:</span>
                  <span className="font-semibold">{selectedEvent.availableTickets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formatDate(selectedEvent.eventDate)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedEvent.availableTickets}
                  value={ticketsToBook}
                  onChange={(e) => setTicketsToBook(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-pink-600">
                  ${(selectedEvent.price * ticketsToBook).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isBooking || ticketsToBook > selectedEvent.availableTickets}
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {isBooking ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 bg-pink-100 rounded-full mb-6">
            <PartyPopper className="w-16 h-16 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-xl text-gray-600">Discover exciting events and activities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-pink-100 text-pink-700 rounded-lg font-medium hover:bg-pink-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Clear
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="eventDate">Event Date</option>
                  <option value="price">Price</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `Found ${events.length} event${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <PartyPopper className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-100 rounded-xl">
                    <PartyPopper className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{event.eventName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{event.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{event.availableTickets} / {event.totalTickets} Tickets Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">${event.price} / ticket</span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 pt-2 border-t border-gray-100">{event.description}</p>
                  )}
                </div>

                <button
                  onClick={() => handleBookClick(event)}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-medium hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Book Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventService;
