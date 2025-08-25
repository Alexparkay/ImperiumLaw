import React from 'react';

const ExportsPage = () => {
  // Mock data for exports
  const exports = [
    { id: 1, name: 'NY Foreclosure Cases Export - 2024-04-03', status: 'Completed', date: 'Apr 03, 2025' },
    { id: 2, name: 'Legal Representatives Export - 2024-04-01', status: 'Completed', date: 'Apr 01, 2025' },
    { id: 3, name: 'Court Performance Analysis - 2024-03-28', status: 'Completed', date: 'Mar 28, 2025' },
  ];

  return (
    <div className="p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Exports</h1>
        <p className="text-text-secondary">Download and manage your exported data</p>
      </div>
      
      <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold text-text-primary">Export History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5">
              <tr className="border-b border-white/10">
                <th scope="col" className="px-6 py-3 text-text-secondary">Export Name</th>
                <th scope="col" className="px-6 py-3 text-text-secondary">Status</th>
                <th scope="col" className="px-6 py-3 text-text-secondary">Date</th>
                <th scope="col" className="px-6 py-3 text-text-secondary"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {exports.map((exp) => (
                <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{exp.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${exp.status === 'Completed' ? 'bg-accent-secondary/20 text-accent-secondary' : 'bg-red-500/20 text-red-400'}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{exp.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors">Download</button>
                  </td>
                </tr>
              ))}
              {exports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-muted">No exports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 mt-8 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Create New Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all hover:shadow-md cursor-pointer">
            <h3 className="text-lg font-medium text-text-primary mb-2">Database Export</h3>
            <p className="text-text-secondary text-sm">Export contacts from any database with custom filters</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all hover:shadow-md cursor-pointer">
            <h3 className="text-lg font-medium text-text-primary mb-2">Analytics Report</h3>
            <p className="text-text-secondary text-sm">Generate detailed reports on outreach performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportsPage; 