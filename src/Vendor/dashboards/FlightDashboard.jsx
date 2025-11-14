import React, { useState, useEffect } from 'react';
import { Plane, Plus, Calendar, Users, DollarSign, TrendingUp, MapPin, User, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddFlightApi, VendorGetFlightsApi } from '../../api/VendorApi';

const FlightDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [toast, setToast] = useState(null);
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState({
    flightName: '',
    from: '',
    to: '',
    pilotName: '',
    totalSeats: '',
    availableSeats: '',
    price: '',
    runDays: [],
    specificDates: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch flights on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setIsLoadingFlights(true);
    try {
      const data = await VendorGetFlightsApi();
      setFlights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setToast({
        type: 'error',
        message: 'Failed to fetch flights. Please try again.',
      });
    } finally {
      setIsLoadingFlights(false);
    }
  };

  // Calculate stats from flights data
  const totalFlights = flights.length;
  const totalBookings = flights.reduce((sum, flight) => sum + (flight.totalSeats - flight.availableSeats), 0);
  const totalRevenue = flights.reduce((sum, flight) => sum + ((flight.totalSeats - flight.availableSeats) * (flight.price || 0)), 0);
  const avgGrowth = flights.length > 0 ? ((totalBookings / flights.reduce((sum, f) => sum + f.totalSeats, 0)) * 100).toFixed(1) : 0;

  const stats = [
    { title: 'Total Flights', value: totalFlights.toString(), icon: Plane, color: 'bg-blue-500' },
    { title: 'Bookings', value: totalBookings.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Occupancy', value: `${avgGrowth}%`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      runDays: prev.runDays.includes(day)
        ? prev.runDays.filter((d) => d !== day)
        : [...prev.runDays, day],
    }));
  };

  const handleAddDate = () => {
    if (selectedDate && !formData.specificDates.includes(selectedDate)) {
      setFormData((prev) => ({
        ...prev,
        specificDates: [...prev.specificDates, selectedDate],
      }));
      setSelectedDate('');
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specificDates: prev.specificDates.filter((date) => date !== dateToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.flightName.trim()) newErrors.flightName = 'Flight name is required';
    if (!formData.from.trim()) newErrors.from = 'Origin is required';
    if (!formData.to.trim()) newErrors.to = 'Destination is required';
    if (!formData.pilotName.trim()) newErrors.pilotName = 'Pilot name is required';
    if (!formData.totalSeats || formData.totalSeats <= 0) newErrors.totalSeats = 'Total seats must be greater than 0';
    if (!formData.availableSeats || formData.availableSeats < 0) newErrors.availableSeats = 'Available seats cannot be negative';
    if (parseInt(formData.availableSeats) > parseInt(formData.totalSeats)) {
      newErrors.availableSeats = 'Available seats cannot exceed total seats';
    }
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.runDays.length === 0 && formData.specificDates.length === 0) {
      newErrors.schedule = 'Please select at least one run day or specific date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const flightPayload = {
        flightName: formData.flightName,
        from: formData.from,
        to: formData.to,
        pilotName: formData.pilotName,
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: parseInt(formData.availableSeats),
        price: parseFloat(formData.price),
        runDays: formData.runDays,
        specificDates: formData.specificDates.length > 0 ? formData.specificDates : undefined,
      };

      const response = await VendorAddFlightApi(flightPayload);

      if (response?.message) {
        setToast({
          type: 'success',
          message: response.message || 'Flight added successfully!',
        });

        // Reset form
        setFormData({
          flightName: '',
          from: '',
          to: '',
          pilotName: '',
          totalSeats: '',
          availableSeats: '',
          price: '',
          runDays: [],
          specificDates: [],
        });
        setErrors({});
        setSelectedDate('');
        setShowAddModal(false);

        // Refresh flights list
        fetchFlights();
      }
    } catch (error) {
      console.error('Error adding flight:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add flight. Please try again.';

      setToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      flightName: '',
      from: '',
      to: '',
      pilotName: '',
      totalSeats: '',
      availableSeats: '',
      price: '',
      runDays: [],
      specificDates: [],
    });
    setErrors({});
    setSelectedDate('');
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {/* Toast Display */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Dashboard</h1>
            <p className="text-gray-600">Manage your flights and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Flight
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
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

      {/* Recent Flights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Flights</h2>
          {isLoadingFlights && (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>
        
        {isLoadingFlights ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>Loading flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No flights added yet. Click "Add Flight" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Flight Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pilot</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Seats</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-gray-900">{flight.flightName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {flight.from || 'N/A'} → {flight.to || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{flight.pilotName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {flight.availableSeats || 0}/{flight.totalSeats || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          ${flight.price ? flight.price.toLocaleString() : '0.00'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        {flight.runDays && flight.runDays.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {flight.runDays.map((day, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded"
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        )}
                        {flight.specificDates && flight.specificDates.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {flight.specificDates.slice(0, 2).map((date, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {new Date(date).toLocaleDateString()}
                              </span>
                            ))}
                            {flight.specificDates.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{flight.specificDates.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                        {(!flight.runDays || flight.runDays.length === 0) &&
                          (!flight.specificDates || flight.specificDates.length === 0) && (
                            <span className="text-gray-400 text-sm">No schedule</span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Flight</h2>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Flight Name */}
              <div>
                <label htmlFor="flightName" className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="flightName"
                    type="text"
                    value={formData.flightName}
                    onChange={(e) => setFormData({ ...formData, flightName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.flightName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Flight AA123"
                    required
                  />
                </div>
                {errors.flightName && <p className="mt-1 text-sm text-red-500">{errors.flightName}</p>}
              </div>

              {/* From and To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                    From (Origin) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="from"
                      type="text"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.from ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., New York"
                      required
                    />
                  </div>
                  {errors.from && <p className="mt-1 text-sm text-red-500">{errors.from}</p>}
                </div>

                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                    To (Destination) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="to"
                      type="text"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.to ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Los Angeles"
                      required
                    />
                  </div>
                  {errors.to && <p className="mt-1 text-sm text-red-500">{errors.to}</p>}
                </div>
              </div>

              {/* Pilot Name */}
              <div>
                <label htmlFor="pilotName" className="block text-sm font-medium text-gray-700 mb-2">
                  Pilot Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="pilotName"
                    type="text"
                    value={formData.pilotName}
                    onChange={(e) => setFormData({ ...formData, pilotName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.pilotName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter pilot name"
                    required
                  />
                </div>
                {errors.pilotName && <p className="mt-1 text-sm text-red-500">{errors.pilotName}</p>}
              </div>

              {/* Seats and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Seats <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="totalSeats"
                      type="number"
                      min="1"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.totalSeats ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 150"
                      required
                    />
                  </div>
                  {errors.totalSeats && <p className="mt-1 text-sm text-red-500">{errors.totalSeats}</p>}
                </div>

                <div>
                  <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Seats <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="availableSeats"
                      type="number"
                      min="0"
                      value={formData.availableSeats}
                      onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.availableSeats ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 120"
                      required
                    />
                  </div>
                  {errors.availableSeats && <p className="mt-1 text-sm text-red-500">{errors.availableSeats}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 299.99"
                      required
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>
              </div>

              {/* Run Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Run Days <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.runDays.includes(day)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.schedule && <p className="mt-1 text-sm text-red-500">{errors.schedule}</p>}
              </div>

              {/* Specific Dates */}
              <div>
                <label htmlFor="specificDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Dates (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="specificDate"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDate}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Add Date
                  </button>
                </div>
                {formData.specificDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specificDates.map((date, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm"
                      >
                        {new Date(date).toLocaleDateString()}
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(date)}
                          className="hover:text-emerald-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Flight'
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

export default FlightDashboard;
