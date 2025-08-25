import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronDown, 
  HiOutlineChevronRight,
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineScale,
  HiOutlineBeaker,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineClipboardDocument,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineArrowPath,
  HiOutlineArrowRight,
  HiOutlineAdjustmentsVertical,
  HiOutlineMagnifyingGlass,
  HiOutlineChartBar,
  HiOutlineLink
} from 'react-icons/hi2';
import { useLayout } from '../context/LayoutContext';
import { motion } from 'framer-motion';

// Define filter categories type
type FilterCategory = 'company' | 'financials' | 'employees' | 'industry' | 'location' | 'age' | 'growth' | 'tech' | 'certification' | 'market' | 'competition' | 'supply_chain';

// Define the type for the expandedFilters state
type ExpandedFiltersState = {
  [key in FilterCategory]: boolean;
};

const CompanyFilterPage = () => {
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useLayout();
  const [activeStep, setActiveStep] = useState(1);
  
  // All filters collapsed by default
  const [expandedFilters, setExpandedFilters] = useState<ExpandedFiltersState>({
    'company': false,
    'financials': false,
    'employees': false,
    'industry': false,
    'location': false,
    'age': false,
    'growth': false,
    'tech': false,
    'certification': false,
    'market': false,
    'competition': false,
    'supply_chain': false
  });

  // Add a state to track filter selections
  const [selectedFilters, setSelectedFilters] = useState({
    count: 0
  });

  // Effect to collapse sidebar when component mounts
  useEffect(() => {
    setIsSidebarCollapsed(true);
    return () => {
      setIsSidebarCollapsed(false);
    };
  }, [setIsSidebarCollapsed]);

  // Function to navigate back to home page
  const handleBackToHome = () => {
    navigate('/');
  };

  // Function to simulate filter selection
  const handleFilterSelect = () => {
    setSelectedFilters(prev => ({
      count: prev.count + 1
    }));
  };

  const toggleFilter = (filter: FilterCategory) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Handle preview button click
  const handlePreview = () => {
    navigate('/company-search-results');
  };

  // Filter section component
  const FilterSection = ({ 
    id, 
    title, 
    icon: Icon, 
    isNew = false,
    requiresUpgrade = false
  }: { 
    id: FilterCategory; 
    title: string; 
    icon: React.ElementType;
    isNew?: boolean;
    requiresUpgrade?: boolean;
  }) => {
    const isExpanded = expandedFilters[id];
    
    return (
      <div className="mb-3 overflow-hidden transition-all duration-300 shadow-sm rounded-lg border border-gray-100 hover:border-blue-100 bg-white">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50/30 transition-colors duration-200"
          onClick={() => toggleFilter(id)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">{title}</span>
            
            {isNew && (
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
            )}
            
            {requiresUpgrade && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">Premium</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Show a badge if there are filters selected in this section */}
            {selectedFilters.count > 0 && Math.random() > 0.6 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Active</span>
            )}
            {isExpanded ? 
              <HiOutlineChevronDown className="w-5 h-5 text-blue-500" /> : 
              <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
        
        {isExpanded && (
          <div className="py-3 px-4 border-t border-gray-100 bg-gray-50/50">
            {/* Placeholder for filter controls - would be customized per filter type */}
            <div className="space-y-4">
              {id === 'company' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Company Size</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any size</option>
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>501-1,000 employees</option>
                      <option>1,001-5,000 employees</option>
                      <option>5,001+ employees</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Company Type</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any type</option>
                      <option>Private</option>
                      <option>Public</option>
                      <option>Non-profit</option>
                      <option>Government</option>
                      <option>Family-owned</option>
                      <option>Subsidiary</option>
                    </select>
                  </div>
                </>
              )}
              
              {id === 'financials' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Annual Revenue</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          type="text" 
                          placeholder="Min" 
                          className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          onChange={handleFilterSelect}
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          type="text" 
                          placeholder="Max" 
                          className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          onChange={handleFilterSelect}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Profitability</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any</option>
                      <option>Profitable</option>
                      <option>Break-even</option>
                      <option>Pre-profit</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">EBITDA Margin</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        <input 
                          type="text" 
                          placeholder="Min" 
                          className="w-full pr-7 pl-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          onChange={handleFilterSelect}
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        <input 
                          type="text" 
                          placeholder="Max" 
                          className="w-full pr-7 pl-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                          onChange={handleFilterSelect}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Other filter sections remain similar but styled */}
              {id === 'employees' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Employee Count</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Min" 
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={handleFilterSelect}
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="text" 
                        placeholder="Max" 
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={handleFilterSelect}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Owner Age</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Min" 
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={handleFilterSelect}
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="text" 
                        placeholder="Max" 
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={handleFilterSelect}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Owner Retirement</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any</option>
                      <option>Planning to retire soon</option>
                      <option>No retirement plans</option>
                    </select>
                  </div>
                </>
              )}
              
              {id === 'industry' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Industry</label>
                  <select 
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    onChange={handleFilterSelect}
                  >
                    <option>Any industry</option>
                    <option>Manufacturing</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Financial Services</option>
                    <option>Retail & Consumer</option>
                    <option>Energy & Utilities</option>
                    <option>Construction</option>
                    <option>Transportation</option>
                    <option>Business Services</option>
                  </select>
                </div>
              )}
              
              {id === 'location' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Country</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other...</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">State/Region</label>
                    <select 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    >
                      <option>Any state</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                      <option>Florida</option>
                      <option>Illinois</option>
                      <option>Other...</option>
                    </select>
                  </div>
                </>
              )}
              
              {id === 'age' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Years in Business</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Min" 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                      type="text" 
                      placeholder="Max" 
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      onChange={handleFilterSelect}
                    />
                  </div>
                </div>
              )}
              
              {(id === 'growth' || id === 'tech' || id === 'certification') && (
                <div className="py-3 px-5 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/30 border border-dashed border-blue-200 text-sm text-gray-600 italic">
                  {id === 'growth' && (
                    <>
                      <p className="mb-2">Filter by growth metrics such as:</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-500">
                        <li>Annual growth rate</li>
                        <li>Revenue trends</li>
                        <li>Customer acquisition metrics</li>
                        <li>Market penetration</li>
                      </ul>
                    </>
                  )}
                  
                  {id === 'tech' && (
                    <>
                      <p className="mb-2">Premium filters for technology stack assessment:</p>
                      <div className="flex justify-center my-2">
                        <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                          Upgrade to Access
                        </button>
                      </div>
                    </>
                  )}
                  
                  {id === 'certification' && (
                    <>
                      <p className="mb-2">Filter by certifications such as:</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-500">
                        <li>ISO Standards</li>
                        <li>Industry-specific certifications</li>
                        <li>Quality management systems</li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side with back button */}
          <div className="flex items-center">
            <button 
              onClick={handleBackToHome}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
              aria-label="Back to home"
            >
              <HiOutlineArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
          {/* Right side with workspace icon */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-sm font-medium mr-2">AK</div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-700">Alex Kaymakannov</span>
                <span className="text-xs text-gray-500">Alex's Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white text-gray-800 p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">Filter Companies</h1>
          <p className="text-gray-600">
            Discover and filter companies based on your specific criteria.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Filter categories */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">Filter Criteria</h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{selectedFilters.count} filters selected</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Clear All</button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <HiOutlineMagnifyingGlass className="w-5 h-5 text-gray-400" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search filters..." 
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <FilterSection id="company" title="Company attributes" icon={HiOutlineBuildingOffice2} />
                <FilterSection id="financials" title="Financial attributes" icon={HiOutlineCurrencyDollar} />
                <FilterSection id="employees" title="Employee attributes" icon={HiOutlineUserGroup} />
                <FilterSection id="industry" title="Industry" icon={HiOutlineBeaker} />
              </div>
              
              <div className="space-y-4">
                <FilterSection id="location" title="Location" icon={HiOutlineGlobeAlt} />
                <FilterSection id="age" title="Company age" icon={HiOutlineCalendar} />
                <FilterSection id="growth" title="Growth metrics" icon={HiOutlineArrowPath} />
                <FilterSection id="market" title="Market position" icon={HiOutlineChartBar} />
              </div>
              
              <div className="space-y-4">
                <FilterSection id="competition" title="Competitive landscape" icon={HiOutlineScale} />
                <FilterSection id="supply_chain" title="Supply chain" icon={HiOutlineLink} />
                <FilterSection id="tech" title="Technology stack" icon={HiOutlineAcademicCap} />
                <FilterSection id="certification" title="Certifications" icon={HiOutlineClipboardDocument} />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handlePreview}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
                Find Matches
              </button>
            </div>
          </div>
          
          {/* Right side - Preview area */}
          <div className="w-full lg:w-1/3">
            <div className="text-center max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 relative overflow-hidden">
                {/* Decorative elements for premium look */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3 opacity-70"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <HiOutlineAdjustmentsVertical className="w-10 h-10 text-blue-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Acquisition Targets</h2>
                  <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    Use our AI-powered search to discover companies that match your acquisition criteria with precision.
                  </p>
                  
                  <div className="space-y-8 max-w-lg mx-auto">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-800 font-semibold w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5">1</div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">Configure your search parameters</h3>
                        <p className="text-gray-600 text-sm">
                          Expand filter categories on the left to define your ideal acquisition target profile.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start opacity-60">
                      <div className="flex-shrink-0 bg-gray-100 text-gray-600 font-semibold w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5">2</div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg text-gray-700 mb-1">Review AI-matched results</h3>
                        <p className="text-gray-500 text-sm">
                          Our AI will analyze millions of data points to find the best matches for your criteria.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start opacity-40">
                      <div className="flex-shrink-0 bg-gray-100 text-gray-500 font-semibold w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5">3</div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg text-gray-700 mb-1">Engage with potential acquisitions</h3>
                        <p className="text-gray-500 text-sm">
                          Reach out to prospects with our automated engagement tools and track your pipeline.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedFilters.count > 0 && (
                    <div className="mt-10 flex justify-center">
                      <button 
                        onClick={handlePreview}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <HiOutlineMagnifyingGlass className="w-5 h-5" />
                        Find Matches ({selectedFilters.count} filters)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFilterPage; 