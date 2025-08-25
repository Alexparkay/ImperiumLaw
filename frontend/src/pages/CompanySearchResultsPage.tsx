import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineGlobeAlt, 
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineArrowLongRight,
  HiOutlineCheck,
  HiOutlineCpuChip,
  HiOutlineChartBar,
  HiOutlineArrowPath,
  HiOutlineLightBulb,
  HiOutlineArrowSmallRight,
  HiOutlineExclamationTriangle,
  HiOutlineLifebuoy,
  HiOutlineXMark
} from 'react-icons/hi2';

// Mock result data
const mockSearchResults = [
  {
    id: 1,
    companyName: "TechMechanics Inc.",
    industry: "Manufacturing",
    location: "Chicago, IL",
    employees: "42",
    revenue: "$3.8M",
    founded: "2005",
    ownerAge: "58",
    profitMargin: "12%",
    growthRate: "7%",
    acquisitionFit: 92,
    price: "$4.2M",
    description: "Precision engineering firm specializing in custom mechanical components for aerospace and automotive industries."
  },
  {
    id: 2,
    companyName: "CircuitWorks LLC",
    industry: "Electronics Manufacturing",
    location: "Phoenix, AZ",
    employees: "27",
    revenue: "$2.1M",
    founded: "2008",
    ownerAge: "62",
    profitMargin: "15%",
    growthRate: "5%",
    acquisitionFit: 89,
    price: "$2.6M",
    description: "Specialized electronics manufacturer with expertise in low-volume, high-precision circuit assemblies."
  },
  {
    id: 3,
    companyName: "WireSystems Co.",
    industry: "Cable Manufacturing",
    location: "Atlanta, GA",
    employees: "34",
    revenue: "$3.2M",
    founded: "2001",
    ownerAge: "65",
    profitMargin: "9%",
    growthRate: "4%",
    acquisitionFit: 87,
    price: "$3.8M",
    description: "Custom cable and wiring harness fabrication servicing industrial and transportation sectors."
  },
  {
    id: 4,
    companyName: "OptiComp Solutions",
    industry: "Computer Hardware",
    location: "Austin, TX",
    employees: "19",
    revenue: "$1.7M",
    founded: "2012",
    ownerAge: "51",
    profitMargin: "11%",
    growthRate: "12%",
    acquisitionFit: 84,
    price: "$2.1M",
    description: "Specialized in custom computing hardware for industrial applications and IoT systems."
  },
  {
    id: 5,
    companyName: "NextGen Fabrication",
    industry: "Manufacturing",
    location: "Denver, CO",
    employees: "46",
    revenue: "$4.1M",
    founded: "2007",
    ownerAge: "53",
    profitMargin: "10%",
    growthRate: "6%",
    acquisitionFit: 81,
    price: "$4.5M",
    description: "Advanced manufacturing company using latest technologies for precision metal and composite components."
  }
];

// Toast notification component
const SearchNotification = ({ message, icon: Icon, onClose }: { message: string; icon: React.ElementType; onClose: () => void }) => {
  return (
    <motion.div 
      className="fixed top-5 right-5 bg-white rounded-lg shadow-xl border border-gray-100 p-4 flex items-center gap-3 max-w-md z-50"
      initial={{ opacity: 0, y: -50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-800 font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <HiOutlineXMark className="w-5 h-5 text-gray-500" />
      </button>
    </motion.div>
  );
};

// Company result card component
const CompanyResultCard = ({ company, index }: { company: any; index: number }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{company.companyName}</h3>
          <div className="flex items-center gap-1 bg-blue-100 rounded-full px-3 py-1">
            <span className="text-sm font-bold text-blue-800">{company.acquisitionFit}%</span>
            <span className="text-xs text-blue-600">match</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{company.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{company.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineGlobeAlt className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{company.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineUserGroup className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{company.employees} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineCurrencyDollar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{company.revenue} revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Founded {company.founded}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineChartBar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{company.profitMargin} profit</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="text-blue-700 font-bold">Est. {company.price}</div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium flex items-center gap-1">
            View Details
            <HiOutlineArrowSmallRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CompanySearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchStage, setSearchStage] = useState(0); // 0: loading, 1: analyzing, 2: computing matches, 3: results
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState<{id: number; message: string; icon: React.ElementType}[]>([]);
  
  const notificationMessages = [
    { message: "Processing company size parameters...", icon: HiOutlineBuildingOffice2 },
    { message: "Analyzing financial criteria...", icon: HiOutlineCurrencyDollar },
    { message: "Filtering by employee count and structure...", icon: HiOutlineUserGroup },
    { message: "Checking geographical constraints...", icon: HiOutlineGlobeAlt },
    { message: "Evaluating industry sector matches...", icon: HiOutlineBeaker },
    { message: "Verifying business longevity criteria...", icon: HiOutlineCalendar },
    { message: "Calculating acquisition fit scores...", icon: HiOutlineSparkles },
    { message: "Cross-referencing owner retirement status...", icon: HiOutlineUserGroup },
    { message: "Applying machine learning prediction models...", icon: HiOutlineCpuChip },
    { message: "Examining growth trends and forecasts...", icon: HiOutlineChartBar },
    { message: "Finalizing target recommendations...", icon: HiOutlineLightBulb }
  ];
  
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  useEffect(() => {
    // Simulate progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, 40);
    
    // Simulate search stages
    setTimeout(() => setSearchStage(1), 2000); // Move to analyzing
    setTimeout(() => setSearchStage(2), 5000); // Move to computing matches
    setTimeout(() => {
      setSearchStage(3); // Move to results
      setShowResults(true);
    }, 8000);
    
    // Simulate notifications
    let notifCount = 0;
    const notifInterval = setInterval(() => {
      if (notifCount >= notificationMessages.length) {
        clearInterval(notifInterval);
        return;
      }
      
      const newNotif = {
        id: Date.now(),
        ...notificationMessages[notifCount]
      };
      
      setNotifications(prev => [...prev, newNotif]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        removeNotification(newNotif.id);
      }, 3000);
      
      notifCount++;
    }, 700);
    
    return () => {
      clearInterval(progressTimer);
      clearInterval(notifInterval);
    };
  }, []);
  
  const getStageTitle = () => {
    switch (searchStage) {
      case 0: return "Initializing search...";
      case 1: return "Analyzing filter criteria...";
      case 2: return "Computing potential matches...";
      case 3: return "Acquisition targets found!";
      default: return "Searching...";
    }
  };
  
  const getStageIcon = () => {
    switch (searchStage) {
      case 0: return HiOutlineArrowPath;
      case 1: return HiOutlineBeaker;
      case 2: return HiOutlineCpuChip;
      case 3: return HiOutlineCheck;
      default: return HiOutlineArrowPath;
    }
  };
  
  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 relative overflow-x-hidden">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map(notification => (
          <SearchNotification 
            key={notification.id}
            message={notification.message}
            icon={notification.icon}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-5 w-32 h-32 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-5 w-48 h-48 bg-indigo-200/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header with progress */}
        <div className="text-center mb-8">
          <motion.div 
            key={searchStage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-3 shadow-inner">
              <motion.div
                animate={{ rotate: searchStage === 3 ? 0 : 360 }}
                transition={{ duration: 2, repeat: searchStage === 3 ? 0 : Infinity, ease: "linear" }}
                className="w-10 h-10 flex items-center justify-center"
              >
                {React.createElement(getStageIcon(), { className: `w-6 h-6 ${searchStage === 3 ? 'text-green-600' : 'text-blue-600'}` })}
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{getStageTitle()}</h1>
            {searchStage < 3 && (
              <p className="text-gray-500 text-sm mt-1">Please wait while we analyze potential acquisition targets</p>
            )}
            {searchStage === 3 && (
              <p className="text-gray-500 text-sm mt-1">We found 5 companies matching your acquisition criteria</p>
            )}
          </motion.div>
          
          {searchStage < 3 && (
            <div className="w-full max-w-xl mx-auto">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Filtering</span>
                <span>Analysis</span>
                <span>Matching</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Search quality details (shown during search) */}
        {searchStage < 3 && (
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <HiOutlineLifebuoy className="w-5 h-5 mr-2 text-blue-600" />
                Search Quality Indicators
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Filter Specificity</span>
                    <span className="text-sm text-green-600 font-medium">High</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <motion.div 
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 1.2 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Data Coverage</span>
                    <span className="text-sm text-blue-600 font-medium">Medium</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, delay: 1.4 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                    <span className="text-sm text-green-600 font-medium">Very High</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <motion.div 
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1, delay: 1.6 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Expected Results</span>
                    <span className="text-sm text-amber-600 font-medium">5-10</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <motion.div 
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "55%" }}
                      transition={{ duration: 1, delay: 1.8 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-500" />
                <span>Consider adding more filters to improve result relevance.</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Results section (shown after search completes) */}
        {showResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Acquisition Opportunities</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-1 shadow-sm">
                  <HiOutlineArrowPath className="w-4 h-4" />
                  Refine Search
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">
                  Save Results
                </button>
              </div>
            </div>
            
            {/* Results grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockSearchResults.map((company, index) => (
                <CompanyResultCard key={company.id} company={company} index={index} />
              ))}
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => navigate('/company-filter')}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg inline-flex items-center gap-2 transition-colors duration-200"
              >
                Back to Search
                <HiOutlineArrowLongRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanySearchResultsPage; 