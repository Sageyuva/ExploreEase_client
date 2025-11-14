import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Hotel, 
  Calendar, 
  ShoppingBag, 
  MapPin, 
  DollarSign, 
  PartyPopper,
  Search,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';

const HomeScreen = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'flight',
      name: 'Flights',
      icon: Plane,
      description: 'Book your flights to anywhere in the world',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      route: '/services/flights'
    },
    {
      id: 'hotel',
      name: 'Hotels',
      icon: Hotel,
      description: 'Find the perfect stay for your journey',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      route: '/services/hotels'
    },
    {
      id: 'holiday',
      name: 'Holiday Packages',
      icon: Calendar,
      description: 'Discover amazing holiday packages',
      color: 'from-emerald-500 to-teal-500',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      route: '/services/holidays'
    },
    {
      id: 'shop',
      name: 'Shopping',
      icon: ShoppingBag,
      description: 'Shop for travel essentials and souvenirs',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      route: '/services/shops'
    },
    {
      id: 'guide',
      name: 'Tour Guides',
      icon: MapPin,
      description: 'Expert guides for your adventures',
      color: 'from-indigo-500 to-blue-500',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      route: '/services/guides'
    },
    {
      id: 'currency',
      name: 'Currency Exchange',
      icon: DollarSign,
      description: 'Exchange currency at best rates',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      route: '/services/currency'
    },
    {
      id: 'event',
      name: 'Events',
      icon: PartyPopper,
      description: 'Discover exciting events and activities',
      color: 'from-pink-500 to-rose-500',
      hoverColor: 'hover:from-pink-600 hover:to-rose-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      route: '/services/events'
    }
  ];

  const handleServiceClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Globe className="w-12 h-12 text-blue-600 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ExploreX
              </h1>
              <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              Your Gateway to Unforgettable Adventures
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover flights, hotels, holiday packages, shopping, guides, currency exchange, and exciting events all in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for flights, hotels, packages..."
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need for your perfect journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.route)}
                className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 ${service.bgColor}`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-4 inline-flex p-4 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 ${service.bgColor}`}>
                    <Icon className={`w-8 h-8 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Arrow Button */}
                  <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${service.color} ${service.hoverColor} text-white px-4 py-2 rounded-lg w-fit transition-all duration-300 group-hover:shadow-lg`}>
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-8 h-8" />
            <h3 className="text-2xl font-bold">ExploreX</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Your trusted travel companion for all your journey needs
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 ExploreX. All rights reserved.
          </p>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default HomeScreen;
