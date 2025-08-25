import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const SavedListsPage = () => {
  // Mock data for saved lists - replace with actual data fetching later
  const savedLists = [
    {
      name: 'High-Volume Foreclosure Firms',
      description: 'Top law firms specializing in residential and commercial foreclosure cases.',
      count: 847,
      link: '/database/foreclosure-firms'
    },
    {
      name: 'NY Court Cases - Priority',
      description: 'Active foreclosure cases in New York State Supreme Court and surrogate courts.',
      count: 2341,
      link: '/database/ny-court-cases'
    },
    {
      name: 'Bank Legal Departments',
      description: 'In-house legal teams at major financial institutions handling foreclosure litigation.',
      count: 523,
      link: '/database/bank-legal-departments'
    },
    {
      name: 'Federal District Courts - EDNY',
      description: 'Eastern District of New York federal court cases involving mortgage disputes.',
      count: 1156,
      link: '/database/federal-courts-edny'
    },
    {
      name: 'Real Estate Attorneys - NYC',
      description: 'Licensed attorneys specializing in real estate law and property disputes in NYC.',
      count: 1892,
      link: '/database/real-estate-attorneys-nyc'
    },
    {
      name: 'Mortgage Servicers Legal Contacts',
      description: 'Legal representatives at mortgage servicing companies for foreclosure proceedings.',
      count: 434,
      link: '/database/mortgage-servicers'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-primary-content mb-6">Saved Lists</h1>

      {savedLists.length === 0 ? (
        <p className="text-base-content mt-4">Your saved lead lists will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLists.map((list) => (
            <div key={list.name} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-primary">{list.name}</h2>
                <p className="text-base-content/80 text-sm mb-3">{list.description}</p>
                <p className="text-sm text-base-content/60 mb-4">{list.count} Records</p>
                <div className="card-actions justify-end">
                  <Link to={list.link} className="btn btn-primary btn-sm">
                    View List
                  </Link>
                  {/* Add other actions like edit, delete etc. */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListsPage; 