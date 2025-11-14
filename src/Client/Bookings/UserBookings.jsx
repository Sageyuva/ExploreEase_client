import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, MapPin, Calendar, Users, DollarSign, Package } from 'lucide-react';
import { UserBookingsApi } from '../../api/UserAuth';
import { Toast } from '../../ToastUp';
import Navbar from '../../components/Navbar';

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await UserBookingsApi();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setToast({
        type: 'error',
        message: 'Failed to load bookings. Please try again.',
      });
      if (error?.response?.status === 401) {
        setTimeout(() => navigate('/'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}

        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View all your flight bookings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/services/flights')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Book a Flight
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div
                key={booking.bookingId || index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {booking.flightName || 'Flight'}
                      </h3>
                      {booking.vendorName && (
                        <p className="text-sm text-gray-500">{booking.vendorName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-gray-900">
                      {booking.from || 'N/A'} → {booking.to || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {booking.seatsBooked || 0} seat{booking.seatsBooked !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-xl font-bold text-gray-900">
                      ${booking.totalPrice?.toLocaleString() || '0.00'}
                    </span>
                  </div>

                  {booking.bookedAt && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm pt-2 border-t border-gray-100">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Booked: {formatDate(booking.bookedAt)}</span>
                    </div>
                  )}
                </div>

                <div className="px-3 py-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium">Booking ID: {booking.bookingId?.slice(-8) || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;




