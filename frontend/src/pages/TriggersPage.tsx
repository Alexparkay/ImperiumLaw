import React from 'react';
import { HiOutlineBolt, HiOutlineCog6Tooth } from 'react-icons/hi2';

const TriggersPage = () => {
  // Mock data for triggers
  const triggers = [
    { id: 1, name: 'New Lead Added to Favorites', action: 'Send Slack notification', status: 'Active' },
    { id: 2, name: 'Contact Email Opened', action: 'Update CRM status', status: 'Active' },
    { id: 3, name: 'Export Completed', action: 'Email download link', status: 'Paused' },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Triggers</h1>
        <button className="btn btn-sm btn-primary">+ New Trigger</button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Trigger Name</th>
              <th scope="col" className="px-6 py-3">Action</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Manage</span></th>
            </tr>
          </thead>
          <tbody>
            {triggers.map((trigger) => (
              <tr key={trigger.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-2">
                   <HiOutlineBolt className="w-4 h-4 text-yellow-500"/>
                   <span>{trigger.name}</span>
                </td>
                <td className="px-6 py-4">{trigger.action}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${trigger.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {trigger.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-gray-500 hover:text-blue-600">
                    <HiOutlineCog6Tooth className="w-5 h-5" />
                  </button>
                  {/* Add more actions */}
                </td>
              </tr>
            ))}
             {triggers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No triggers configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TriggersPage; 