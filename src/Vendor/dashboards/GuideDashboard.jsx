import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Users, DollarSign, TrendingUp, Navigation, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddGuidesApi, VendorGetGuidesApi } from '../../api/VendorApi';

const GuideDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [toast, setToast] = useState(null);
  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    expertiseLocation: '',
    hoursAvailable: '',
    pricePerHour: '',
    status: 'free',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const data = await VendorGetGuidesApi();
      setGuides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setToast({ type: 'error', message: 'Failed to fetch guides. Please try again.' });
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const totalGuides = guides.length;
  const freeGuides = guides.filter(g => g.status === 'free').length;
  const totalRevenue = guides.reduce((sum, g) => sum + (g.pricePerHour || 0), 0);
  const avgPrice = guides.length > 0 ? (totalRevenue / guides.length).toFixed(2) : 0;

  const stats = [
    { title: 'Total Guides', value: totalGuides.toString(), icon: Navigation, color: 'bg-blue-500' },
    { title: 'Available', value: freeGuides.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Total Value', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Avg Price/Hr', value: `$${avgPrice}`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Guide name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.expertiseLocation.trim()) newErrors.expertiseLocation = 'Expertise location is required';
    if (!formData.hoursAvailable.trim()) newErrors.hoursAvailable = 'Hours available is required';
    if (!formData.pricePerHour || formData.pricePerHour <= 0) newErrors.pricePerHour = 'Price per hour must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddGuidesApi({
        name: formData.name.trim(),
        location: formData.location.trim(),
        expertiseLocation: formData.expertiseLocation.trim(),
        hoursAvailable: formData.hoursAvailable.trim(),
        pricePerHour: Number(formData.pricePerHour),
        status: formData.status,
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Guide added successfully!' });
        setFormData({ name: '', location: '', expertiseLocation: '', hoursAvailable: '', pricePerHour: '', status: 'free' });
        setErrors({});
        setShowAddModal(false);
        fetchGuides();
      }
    } catch (error) {
      console.error('Error adding guide:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add guide. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', expertiseLocation: '', hoursAvailable: '', pricePerHour: '', status: 'free' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Guide Dashboard</h1>
            <p className="text-gray-600">Manage your tours and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Guide
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guides List</h2>
        {isLoadingGuides ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading guides...</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No guides added yet. Click "Add Guide" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hr</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guides.map((guide) => (
                  <tr key={guide._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guide.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {guide.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.expertiseLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.hoursAvailable}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${guide.pricePerHour}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${guide.status === 'free' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {guide.status}
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
                <h2 className="text-2xl font-bold text-gray-900">Add New Guide</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guide Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter guide name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Location"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Location *</label>
                  <input
                    type="text"
                    value={formData.expertiseLocation}
                    onChange={(e) => setFormData({ ...formData, expertiseLocation: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.expertiseLocation ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Expertise location"
                  />
                  {errors.expertiseLocation && <p className="mt-1 text-sm text-red-600">{errors.expertiseLocation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours Available *</label>
                  <input
                    type="text"
                    value={formData.hoursAvailable}
                    onChange={(e) => setFormData({ ...formData, hoursAvailable: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.hoursAvailable ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., 9 AM - 5 PM"
                  />
                  {errors.hoursAvailable && <p className="mt-1 text-sm text-red-600">{errors.hoursAvailable}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour *</label>
                  <input
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.pricePerHour ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                  {errors.pricePerHour && <p className="mt-1 text-sm text-red-600">{errors.pricePerHour}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="free">Free</option>
                  <option value="occupied">Occupied</option>
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
                    'Add Guide'
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

export default GuideDashboard;
