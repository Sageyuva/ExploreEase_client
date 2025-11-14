import React, { useState, useEffect } from 'react';
import { PartyPopper, Plus, Users, DollarSign, TrendingUp, Calendar, MapPin, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddEventsApi, VendorGetEventsApi } from '../../api/VendorApi';

const EventDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [toast, setToast] = useState(null);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    location: '',
    eventDate: '',
    eventTime: '',
    totalTickets: '',
    availableTickets: '',
    price: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const data = await VendorGetEventsApi();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setToast({ type: 'error', message: 'Failed to fetch events. Please try again.' });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const totalEvents = events.length;
  const totalBookings = events.reduce((sum, e) => sum + (e.totalTickets - e.availableTickets), 0);
  const totalRevenue = events.reduce((sum, e) => sum + ((e.totalTickets - e.availableTickets) * (e.price || 0)), 0);
  const avgOccupancy = events.length > 0 ? ((totalBookings / events.reduce((sum, e) => sum + e.totalTickets, 0)) * 100).toFixed(1) : 0;

  const stats = [
    { title: 'Total Events', value: totalEvents.toString(), icon: Calendar, color: 'bg-blue-500' },
    { title: 'Bookings', value: totalBookings.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Occupancy', value: `${avgOccupancy}%`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime.trim()) newErrors.eventTime = 'Event time is required';
    if (!formData.totalTickets || formData.totalTickets <= 0) newErrors.totalTickets = 'Total tickets must be greater than 0';
    if (!formData.availableTickets || formData.availableTickets < 0) newErrors.availableTickets = 'Available tickets cannot be negative';
    if (Number(formData.availableTickets) > Number(formData.totalTickets)) newErrors.availableTickets = 'Available tickets cannot exceed total tickets';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddEventsApi({
        eventName: formData.eventName.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        eventTime: formData.eventTime.trim(),
        totalTickets: Number(formData.totalTickets),
        availableTickets: Number(formData.availableTickets),
        price: Number(formData.price),
        description: formData.description.trim() || undefined,
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Event added successfully!' });
        setFormData({ eventName: '', location: '', eventDate: '', eventTime: '', totalTickets: '', availableTickets: '', price: '', description: '' });
        setErrors({});
        setShowAddModal(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add event. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ eventName: '', location: '', eventDate: '', eventTime: '', totalTickets: '', availableTickets: '', price: '', description: '' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
            <p className="text-gray-600">Manage your events and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Event
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Events List</h2>
        {isLoadingEvents ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PartyPopper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No events added yet. Click "Add Event" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.eventName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.eventDate).toLocaleDateString()} {event.eventTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.availableTickets}/{event.totalTickets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${event.price}</td>
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
                <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.eventName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter event name"
                />
                {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.eventDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.eventTime ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.eventTime && <p className="mt-1 text-sm text-red-600">{errors.eventTime}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Tickets *</label>
                  <input
                    type="number"
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.totalTickets ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Total tickets"
                    min="1"
                  />
                  {errors.totalTickets && <p className="mt-1 text-sm text-red-600">{errors.totalTickets}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Tickets *</label>
                  <input
                    type="number"
                    value={formData.availableTickets}
                    onChange={(e) => setFormData({ ...formData, availableTickets: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.availableTickets ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Available tickets"
                    min="0"
                  />
                  {errors.availableTickets && <p className="mt-1 text-sm text-red-600">{errors.availableTickets}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter price per ticket"
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter event description (optional)"
                  rows="3"
                />
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
                    'Add Event'
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

export default EventDashboard;
