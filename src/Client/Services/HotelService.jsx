import React, { useState, useEffect, useCallback } from 'react';
import { Hotel, ArrowLeft, Search, MapPin, Users, DollarSign, Filter, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetHotelsApi, UserBookHotelApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';
import { useDebounce } from '../../hooks/useDebounce';

const HotelService = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [sortBy, setSortBy] = useState('costPerNight');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Booking Modal State
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [roomsToBook, setRoomsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const debouncedLocation = useDebounce(searchLocation, 500);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetHotelsApi(debouncedLocation || undefined, sortBy, sortOrder);
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setToast({ type: 'error', message: 'Failed to fetch hotels. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedLocation, sortBy, sortOrder]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleClearFilters = () => {
    setSearchLocation('');
    setSortBy('costPerNight');
    setSortOrder('asc');
  };

  const handleBookClick = (hotel) => {
    setSelectedHotel(hotel);
    setRoomsToBook(1);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;

    setIsBooking(true);
    try {
      await UserBookHotelApi(selectedHotel._id, roomsToBook);
      setToast({ type: 'success', message: 'Hotel booked successfully!' });
      setShowBookingModal(false);
      fetchHotels(); // Refresh to update available rooms
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to book hotel. Please try again.' 
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Hotel</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-purple-700 mb-1">{selectedHotel.hotelName}</h4>
              <p className="text-gray-600 flex items-center gap-1 text-sm mb-4">
                <MapPin className="w-4 h-4" /> {selectedHotel.location}
              </p>
              
              <div className="bg-purple-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per night:</span>
                  <span className="font-semibold">${selectedHotel.costPerNight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Rooms:</span>
                  <span className="font-semibold">{selectedHotel.availableRooms}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedHotel.availableRooms}
                  value={roomsToBook}
                  onChange={(e) => setRoomsToBook(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-purple-600">
                  ${(selectedHotel.costPerNight * roomsToBook).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isBooking || roomsToBook > selectedHotel.availableRooms}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
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
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 bg-purple-100 rounded-full mb-6">
            <Hotel className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hotel Services</h1>
          <p className="text-xl text-gray-600">Find the perfect stay for your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center gap-2"
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
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="costPerNight">Price</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            {isLoading ? 'Loading...' : `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Hotel className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-900 mb-2">No Hotels Found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Hotel className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{hotel.hotelName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{hotel.availableRooms} / {hotel.totalRooms} Rooms Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">${hotel.costPerNight} / night</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookClick(hotel)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelService;
