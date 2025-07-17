import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { BASE_URL } from '../config/endpoint';

const cardData = [
  { key: 'orders', label: 'Orders' },
  { key: 'riders', label: 'Riders' },
  { key: 'settings', label: 'Settings', adminOnly: true },
  { key: 'users', label: 'Users' },
];

type DashboardCardsProps = {
  role: string;
};

const fetchDetails = async (key: string, token: string | null) => {
  let url = '';
  switch (key) {
    case 'orders':
      url = `${BASE_URL}/orders`;
      break;
    case 'users':
      url = `${BASE_URL}/users`;
      break;
    case 'settings':
      url = `${BASE_URL}/settings`;
      break;
    case 'riders':
      url = `${BASE_URL}/riders`;
      break;
    default:
      return null;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

const canEditOrder = (role: string) => role === 'Admin' || role === 'Editor';
const canDeleteOrder = (role: string) => role === 'Admin';
const canEditUser = (role: string) => role === 'Admin' || role === 'Editor';
const canDeleteUser = (role: string) => role === 'Admin';
const canEditRider = (role: string) => role === 'Admin' || role === 'Editor';
const canDeleteRider = (role: string) => role === 'Admin';

export default function DashboardCards({ role }: DashboardCardsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardClick = async (key: string, adminOnly?: boolean) => {
    if (adminOnly && role !== 'Admin') return;
    setSelected(key);
    setLoading(true);
    setError('');
    setDetails(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const data = await fetchDetails(key, token);
      setDetails(data);
    } catch (err: any) {
      setError('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelected(null);
    setDetails(null);
    setError('');
  };

  // Placeholder handlers for edit/delete
  const handleEdit = (item: any) => {
    alert(`Edit ${selected?.slice(0, -1)}: ${item.id}`);
  };
  const handleDelete = (item: any) => {
    alert(`Delete ${selected?.slice(0, -1)}: ${item.id}`);
  };

  // Refined UI for orders
  const renderOrderDetails = () => (
    <div className="space-y-4">
      {Array.isArray(details) && details.length > 0 ? (
        details.map((order: any) => (
          <div key={order.id} className="bg-[#222] rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-lg">{order.item}</div>
              <div className="text-sm text-[#888]">Status: <span className="font-medium text-white">{order.status}</span></div>
              <div className="text-xs text-[#666]">Order ID: {order.id}</div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {canEditOrder(role) && (
                <button onClick={() => handleEdit(order)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">Edit</button>
              )}
              {canDeleteOrder(role) && (
                <button onClick={() => handleDelete(order)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium">Delete</button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-[#888]">No orders found.</div>
      )}
    </div>
  );

  // Refined UI for users
  const renderUserDetails = () => (
    <div className="space-y-4">
      {Array.isArray(details) && details.length > 0 ? (
        details.map((user: any) => (
          <div key={user.id} className="bg-[#222] rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-lg">{user.email}</div>
              <div className="text-sm text-[#888]">Role: <span className="font-medium text-white">{user.role}</span></div>
              <div className="text-xs text-[#666]">User ID: {user.id}</div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {canEditUser(role) && (
                <button onClick={() => handleEdit(user)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">Edit</button>
              )}
              {canDeleteUser(role) && (
                <button onClick={() => handleDelete(user)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium">Delete</button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-[#888]">No users found.</div>
      )}
    </div>
  );

  // Refined UI for riders
  const renderRiderDetails = () => (
    <div className="space-y-4">
      {Array.isArray(details) && details.length > 0 ? (
        details.map((rider: any) => (
          <div key={rider.id} className="bg-[#222] rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-lg">{rider.name}</div>
              <div className="text-sm text-[#888]">Status: <span className="font-medium text-white">{rider.status}</span></div>
              <div className="text-xs text-[#666]">Rider ID: {rider.id}</div>
              {rider.assignedOrderId && (
                <div className="text-xs text-[#888]">Assigned Order: <span className="text-white">{rider.assignedOrderId}</span></div>
              )}
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {canEditRider(role) && (
                <button onClick={() => handleEdit(rider)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">Edit</button>
              )}
              {canDeleteRider(role) && (
                <button onClick={() => handleDelete(rider)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium">Delete</button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-[#888]">No riders found.</div>
      )}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {cardData.map(card => {
          if (card.adminOnly && role !== 'Admin') return null;
          return (
            <DashboardCard key={card.key} title={card.label} onClick={() => handleCardClick(card.key, card.adminOnly)} />
          );
        })}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 capitalize">{selected} Details</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {selected === 'orders' && details && renderOrderDetails()}
            {selected === 'users' && details && renderUserDetails()}
            {selected === 'riders' && details && renderRiderDetails()}
            {selected === 'settings' && (
              <div className="flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-green-400 text-lg font-semibold mb-2">You are an admin.</div>
                <div className="text-white text-base">Only you can access the settings.</div>
              </div>
            )}
            {/* Add similar refined UIs for users, settings, etc. as needed */}
          </div>
        </div>
      )}
    </>
  );
} 