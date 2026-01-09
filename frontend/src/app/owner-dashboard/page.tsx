'use client';

import { useState } from 'react';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  // Mock data for demonstration
  const services = [
    { id: 'canteen', name: 'Canteen', description: 'Manage food items and orders', link: '/canteen-owner' },
    { id: 'rooms', name: 'Rooms', description: 'Manage room listings and bookings', link: '/rooms' },
    { id: 'laundry', name: 'Laundry', description: 'Manage laundry services', link: '/laundry-owner' },
    { id: 'printing', name: 'Printing', description: 'Manage printing services', link: '/printing-owner' },
  ];

  // Mock data for demonstration
  const orders = [
    {
      id: '1',
      customer: 'Rohit Sharma',
      items: ['Veg Burger', 'Fries'],
      total: 150,
      status: 'pending',
      time: '10:30 AM',
    },
    {
      id: '2',
      customer: 'Priya Patel',
      items: ['Chicken Pizza', 'Coke'],
      total: 320,
      status: 'preparing',
      time: '10:45 AM',
    },
    {
      id: '3',
      customer: 'Amit Kumar',
      items: ['Pasta', 'Garlic Bread'],
      total: 280,
      status: 'ready',
      time: '11:00 AM',
    },
  ];

  const menuItems = [
    { id: '1', name: 'Veg Burger', price: 80, category: 'veg', available: true },
    { id: '2', name: 'Chicken Pizza', price: 180, category: 'non-veg', available: true },
    { id: '3', name: 'Pasta', price: 120, category: 'veg', available: false },
  ];

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Provider Dashboard</h1>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-500 flex items-center justify-center text-white">
                    {service.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href={service.link}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Manage
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
                      <p className="text-sm text-gray-500">Time: {order.time}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : order.status === 'preparing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                              Start Preparing
                            </button>
                            <button className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'preparing' && (
                          <button className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}