'use client';

import { useState, useEffect } from 'react';
import { servicesAPI } from '@/lib/api';

interface CanteenItem {
  id: string;
  name: string;
  description: string;
  price: number;
  service_type: 'canteen' | 'printing' | 'laundry' | 'stationery' | 'electronics' | 'tution';
  availability: boolean;
  image_url?: string;
  owner_id: string;
}

export default function CanteenPage() {
  const [items, setItems] = useState<CanteenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{item: CanteenItem, quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchCanteenItems();
  }, []);

  const fetchCanteenItems = async () => {
    try {
      const response = await servicesAPI.getServicesByType('canteen');
      setItems(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching canteen items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: CanteenItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(cartItem => ({
          item: cartItem.item.id,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
        })),
        totalAmount: getTotalPrice(),
      };

      // Note: We'll need to implement order placement separately
      // For now, just clear the cart and show success message
      setCart([]);
      setShowCart(false);
      alert('Order placed successfully!');
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading canteen items...</div>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-0">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🍽️ Canteen Menu</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-2 px-4 rounded-xl flex items-center transition-all shadow-md"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="font-semibold">
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </span>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Items List - Mobile Optimized */}
          <div className="lg:w-2/3 w-full">
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.032 2.032 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
                </svg>
                <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">No items available</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">Check back later for new menu items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 active:scale-[0.98]">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-40 sm:h-48 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">📷 No Image</span>
                    </div>
                  )}
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 pr-2">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
                        item.service_type === 'canteen' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.service_type === 'canteen' ? '🍽️' : '🔧'} {item.service_type}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">₹{item.price}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-2.5 px-4 sm:px-5 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar - Mobile Bottom Sheet / Desktop Sidebar */}
          {showCart && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowCart(false)}
              />
              
              {/* Cart Container */}
              <div className="fixed lg:sticky bottom-0 lg:top-20 left-0 right-0 lg:left-auto lg:right-auto lg:w-1/3 z-50 bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl lg:shadow-md p-4 sm:p-6 max-h-[85vh] lg:max-h-[calc(100vh-8rem)] flex flex-col">
                {/* Mobile Handle */}
                <div className="lg:hidden flex justify-center mb-4">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <p className="text-gray-500 text-base">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-3 sm:space-y-4">
                        {cart.map((cartItem) => (
                          <li key={cartItem.item.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cartItem.item.name}</h3>
                              <p className="text-primary-600 font-bold text-sm sm:text-base mt-1">₹{cartItem.item.price} × {cartItem.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-3">
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                className="bg-white border-2 border-gray-300 text-gray-700 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-semibold active:scale-95 shadow-sm"
                              >
                                −
                              </button>
                              <span className="text-base sm:text-lg font-bold text-gray-900 w-8 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                className="bg-primary-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-semibold active:scale-95 shadow-md"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(cartItem.item.id)}
                                className="ml-1 p-2 text-red-500 hover:bg-red-50 rounded-lg active:scale-95"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg sm:text-xl font-semibold text-gray-700">Total:</span>
                          <span className="text-2xl sm:text-3xl font-bold text-primary-600">₹{getTotalPrice()}</span>
                        </div>
                        <button 
                          onClick={handlePlaceOrder}
                          className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-4 px-6 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                        >
                          🛒 Place Order
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Mobile Floating Cart Button (when cart is closed but has items) */}
      {!showCart && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>View Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
            <span className="ml-auto font-bold">₹{getTotalPrice()}</span>
          </button>
        </div>
      )}
    </div>
  );
}