import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';
import { 
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowsUpDown,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineEye,
  HiOutlineExclamationTriangle,
  HiOutlineGlobeAlt,
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlineHeart,
  HiOutlineMap,
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlineViewColumns,
  HiOutlineDocumentText,
  HiPlus,
  HiOutlineSquares2X2,
  HiOutlineRectangleStack,
  HiOutlineBookmark,
  HiOutlineArrowRight
} from 'react-icons/hi2';

// Mock data for legal cases
const legalCases = [
  {
    id: 1,
    name: 'Wells Fargo v. ABC Properties',
    industry: 'Commercial Litigation',
    location: 'NY Supreme Court',
    employees: 287,
    revenue: 4200000,
    growth: 35,
    founded: 2023,
    description: 'Commercial property dispute involving breach of contract and damages claims.',
    matchScore: 92,
    watch: true,
    status: 'Contacted',
    logo: 'https://via.placeholder.com/150?text=CW',
    financials: {
      valuation: 18500000,
      ebitda: 950000,
      profitMargin: 22.6,
      debtEquityRatio: 0.3
    },
    kpis: [
      { name: 'MRR', value: '$350K', trend: 'up' },
      { name: 'CAC', value: '$1,250', trend: 'down' },
      { name: 'LTV', value: '$24,500', trend: 'up' },
      { name: 'Churn', value: '2.1%', trend: 'down' }
    ],
    strengths: ['Proprietary technology', 'Strong recurring revenue', 'Low customer acquisition cost'],
    risks: ['Customer concentration', 'Competitive market']
  },
  {
    id: 2,
    name: 'MediSync Health',
    industry: 'Healthcare Tech',
    location: 'Boston, MA',
    employees: 67,
    revenue: 6800000,
    growth: 34.2,
    founded: 2015,
    description: 'Developer of healthcare coordination software for medical practices and clinics.',
    matchScore: 88,
    watch: true,
    status: 'Due Diligence',
    logo: 'https://via.placeholder.com/150?text=MS',
    financials: {
      valuation: 27000000,
      ebitda: 1700000,
      profitMargin: 25.0,
      debtEquityRatio: 0.5
    },
    kpis: [
      { name: 'Users', value: '12,450', trend: 'up' },
      { name: 'Retention', value: '94%', trend: 'stable' },
      { name: 'ARPU', value: '$545', trend: 'up' },
      { name: 'Growth', value: '34.2%', trend: 'up' }
    ],
    strengths: ['HIPAA compliant', 'High barriers to entry', 'Loyal customer base'],
    risks: ['Regulatory changes', 'Integration complexity']
  },
  {
    id: 3,
    name: 'EcoSupply Chain',
    industry: 'Logistics & Supply Chain',
    location: 'Portland, OR',
    employees: 52,
    revenue: 5100000,
    growth: 18.7,
    founded: 2014,
    description: 'Sustainable supply chain management solutions for eco-conscious businesses.',
    matchScore: 85,
    watch: false,
    status: 'Initial Research',
    logo: 'https://via.placeholder.com/150?text=ES',
    financials: {
      valuation: 15500000,
      ebitda: 980000,
      profitMargin: 19.2,
      debtEquityRatio: 0.4
    },
    kpis: [
      { name: 'Clients', value: '78', trend: 'up' },
      { name: 'Efficiency', value: '+22%', trend: 'up' },
      { name: 'Carbon', value: '-45%', trend: 'down' },
      { name: 'Margin', value: '19.2%', trend: 'stable' }
    ],
    strengths: ['ESG value proposition', 'Innovative technology', 'Growing market'],
    risks: ['Capital intensive', 'Slow adoption cycle']
  },
  {
    id: 4,
    name: 'DataSense Analytics',
    industry: 'Business Intelligence',
    location: 'Austin, TX',
    employees: 38,
    revenue: 3900000,
    growth: 42.3,
    founded: 2018,
    description: 'AI-powered business analytics platform for data-driven decision making.',
    matchScore: 90,
    watch: true,
    status: 'Negotiation',
    logo: 'https://via.placeholder.com/150?text=DS',
    financials: {
      valuation: 22000000,
      ebitda: 850000,
      profitMargin: 21.8,
      debtEquityRatio: 0.2
    },
    kpis: [
      { name: 'ARR', value: '$3.2M', trend: 'up' },
      { name: 'NPS', value: '72', trend: 'up' },
      { name: 'Growth', value: '42.3%', trend: 'up' },
      { name: 'Churn', value: '3.5%', trend: 'down' }
    ],
    strengths: ['AI expertise', 'Scalable platform', 'High growth rate'],
    risks: ['Talent retention', 'IP protection']
  },
  {
    id: 5,
    name: 'AdvancedMaterials Inc',
    industry: 'Manufacturing',
    location: 'Detroit, MI',
    employees: 86,
    revenue: 8900000,
    growth: 15.2,
    founded: 2012,
    description: 'Manufacturer of specialized composite materials for automotive and aerospace industries.',
    matchScore: 81,
    watch: false,
    status: 'Initial Research',
    logo: 'https://via.placeholder.com/150?text=AM',
    financials: {
      valuation: 29500000,
      ebitda: 2100000,
      profitMargin: 23.6,
      debtEquityRatio: 0.7
    },
    kpis: [
      { name: 'Orders', value: '1,245', trend: 'up' },
      { name: 'Capacity', value: '82%', trend: 'up' },
      { name: 'Defects', value: '0.8%', trend: 'down' },
      { name: 'Margin', value: '23.6%', trend: 'stable' }
    ],
    strengths: ['Patent portfolio', 'Manufacturing expertise', 'Long-term contracts'],
    risks: ['Supply chain dependencies', 'Capital equipment needs']
  },
  {
    id: 6,
    name: 'Fintech Solutions',
    industry: 'Financial Technology',
    location: 'New York, NY',
    employees: 62,
    revenue: 7200000,
    growth: 31.5,
    founded: 2016,
    description: 'Developer of payment processing and financial management software for SMBs.',
    matchScore: 87,
    watch: true,
    status: 'Contacted',
    logo: 'https://via.placeholder.com/150?text=FS',
    financials: {
      valuation: 32000000,
      ebitda: 1600000,
      profitMargin: 22.2,
      debtEquityRatio: 0.4
    },
    kpis: [
      { name: 'TPV', value: '$720M', trend: 'up' },
      { name: 'Users', value: '15,800', trend: 'up' },
      { name: 'CAC', value: '$980', trend: 'down' },
      { name: 'Retention', value: '91%', trend: 'stable' }
    ],
    strengths: ['Strong unit economics', 'Regulatory compliance', 'Network effects'],
    risks: ['Regulatory changes', 'Big tech competition']
  }
];

// Status pill component
const StatusPill = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'Initial Research':
      bgColor = 'bg-purple-500/20';
      textColor = 'text-purple-500';
      break;
    case 'Contacted':
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-500';
      break;
    case 'Due Diligence':
      bgColor = 'bg-amber-500/20';
      textColor = 'text-amber-500';
      break;
    case 'Negotiation':
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-500';
      break;
    default:
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

// Trend indicator component
const TrendIndicator = ({ trend }: { trend: string }) => {
  if (trend === 'up') {
    return <span className="text-green-500"><HiOutlineChartBar className="w-4 h-4 inline -rotate-90" /></span>;
  } else if (trend === 'down') {
    return <span className="text-red-500"><HiOutlineChartBar className="w-4 h-4 inline rotate-90" /></span>;
  } else {
    return <span className="text-amber-500"><HiOutlineArrowsUpDown className="w-4 h-4 inline" /></span>;
  }
};

// Match score indicator component
const MatchScore = ({ score }: { score: number }) => {
  let color = 'text-red-500';
  
  if (score >= 90) {
    color = 'text-green-500';
  } else if (score >= 80) {
    color = 'text-amber-500';
  } else if (score >= 70) {
    color = 'text-blue-500';
  }
  
  return (
    <div className="flex items-center">
      <div className={`text-lg font-bold ${color} mr-1`}>{score}</div>
      <div className="text-xs text-gray-400">match</div>
    </div>
  );
};

const LegalCasesPage = () => {
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useLayout();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  
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

  // Get selected target data if any
  const targetData = selectedTarget 
    ? legalCases.find(target => target.id === selectedTarget) 
    : null;

  return (
    <div className="h-full">
      {/* Top Navigation Bar - clean white bar with workspace icon only */}
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
          {/* Right side with workspace icon only */}
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
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">Legal Cases</h1>
          <p className="text-gray-600">
            Analyze case durations and identify opportunities for efficiency improvements.
          </p>
        </motion.div>
        
        {/* Controls bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-between items-center mb-6"
        >
          {/* Search */}
          <div className="relative w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineMagnifyingGlass className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="glass-panel block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search targets..."
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-3">
            <button className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md hover:bg-gray-100/70 transition duration-300">
              <HiOutlineAdjustmentsHorizontal className="h-5 w-5 mr-2 text-blue-500" />
              <span>Filters</span>
              <HiOutlineChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            
            <button className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md hover:bg-gray-100/70 transition duration-300">
              <HiOutlineGlobeAlt className="h-5 w-5 mr-2 text-purple-500" />
              <span>All Industries</span>
              <HiOutlineChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            
            <button className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md hover:bg-gray-100/70 transition duration-300">
              <HiOutlineMap className="h-5 w-5 mr-2 text-amber-500" />
              <span>All Locations</span>
              <HiOutlineChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className={`flex items-center px-3 py-2 ${viewMode === 'card' ? 'bg-blue-500/20 text-blue-500' : 'bg-white/70 text-gray-500 hover:bg-gray-100/70'} transition duration-300`}
                onClick={() => setViewMode('card')}
              >
                <HiOutlineSquares2X2 className="h-5 w-5" />
              </button>
              <button 
                className={`flex items-center px-3 py-2 ${viewMode === 'table' ? 'bg-blue-500/20 text-blue-500' : 'bg-white/70 text-gray-500 hover:bg-gray-100/70'} transition duration-300`}
                onClick={() => setViewMode('table')}
              >
                <HiOutlineViewColumns className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main content area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-6"
        >
          {/* Target listings */}
          <div className={selectedTarget ? 'w-1/2' : 'w-full'}>
            {viewMode === 'card' ? (
              <div className="grid grid-cols-2 gap-6">
                {legalCases.map((target) => (
                  <motion.div 
                    key={target.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * target.id }}
                    className={`glass-panel relative rounded-xl border hover:border-blue-500/30 ${selectedTarget === target.id ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-gray-200'} bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]`}
                    onClick={() => setSelectedTarget(target.id)}
                  >
                    {/* Watch button */}
                    <button className="absolute top-4 right-4 text-gray-500 hover:text-amber-500 transition-colors duration-300">
                      {target.watch ? (
                        <HiOutlineStar className="h-6 w-6 text-amber-500 fill-amber-500" />
                      ) : (
                        <HiOutlineStar className="h-6 w-6" />
                      )}
                    </button>
                    
                    {/* Company info */}
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 mr-3">
                        {target.name.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{target.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <HiOutlineGlobeAlt className="h-4 w-4 mr-1" />
                          {target.industry}
                        </div>
                      </div>
                    </div>
                    
                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Case Value</div>
                        <div className="text-gray-800 font-medium">${(target.revenue / 1000000).toFixed(1)}M</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                        <div className="text-gray-800 font-medium">{target.growth}%</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Duration (Days)</div>
                        <div className="text-gray-800 font-medium">{target.employees}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Filed</div>
                        <div className="text-gray-800 font-medium">{target.founded}</div>
                      </div>
                    </div>
                    
                    {/* Bottom info row */}
                    <div className="flex justify-between items-center">
                      <StatusPill status={target.status} />
                      <MatchScore score={target.matchScore} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Value</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency %</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {legalCases.map((target) => (
                      <tr 
                        key={target.id}
                        className={`hover:bg-gray-50 transition-colors duration-300 cursor-pointer ${selectedTarget === target.id ? 'bg-blue-500/10' : ''}`}
                        onClick={() => setSelectedTarget(target.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
                              {target.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{target.name}</div>
                              <div className="text-xs text-gray-500">{target.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{target.industry}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${(target.revenue / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{target.growth}%</td>
                        <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={target.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><MatchScore score={target.matchScore} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="text-gray-500 hover:text-amber-500 transition-colors">
                              {target.watch ? (
                                <HiOutlineStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                              ) : (
                                <HiOutlineStar className="h-5 w-5" />
                              )}
                            </button>
                            <button className="text-gray-500 hover:text-blue-500 transition-colors">
                              <HiOutlineEye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Company detail panel */}
          {selectedTarget && targetData && (
            <motion.div 
              className="w-1/2 glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Company header */}
              <div className="flex justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mr-4">
                    {targetData.name.substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{targetData.name}</h2>
                    <div className="flex items-center mt-1">
                      <HiOutlineGlobeAlt className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-600 mr-3">{targetData.industry}</span>
                      <HiOutlineMap className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-600">{targetData.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <HiOutlineDocumentText className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    {targetData.watch ? (
                      <HiOutlineStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <HiOutlineStar className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors flex items-center text-white">
                    <HiPlus className="h-5 w-5 mr-1" />
                    <span>Take Action</span>
                  </button>
                </div>
              </div>
              
              {/* Key metrics */}
              <div className="glass-panel border border-gray-200 bg-gray-50/70 backdrop-blur-md rounded-xl p-4 mb-6">
                <div className="grid grid-cols-4 divide-x divide-gray-200">
                  <div className="px-4">
                    <div className="text-sm text-gray-500 mb-1">Revenue</div>
                    <div className="text-xl font-semibold text-gray-800">${(targetData.revenue / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="px-4">
                    <div className="text-sm text-gray-500 mb-1">Growth</div>
                    <div className="text-xl font-semibold text-gray-800 flex items-center">
                      {targetData.growth}%
                      <TrendIndicator trend="up" />
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="text-sm text-gray-500 mb-1">Valuation</div>
                    <div className="text-xl font-semibold text-gray-800">${(targetData.financials.valuation / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="px-4">
                    <div className="text-sm text-gray-500 mb-1">Match Score</div>
                    <div className="text-xl font-semibold text-green-500">{targetData.matchScore}</div>
                  </div>
                </div>
              </div>
              
              {/* Company info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Case Overview</h3>
                <p className="text-gray-600 mb-4">{targetData.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Founded</div>
                    <div className="text-gray-800">{targetData.founded}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Employees</div>
                    <div className="text-gray-800">{targetData.employees}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">EBITDA</div>
                    <div className="text-gray-800">${(targetData.financials.ebitda / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Profit Margin</div>
                    <div className="text-gray-800">{targetData.financials.profitMargin}%</div>
                  </div>
                </div>
              </div>
              
              {/* KPIs */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Key Performance Indicators</h3>
                <div className="grid grid-cols-4 gap-4">
                  {targetData.kpis.map((kpi, index) => (
                    <div key={index} className="glass-panel bg-gray-50/70 border border-gray-200 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">{kpi.name}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium text-gray-800">{kpi.value}</div>
                        <TrendIndicator trend={kpi.trend} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Strengths & Risks */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <HiOutlineHandThumbUp className="text-green-500 mr-2" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {targetData.strengths.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <HiOutlineExclamationTriangle className="text-amber-500 mr-2" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-2">
                    {targetData.risks.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center glass-panel border border-gray-200 bg-gray-50/70 backdrop-blur-md rounded-xl p-4">
                <div>
                  <StatusPill status={targetData.status} />
                  <div className="text-xs text-gray-500 mt-1">Updated 3 days ago</div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    View Full Profile
                  </button>
                  <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm text-white">
                    Schedule Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LegalCasesPage; 