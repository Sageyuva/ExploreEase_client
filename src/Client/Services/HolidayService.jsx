import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowLeft, Search, MapPin, DollarSign, Filter, X, RefreshCw, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetHolidaysApi } from '../../api/UserApi';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
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
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Details
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
