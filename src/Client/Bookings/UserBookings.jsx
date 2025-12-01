import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, MapPin, Calendar, Users, DollarSign, Package, Hotel, Navigation, ArrowLeftRight, Ticket } from 'lucide-react';
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

  const getBookingTypeConfig = (type) => {
    switch (type) {
      case 'hotel':
        return {
          icon: <Hotel className="w-6 h-6 text-white" />,
          gradient: 'from-purple-500 to-pink-500',
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          label: 'Hotel'
        };
      case 'flight':
        return {
          icon: <Plane className="w-6 h-6 text-white" />,
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: 'Flight'
        };
      case 'holiday':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          gradient: 'from-emerald-500 to-teal-500',
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          label: 'Holiday'
        };
      case 'guide':
        return {
          icon: <Navigation className="w-6 h-6 text-white" />,
          gradient: 'from-indigo-500 to-blue-500',
          bg: 'bg-indigo-100',
          text: 'text-indigo-700',
          label: 'Guide'
        };
      case 'currency':
        return {
          icon: <ArrowLeftRight className="w-6 h-6 text-white" />,
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'Currency'
        };
      case 'event':
        return {
          icon: <Ticket className="w-6 h-6 text-white" />,
          gradient: 'from-orange-500 to-red-500',
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          label: 'Event'
        };
      default:
        return {
          icon: <Package className="w-6 h-6 text-white" />,
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: 'Other'
        };
    }
  };

  const renderBookingDetails = (booking) => {
    switch (booking.type) {
      case 'hotel':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-gray-900">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.roomsBooked} room{booking.roomsBooked !== 1 ? 's' : ''}</span>
            </div>
          </>
        );
      case 'flight':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-900">{booking.from} → {booking.to}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.seatsBooked} seat{booking.seatsBooked !== 1 ? 's' : ''}</span>
            </div>
          </>
        );
      case 'holiday':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-gray-900">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.travelers} traveler{booking.travelers !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Travel Date: {new Date(booking.date).toLocaleDateString()}</span>
            </div>
          </>
        );
      case 'guide':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-gray-900">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Date: {new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Duration: {booking.hours} hours</span>
            </div>
          </>
        );
      case 'currency':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-gray-900">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">Amount: {booking.amount}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">Rate: ${booking.rate}</span>
            </div>
          </>
        );
      case 'event':
        return (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-gray-900">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Event Date: {new Date(booking.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.ticketsBooked} ticket{booking.ticketsBooked !== 1 ? 's' : ''}</span>
            </div>
          </>
        );
      default:
        return null;
    }
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
          <p className="text-gray-600">View all your travel bookings and services</p>
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
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/services/flights')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Book a Flight
              </button>
              <button
                onClick={() => navigate('/services/hotels')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Book a Hotel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => {
              const config = getBookingTypeConfig(booking.type);
              const name = booking.hotelName || booking.flightName || booking.packageName || booking.guideName || booking.currencyType || booking.eventName || 'Booking';
              
              return (
                <div
                  key={booking.bookingId || index}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl shadow-md bg-gradient-to-br ${config.gradient}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1" title={name}>
                          {name}
                        </h3>
                        {booking.vendorName && (
                          <p className="text-sm text-gray-500">{booking.vendorName}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {renderBookingDetails(booking)}

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-xl font-bold text-gray-900">
                        ${(booking.totalPrice || booking.totalCost || 0).toLocaleString()}
                      </span>
                    </div>

                    {booking.bookedAt && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm pt-2 border-t border-gray-100">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Booked: {formatDate(booking.bookedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className={`px-3 py-2 rounded-lg bg-gray-50`}>
                    <p className="text-xs font-medium text-gray-500">
                      Booking ID: {booking.bookingId?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;




