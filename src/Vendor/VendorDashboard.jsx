import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorSideBar from './components/VendorSideBar';
import FlightDashboard from './dashboards/FlightDashboard';
import HotelDashboard from './dashboards/HotelDashboard';
import HolidayDashboard from './dashboards/HolidayDashboard';
import ShopDashboard from './dashboards/ShopDashboard';
import GuideDashboard from './dashboards/GuideDashboard';
import CurrencyDashboard from './dashboards/CurrencyDashboard';
import EventDashboard from './dashboards/EventDashboard';

const VendorDashboard = () => {
  const vendorType = localStorage.getItem('vendorType');
  const vendorToken = localStorage.getItem('vendorToken');

  // Redirect to appropriate dashboard based on vendor type
  const getDefaultPath = () => {
    if (vendorType) {
      return `/vendor/${vendorType}/dashboard`;
    }
    return '/vendorAuth/login';
  };

  // If no vendor token, redirect to login
  useEffect(() => {
    if (!vendorToken) {
      window.location.href = '/vendorAuth/login';
    }
  }, [vendorToken]);

  if (!vendorToken) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <VendorSideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to={getDefaultPath()} replace />} />
          <Route path="flight/dashboard" element={<FlightDashboard />} />
          <Route path="hotel/dashboard" element={<HotelDashboard />} />
          <Route path="holiday/dashboard" element={<HolidayDashboard />} />
          <Route path="shop/dashboard" element={<ShopDashboard />} />
          <Route path="guide/dashboard" element={<GuideDashboard />} />
          <Route path="currency/dashboard" element={<CurrencyDashboard />} />
          <Route path="event/dashboard" element={<EventDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default VendorDashboard;

