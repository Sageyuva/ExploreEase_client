import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowLeft, Search, MapPin, DollarSign, Filter, X, RefreshCw, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetHolidaysApi, UserBookHolidayApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';
import { useDebounce } from '../../hooks/useDebounce';

const HolidayService = () => {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [sortBy, setSortBy] = useState('cost');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Booking Modal State
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const debouncedLocation = useDebounce(searchLocation, 500);

  const fetchHolidays = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetHolidaysApi(debouncedLocation || undefined, sortBy, sortOrder);
      setHolidays(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setToast({ type: 'error', message: 'Failed to fetch holiday packages. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedLocation, sortBy, sortOrder]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleClearFilters = () => {
    setSearchLocation('');
    setSortBy('cost');
    setSortOrder('asc');
  };

  const handleBookClick = (holiday) => {
    setSelectedHoliday(holiday);
    setTravelers(1);
    setTravelDate('');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHoliday) return;

    setIsBooking(true);
    try {
      await UserBookHolidayApi(selectedHoliday._id, travelers, travelDate);
      setToast({ type: 'success', message: 'Holiday package booked successfully!' });
      setShowBookingModal(false);
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to book holiday package. Please try again.' 
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      {/* Booking Modal */}
      {showBookingModal && selectedHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Holiday Package</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-emerald-700 mb-1">{selectedHoliday.packageName}</h4>
              <p className="text-gray-600 flex items-center gap-1 text-sm mb-4">
                <MapPin className="w-4 h-4" /> {selectedHoliday.location}
              </p>
              
              <div className="bg-emerald-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost per person:</span>
                  <span className="font-semibold">${selectedHoliday.cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedHoliday.totalDays} Days</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Cost:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${(selectedHoliday.cost * travelers).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
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
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 bg-emerald-100 rounded-full mb-6">
            <Calendar className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Holiday Packages</h1>
          <p className="text-xl text-gray-600">Discover amazing holiday packages</p>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors flex items-center gap-2"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="cost">Price</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
            {isLoading ? 'Loading...' : `Found ${holidays.length} package${holidays.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading packages...</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-900 mb-2">No Packages Found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holidays.map((holiday) => (
              <div key={holiday._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{holiday.packageName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {holiday.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{holiday.totalDays} Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">${holiday.cost.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${holiday.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {holiday.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookClick(holiday)}
                  disabled={holiday.status !== 'available'}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {holiday.status === 'available' ? 'Book Package' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayService;
