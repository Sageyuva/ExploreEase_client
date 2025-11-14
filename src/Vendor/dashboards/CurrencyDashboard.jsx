import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Users, TrendingUp, ArrowLeftRight, MapPin, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddCurrencyApi, VendorGetCurrencyApi } from '../../api/VendorApi';

const CurrencyDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(false);
  const [toast, setToast] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    location: '',
    currencyType: '',
    rate: '',
    status: 'in stock',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCurrency();
  }, []);

  const fetchCurrency = async () => {
    setIsLoadingCurrency(true);
    try {
      const data = await VendorGetCurrencyApi();
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching currency:', error);
      setToast({ type: 'error', message: 'Failed to fetch currency exchanges. Please try again.' });
    } finally {
      setIsLoadingCurrency(false);
    }
  };

  const totalCurrency = currencies.length;
  const inStock = currencies.filter(c => c.status === 'in stock').length;
  const totalVolume = currencies.reduce((sum, c) => sum + (c.rate || 0), 0);
  const avgRate = currencies.length > 0 ? (totalVolume / currencies.length).toFixed(2) : 0;

  const stats = [
    { title: 'Total Exchanges', value: totalCurrency.toString(), icon: ArrowLeftRight, color: 'bg-blue-500' },
    { title: 'In Stock', value: inStock.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Total Volume', value: `$${totalVolume.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Avg Rate', value: avgRate.toString(), icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.currencyType.trim()) newErrors.currencyType = 'Currency type is required';
    if (!formData.rate || formData.rate <= 0) newErrors.rate = 'Rate must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddCurrencyApi({
        location: formData.location.trim(),
        currencyType: formData.currencyType.trim(),
        rate: Number(formData.rate),
        status: formData.status,
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Currency exchange added successfully!' });
        setFormData({ location: '', currencyType: '', rate: '', status: 'in stock' });
        setErrors({});
        setShowAddModal(false);
        fetchCurrency();
      }
    } catch (error) {
      console.error('Error adding currency:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add currency exchange. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ location: '', currencyType: '', rate: '', status: 'in stock' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency Dashboard</h1>
            <p className="text-gray-600">Manage your currency exchange services</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Exchange Rate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Exchange Rates List</h2>
        {isLoadingCurrency ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exchange rates...</p>
          </div>
        ) : currencies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No exchange rates added yet. Click "Add Exchange Rate" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currencies.map((currency) => (
                  <tr key={currency._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {currency.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{currency.currencyType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${currency.rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currency.status === 'in stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {currency.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Exchange Rate</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter location"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Type *</label>
                <input
                  type="text"
                  value={formData.currencyType}
                  onChange={(e) => setFormData({ ...formData, currencyType: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.currencyType ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., USD, EUR, GBP"
                />
                {errors.currencyType && <p className="mt-1 text-sm text-red-600">{errors.currencyType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate *</label>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.rate ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Exchange rate"
                    min="0"
                    step="0.01"
                  />
                  {errors.rate && <p className="mt-1 text-sm text-red-600">{errors.rate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} disabled={isLoading} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Exchange Rate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyDashboard;
