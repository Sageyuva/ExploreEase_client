import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Users, DollarSign, TrendingUp, Package, MapPin, X } from 'lucide-react';
import { Toast } from '../../ToastUp';
import { VendorAddShopsApi, VendorGetShopsApi } from '../../api/VendorApi';

const ShopDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [toast, setToast] = useState(null);
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    shopName: '',
    location: '',
    items: [],
  });
  const [itemForm, setItemForm] = useState({ name: '', image: '', price: '', status: 'available' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setIsLoadingShops(true);
    try {
      const data = await VendorGetShopsApi();
      setShops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setToast({ type: 'error', message: 'Failed to fetch shops. Please try again.' });
    } finally {
      setIsLoadingShops(false);
    }
  };

  const totalShops = shops.length;
  const totalItems = shops.reduce((sum, shop) => sum + (shop.items?.length || 0), 0);
  const totalRevenue = shops.reduce((sum, shop) => {
    const shopRevenue = shop.items?.reduce((itemSum, item) => itemSum + (item.price || 0), 0) || 0;
    return sum + shopRevenue;
  }, 0);
  const avgItems = shops.length > 0 ? (totalItems / shops.length).toFixed(1) : 0;

  const stats = [
    { title: 'Total Shops', value: totalShops.toString(), icon: Package, color: 'bg-blue-500' },
    { title: 'Total Items', value: totalItems.toString(), icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Total Value', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Avg Items', value: avgItems.toString(), icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const handleAddItem = () => {
    if (!itemForm.name.trim() || !itemForm.price || itemForm.price <= 0) {
      setToast({ type: 'error', message: 'Please fill item name and price' });
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, { ...itemForm, price: Number(itemForm.price) }],
    });
    setItemForm({ name: '', image: '', price: '', status: 'available' });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await VendorAddShopsApi({
        shopName: formData.shopName.trim(),
        location: formData.location.trim(),
        items: formData.items,
      });

      if (response?.message) {
        setToast({ type: 'success', message: response.message || 'Shop added successfully!' });
        setFormData({ shopName: '', location: '', items: [] });
        setItemForm({ name: '', image: '', price: '', status: 'available' });
        setErrors({});
        setShowAddModal(false);
        fetchShops();
      }
    } catch (error) {
      console.error('Error adding shop:', error);
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to add shop. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ shopName: '', location: '', items: [] });
    setItemForm({ name: '', image: '', price: '', status: 'available' });
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      {toast && <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Dashboard</h1>
            <p className="text-gray-600">Manage your shops and products</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Shop
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shops List</h2>
        {isLoadingShops ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shops...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No shops added yet. Click "Add Shop" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shops.map((shop) => (
              <div key={shop._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{shop.shopName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {shop.location}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Items: {shop.items?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Shop</h2>
                <button type="button" onClick={resetForm} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name *</label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.shopName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter shop name"
                />
                {errors.shopName && <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>}
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

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Items</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Add Item
                </button>

                {formData.items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{item.name} - ${item.price}</span>
                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    'Add Shop'
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

export default ShopDashboard;
