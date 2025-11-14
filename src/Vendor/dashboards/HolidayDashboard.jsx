import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Users, DollarSign, TrendingUp, MapPin, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddHolidaysApi, VendorGetHolidaysApi } from '../../api/VendorApi';

const HolidayDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [toast, setToast] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    packageName: '',
    location: '',
    totalDays: '',
    cost: '',
    status: 'available',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setIsLoadingHolidays(true);
    try {
      const data = await VendorGetHolidaysApi();
      setHolidays(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setToast({ type: 'error', message: 'Failed to fetch holiday packages. Please try again.' });
    } finally {
      setIsLoadingHolidays(false);
    }
  };

  const totalHolidays = holidays.length;
  const availableHolidays = holidays.filter(h => h.status === 'available').length;
  const totalRevenue = holidays.reduce((sum, h) => sum + (h.cost || 0), 0);
  const avgDays = holidays.length > 0 ? (holidays.reduce((sum, h) => sum + (h.totalDays || 0), 0) / holidays.length).toFixed(1) : 0;

  const stats = [
    { title: 'Total Packages', value: totalHolidays.toString(), icon: Calendar, color: 'bg-blue-500' },
    { title: 'Available', value: availableHolidays.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Total Value', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Avg Days', value: avgDays.toString(), icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.packageName.trim()) newErrors.packageName = 'Package name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.totalDays || formData.totalDays <= 0) newErrors.totalDays = 'Total days must be greater than 0';
    if (!formData.cost || formData.cost <= 0) newErrors.cost = 'Cost must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddHolidaysApi({
        packageName: formData.packageName.trim(),
        location: formData.location.trim(),
        totalDays: Number(formData.totalDays),
        cost: Number(formData.cost),
        status: formData.status,
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Holiday package added successfully!' });
        setFormData({ packageName: '', location: '', totalDays: '', cost: '', status: 'available' });
        setErrors({});
        setShowAddModal(false);
        fetchHolidays();
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add holiday package. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ packageName: '', location: '', totalDays: '', cost: '', status: 'available' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Holiday Dashboard</h1>
            <p className="text-gray-600">Manage your holiday packages and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Holiday Package
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Holiday Packages List</h2>
        {isLoadingHolidays ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading packages...</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No holiday packages added yet. Click "Add Holiday Package" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holidays.map((holiday) => (
                  <tr key={holiday._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{holiday.packageName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {holiday.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holiday.totalDays} days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${holiday.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${holiday.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {holiday.status}
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
                <h2 className="text-2xl font-bold text-gray-900">Add New Holiday Package</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
                <input
                  type="text"
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.packageName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter package name"
                />
                {errors.packageName && <p className="mt-1 text-sm text-red-600">{errors.packageName}</p>}
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Days *</label>
                  <input
                    type="number"
                    value={formData.totalDays}
                    onChange={(e) => setFormData({ ...formData, totalDays: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.totalDays ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Days"
                    min="1"
                  />
                  {errors.totalDays && <p className="mt-1 text-sm text-red-600">{errors.totalDays}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost *</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.cost ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Cost"
                    min="0"
                    step="0.01"
                  />
                  {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="available">Available</option>
                  <option value="expired">Expired</option>
                </select>
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
                    'Add Package'
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

export default HolidayDashboard;
