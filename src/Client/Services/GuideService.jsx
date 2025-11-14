import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, ArrowLeft, Search, Navigation, DollarSign, Filter, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetGuidesApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';
import { useDebounce } from '../../hooks/useDebounce';

const GuideService = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchExpertise, setSearchExpertise] = useState('');
  const [statusFilter, setStatusFilter] = useState('free');
  const [sortBy, setSortBy] = useState('pricePerHour');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedExpertise = useDebounce(searchExpertise, 500);

  const fetchGuides = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetGuidesApi(
        debouncedLocation || undefined,
        debouncedExpertise || undefined,
        statusFilter,
        sortBy,
        sortOrder
      );
      setGuides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setToast({ type: 'error', message: 'Failed to fetch guides. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedLocation, debouncedExpertise, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleClearFilters = () => {
    setSearchLocation('');
    setSearchExpertise('');
    setStatusFilter('free');
    setSortBy('pricePerHour');
    setSortOrder('asc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 bg-indigo-100 rounded-full mb-6">
            <MapPin className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Guides</h1>
          <p className="text-xl text-gray-600">Expert guides for your adventures</p>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchExpertise}
                onChange={(e) => setSearchExpertise(e.target.value)}
                placeholder="Search by expertise area..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
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
            <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="free">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="">All</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pricePerHour">Price</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            {isLoading ? 'Loading...' : `Found ${guides.length} guide${guides.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading guides...</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-900 mb-2">No Guides Found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Navigation className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{guide.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {guide.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Expertise: {guide.expertiseLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{guide.hoursAvailable}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">${guide.pricePerHour} / hour</span>
                  </div>
                  <div className="pt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${guide.status === 'free' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {guide.status === 'free' && <CheckCircle className="w-3 h-3" />}
                      {guide.status === 'free' ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Book Guide
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideService;
