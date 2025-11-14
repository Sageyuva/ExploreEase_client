import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Building2, Plane, Hotel, Calendar, ShoppingBag, MapPin, DollarSign, PartyPopper } from 'lucide-react';

const VendorSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorType = localStorage.getItem('vendorType');

  // Get icon based on vendor type
  const getTypeIcon = () => {
    switch (vendorType) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Hotel;
      case 'holiday':
        return Calendar;
      case 'shop':
        return ShoppingBag;
      case 'guide':
        return MapPin;
      case 'currency':
        return DollarSign;
      case 'event':
        return PartyPopper;
      default:
        return Building2;
    }
  };

  const TypeIcon = getTypeIcon();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorRole');
    localStorage.removeItem('vendorType');
    navigate('/vendorAuth/login');
  };

  const getDashboardPath = () => {
    if (vendorType) {
      return `/vendor/${vendorType}/dashboard`;
    }
    return '/vendorAuth/login';
  };

  const isActive = (path) => currentPath === path;

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-emerald-900 to-teal-900 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <TypeIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ExploreX</h1>
            <p className="text-xs text-emerald-200 capitalize">{vendorType || 'Vendor'} Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <button
          onClick={() => navigate(getDashboardPath())}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
            isActive(getDashboardPath())
              ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
              : 'text-emerald-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${isActive(getDashboardPath()) ? 'text-white' : 'text-emerald-300'}`} />
          <span className="font-medium">Dashboard</span>
        </button>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-200 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default VendorSideBar;

