import React, { useState, useEffect } from 'react';
import { Hotel, Plus, Users, DollarSign, TrendingUp, MapPin, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddHotelsApi, VendorGetHotelsApi } from '../../api/VendorApi';

const HotelDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [toast, setToast] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    hotelName: '',
    totalRooms: '',
    availableRooms: '',
    costPerNight: '',
    location: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoadingHotels(true);
    try {
      const data = await VendorGetHotelsApi();
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setToast({ type: 'error', message: 'Failed to fetch hotels. Please try again.' });
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const totalHotels = hotels.length;
  const totalBookings = hotels.reduce((sum, hotel) => sum + (hotel.totalRooms - hotel.availableRooms), 0);
  const totalRevenue = hotels.reduce((sum, hotel) => sum + ((hotel.totalRooms - hotel.availableRooms) * (hotel.costPerNight || 0)), 0);
  const avgOccupancy = hotels.length > 0 ? ((totalBookings / hotels.reduce((sum, h) => sum + h.totalRooms, 0)) * 100).toFixed(1) : 0;

  const stats = [
    { title: 'Total Hotels', value: totalHotels.toString(), icon: Hotel, color: 'bg-blue-500' },
    { title: 'Bookings', value: totalBookings.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Occupancy', value: `${avgOccupancy}%`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.hotelName.trim()) newErrors.hotelName = 'Hotel name is required';
    if (!formData.totalRooms || formData.totalRooms <= 0) newErrors.totalRooms = 'Total rooms must be greater than 0';
    if (!formData.availableRooms || formData.availableRooms < 0) newErrors.availableRooms = 'Available rooms cannot be negative';
    if (Number(formData.availableRooms) > Number(formData.totalRooms)) newErrors.availableRooms = 'Available rooms cannot exceed total rooms';
    if (!formData.costPerNight || formData.costPerNight <= 0) newErrors.costPerNight = 'Cost per night must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddHotelsApi({
        hotelName: formData.hotelName.trim(),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        costPerNight: Number(formData.costPerNight),
        location: formData.location.trim(),
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Hotel added successfully!' });
        setFormData({ hotelName: '', totalRooms: '', availableRooms: '', costPerNight: '', location: '' });
        setErrors({});
        setShowAddModal(false);
        fetchHotels();
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add hotel. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ hotelName: '', totalRooms: '', availableRooms: '', costPerNight: '', location: '' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Dashboard</h1>
            <p className="text-gray-600">Manage your hotels and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Hotel
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hotels List</h2>
        {isLoadingHotels ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No hotels added yet. Click "Add Hotel" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Night</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.hotelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.totalRooms}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.availableRooms}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${hotel.costPerNight}</td>
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
                <h2 className="text-2xl font-bold text-gray-900">Add New Hotel</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.hotelName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter hotel name"
                />
                {errors.hotelName && <p className="mt-1 text-sm text-red-600">{errors.hotelName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms *</label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.totalRooms ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Total rooms"
                    min="1"
                  />
                  {errors.totalRooms && <p className="mt-1 text-sm text-red-600">{errors.totalRooms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms *</label>
                  <input
                    type="number"
                    value={formData.availableRooms}
                    onChange={(e) => setFormData({ ...formData, availableRooms: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.availableRooms ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Available rooms"
                    min="0"
                  />
                  {errors.availableRooms && <p className="mt-1 text-sm text-red-600">{errors.availableRooms}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Night *</label>
                <input
                  type="number"
                  value={formData.costPerNight}
                  onChange={(e) => setFormData({ ...formData, costPerNight: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.costPerNight ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter cost per night"
                  min="0"
                  step="0.01"
                />
                {errors.costPerNight && <p className="mt-1 text-sm text-red-600">{errors.costPerNight}</p>}
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
                    'Add Hotel'
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

export default HotelDashboard;
