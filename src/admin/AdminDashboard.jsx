import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from './components/SideBar';
import AdminUsers from './AdminUsers';
import AdminVendors from './AdminVendors';
import DashboardHome from './DashboardHome';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vendors" element={<AdminVendors />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
