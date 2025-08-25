import React from 'react';
import { HiOutlineTrash, HiOutlineArchiveBoxXMark, HiOutlineArrowUturnLeft } from 'react-icons/hi2';

const TrashPage = () => {
  // Sample data for deleted items
  const deletedItems = [
    { id: 1, name: 'Contact: John Smith', type: 'Contact', deleteDate: 'Apr 10, 2025', expiryDate: 'May 10, 2025' },
    { id: 2, name: 'Export: Northeast Leads', type: 'Export', deleteDate: 'Apr 09, 2025', expiryDate: 'May 09, 2025' },
    { id: 3, name: 'Email Template: Introduction', type: 'Template', deleteDate: 'Apr 05, 2025', expiryDate: 'May 05, 2025' },
  ];

  return (
    <div className="p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Trash</h1>
        <p className="text-text-secondary">Items deleted in the last 30 days will appear here</p>
      </div>

      <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-primary">Recently Deleted Items</h2>
          <button className="px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors rounded-lg flex items-center gap-2">
            <HiOutlineArchiveBoxXMark className="w-4 h-4" />
            Empty Trash
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {deletedItems.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5">
                <tr className="border-b border-white/10">
                  <th scope="col" className="px-6 py-3 text-text-secondary">Name</th>
                  <th scope="col" className="px-6 py-3 text-text-secondary">Type</th>
                  <th scope="col" className="px-6 py-3 text-text-secondary">Deleted Date</th>
                  <th scope="col" className="px-6 py-3 text-text-secondary">Expires On</th>
                  <th scope="col" className="px-6 py-3 text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-text-primary">{item.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.type}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.deleteDate}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.expiryDate}</td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded text-accent-primary hover:bg-white/10 transition-all mr-2" title="Restore">
                        <HiOutlineArrowUturnLeft className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded text-red-400 hover:bg-white/10 transition-all" title="Delete Permanently">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 flex flex-col items-center justify-center text-text-muted">
              <HiOutlineTrash className="w-12 h-12 mb-3 opacity-50" />
              <p>No items in trash</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashPage; 