import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginAuth from './LoginAuth'
import VendorLogin from './VendorLogin'
import TravelRegister from './RegisterAuth'
import HomeScreen from './Client/Home/HomeScreen'
import AdminLogin from './admin/adminLogin'
import AdminDashboard from './admin/AdminDashboard'
import VendorDashboard from './vendor/VendorDashboard'
import FlightService from './Client/Services/FlightService'
import HotelService from './Client/Services/HotelService'
import HolidayService from './Client/Services/HolidayService'
import ShopService from './Client/Services/ShopService'
import GuideService from './Client/Services/GuideService'
import CurrencyService from './Client/Services/CurrencyService'
import EventService from './Client/Services/EventService'
import UserProfile from './Client/Profile/UserProfile'
import UserBookings from './Client/Bookings/UserBookings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginAuth />} />
        <Route path='/register' element={<TravelRegister />} />
        <Route path='/vendorAuth/login' element={<VendorLogin />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/vendor/*' element={<VendorDashboard />} />
        <Route path='/admin/*' element={<AdminDashboard />} />
        <Route path='/home' element={<HomeScreen />} />
        <Route path='/services/flights' element={<FlightService />} />
        <Route path='/services/hotels' element={<HotelService />} />
        <Route path='/services/holidays' element={<HolidayService />} />
        <Route path='/services/shops' element={<ShopService />} />
        <Route path='/services/guides' element={<GuideService />} />
        <Route path='/services/currency' element={<CurrencyService />} />
        <Route path='/services/events' element={<EventService />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/bookings' element={<UserBookings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
