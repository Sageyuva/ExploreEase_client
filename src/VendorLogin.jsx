import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, TrendingUp, Users, DollarSign, BarChart3, MailCheck } from 'lucide-react';
import { Toast } from './ToastUp';
import { VendorloginApi } from './api/VendorAuth';
import { useNavigate } from 'react-router-dom';

export default function VendorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({
        type: 'error',
        message: 'Please enter both email and password.',
      });
      return;
    }

    try {
      const response = await VendorloginApi(email, password);
      console.log('Vendor login response:', response);

      if (response && response.message === 'Login successful' && response.token) {
        // Save token, role, and type to localStorage
        localStorage.setItem('vendorToken', response.token);
        if (response.role) {
          localStorage.setItem('vendorRole', response.role);
        }
        if (response.type) {
          localStorage.setItem('vendorType', response.type);
        }

        setToast({
          type: 'success',
          message: 'Login successful! Redirecting...',
        });

        // Redirect based on vendor type
        const vendorType = response.type || 'flight';
        setTimeout(() => navigate(`/vendor/${vendorType}/dashboard`), 2000);
      } else {
        setToast({
          type: 'error',
          message: response?.message || 'Login failed. Please check your credentials.',
        });
      }
    } catch (error) {
      console.error('Vendor login error:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);

      let errorMessage = 'An error occurred. Please try again later.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 404) {
        errorMessage = 'Vendor not found. Please check your email.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your password.';
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      setToast({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative">
      {/* Toast Display */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ExploreX Vendor
            </span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor Login</h1>
            <p className="text-gray-600">Sign in to manage your business</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your business email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* SSO Options */}
          {/* <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#00A4EF" d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign in with Microsoft</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
            </button>
          </div> */}

          {/* Sign Up Link */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>New vendor?</strong> Partner with us today!
            </p>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
             Contact sale for registration <br />
           <p className="flex items-center gap-2">
             <MailCheck/> Sales@ExploreX.com
           </p>
            </button>
          </div>

          {/* Help Link */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Need help? Visit our{' '}
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">
              Vendor Support Center
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <h2 className="text-5xl font-bold mb-6">
            Grow Your Travel<br />Business With Us
          </h2>
          <p className="text-xl mb-12 text-emerald-100">
            Powerful tools and insights to manage bookings, track revenue, and reach millions of travelers.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Real-Time Analytics</h3>
                <p className="text-emerald-100">Track bookings, revenue, and performance with live dashboards</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Global Reach</h3>
                <p className="text-emerald-100">Connect with millions of travelers searching for their next adventure</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Flexible Pricing</h3>
                <p className="text-emerald-100">Set your own rates and manage inventory with complete control</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Revenue Growth</h3>
                <p className="text-emerald-100">Optimize your listings with AI-powered recommendations</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-emerald-100 text-sm">Active Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$500M+</div>
              <div className="text-emerald-100 text-sm">Annual Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-emerald-100 text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}