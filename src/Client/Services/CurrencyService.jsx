import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ArrowLeft, Search, MapPin, Filter, RefreshCw, ArrowLeftRight, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGetCurrencyApi, UserBookCurrencyApi } from '../../api/UserApi';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';
import { useDebounce } from '../../hooks/useDebounce';

const CurrencyService = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCurrencyType, setSearchCurrencyType] = useState('');
  const [statusFilter, setStatusFilter] = useState('in stock');
  const [sortBy, setSortBy] = useState('rate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Booking Modal State
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedCurrencyType = useDebounce(searchCurrencyType, 500);

  const fetchCurrency = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UserGetCurrencyApi(
        debouncedLocation || undefined,
        debouncedCurrencyType || undefined,
        statusFilter,
        sortBy,
        sortOrder
      );
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching currency:', error);
      setToast({ type: 'error', message: 'Failed to fetch currency exchanges. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedLocation, debouncedCurrencyType, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  const handleClearFilters = () => {
    setSearchLocation('');
    setSearchCurrencyType('');
    setStatusFilter('in stock');
    setSortBy('rate');
    setSortOrder('asc');
  };

  const handleBookClick = (currency) => {
    setSelectedCurrency(currency);
    setAmountToExchange(1);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCurrency) return;

    setIsBooking(true);
    try {
      await UserBookCurrencyApi(selectedCurrency._id, amountToExchange);
      setToast({ type: 'success', message: 'Currency reserved successfully!' });
      setShowBookingModal(false);
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to reserve currency. Please try again.' 
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      {/* Booking Modal */}
      {showBookingModal && selectedCurrency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Exchange Currency</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-green-700 mb-1">{selectedCurrency.currencyType}</h4>
              <p className="text-gray-600 flex items-center gap-1 text-sm mb-4">
                <MapPin className="w-4 h-4" /> {selectedCurrency.location}
              </p>
              
              <div className="bg-green-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="font-semibold">${selectedCurrency.rate}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Exchange
                </label>
                <input
                  type="number"
                  min="1"
                  value={amountToExchange}
                  onChange={(e) => setAmountToExchange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Cost:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${(selectedCurrency.rate * amountToExchange).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {isBooking ? 'Processing...' : 'Confirm Exchange'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-6 bg-green-100 rounded-full mb-6">
            <DollarSign className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Currency Exchange</h1>
          <p className="text-xl text-gray-600">Exchange currency at best rates</p>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <ArrowLeftRight className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchCurrencyType}
                onChange={(e) => setSearchCurrencyType(e.target.value)}
                placeholder="Search by currency type (USD, EUR, etc.)..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="in stock">In Stock</option>
                  <option value="out of stock">Out of Stock</option>
                  <option value="">All</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="rate">Rate</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            {isLoading ? 'Loading...' : `Found ${currencies.length} exchange${currencies.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading exchanges...</p>
          </div>
        ) : currencies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <DollarSign className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-900 mb-2">No Exchanges Found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currencies.map((currency) => (
              <div key={currency._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ArrowLeftRight className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{currency.currencyType}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currency.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700 text-lg">Rate: ${currency.rate}</span>
                  </div>
                  <div className="pt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${currency.status === 'in stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currency.status === 'in stock' && <CheckCircle className="w-3 h-3" />}
                      {currency.status === 'in stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookClick(currency)}
                  disabled={currency.status !== 'in stock'}
                  className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currency.status === 'in stock' ? 'Exchange Now' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyService;
