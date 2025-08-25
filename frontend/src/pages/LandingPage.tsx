import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  // Icons for the main menu
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineDocumentDuplicate,
  HiOutlineSparkles,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineClipboardDocumentCheck, // Icon for Acquisition Targets
  HiOutlineGlobeAlt, // Icon for Market Analysis
  HiOutlineDocumentText, // Icon for Due Diligence
  HiOutlineFlag, // Icon for Goals
  HiOutlineMicrophone, // Icon for AI Voice Search
  HiOutlineScale, // Icon for Legal
  HiOutlineClock // Icon for Duration
} from 'react-icons/hi2';

// Define types for database previews
interface DatabasePreviewProps {
  title: string;
  icon: React.ElementType;
  path: string;
}

// Database preview card component
const DatabasePreviewCard: React.FC<DatabasePreviewProps> = ({ title, icon: Icon, path }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => navigate(path)}
    >
      <div className="flex items-center">
        <div className="p-1.5 bg-blue-50 rounded-md mr-3">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      <div className="text-sm text-gray-500">
        <HiOutlineArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

// Cool color accent classes with blues, purples and greens
const accentColorClasses = [
  "bg-blue-400/40", 
  "bg-violet-400/40",  
  "bg-indigo-400/40",
  "bg-cyan-400/40",
  "bg-teal-400/40",
  "bg-purple-400/40"
];

// Card base tints with cool color variations
const cardTints = [
  "from-blue-50/20 to-transparent",
  "from-indigo-50/20 to-transparent",
  "from-violet-50/20 to-transparent",
  "from-cyan-50/20 to-transparent",
  "from-teal-50/20 to-transparent",
  "from-purple-50/20 to-transparent"
];

const LandingPage = () => {
  const navigate = useNavigate();

  const quickStartItems = [
    { 
      label: 'Filter Cases', 
      icon: HiOutlineMagnifyingGlass, 
      action: () => navigate('/company-filter') 
    },
    { 
      label: 'Legal Cases', 
      icon: HiOutlineScale, 
      action: () => navigate('/acquisition-targets') 
    },
    { 
      label: 'Duration Analysis', 
      icon: HiOutlineClock, 
      action: () => navigate('/market-analysis') 
    },
    { 
      label: 'AI Search', 
      icon: HiOutlineSparkles, 
      action: () => navigate('/ai-chat') 
    },
    { 
      label: 'Case Review', 
      icon: HiOutlineDocumentText, 
      action: () => navigate('/due-diligence') 
    },
    { 
      label: 'AI Voice Search', 
      icon: HiOutlineMicrophone, 
      action: () => navigate('/ai-voice-search') 
    }
  ];

  // Database favorites preview data
  const favoriteDbPreviews: DatabasePreviewProps[] = [
    {
      title: "NY Court Cases",
      icon: HiOutlineScale,
      path: "/database/law-database"
    },
    {
      title: "Case Analytics",
      icon: HiOutlineClock,
      path: "/database/law-database"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Main Quick Start Section - Premium Centered Design */}
      <section className="mb-20 flex flex-col items-center">
        {/* Just the welcome title with black text */}
        <div className="mb-14">
          <h1 className="text-6xl font-bold text-center text-gray-900 tracking-tight">Welcome to Imperium Law</h1>
        </div>
        
        {/* Enhanced page background with cool color gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-violet-500/5 pointer-events-none -z-20"></div>
        
        {/* Shared background decorative elements with cool colors */}
        <div className="relative w-full max-w-7xl">
          {/* Large decorative circles with increased size and visibility */}
          <div className="absolute top-[-200px] left-[-10%] w-[900px] h-[900px] rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-400/10 blur-3xl -z-10"></div>
          <div className="absolute top-[10%] right-[-20%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-purple-400/15 to-cyan-400/10 blur-3xl -z-10"></div>
          <div className="absolute bottom-[-200px] left-[20%] w-[900px] h-[900px] rounded-full bg-gradient-to-br from-teal-400/15 to-blue-400/10 blur-3xl -z-10"></div>
          
          {/* Grid of cards */}
          <div className="grid grid-cols-3 gap-10 w-full">
            {quickStartItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`group relative overflow-hidden rounded-2xl flex flex-col items-center justify-center text-center p-12
                          min-h-[340px]
                          backdrop-blur-2xl backdrop-filter
                          bg-white/20 bg-gradient-to-br ${cardTints[index]}
                          border border-white/50
                          shadow-[0_15px_50px_rgba(0,0,0,0.15)]
                          hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:bg-white/25
                          transition-all duration-500`}
                style={{
                  backgroundImage: `
                    radial-gradient(circle at ${20 + index * 10}% ${30 + index * 5}%, rgba(99, 102, 241, 0.18) 0%, transparent 50%)
                  `
                }}
              >
                {/* Premium top highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                
                {/* Enhanced reflection effect */}
                <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/40 to-transparent opacity-30 rounded-t-2xl"></div>
                
                {/* Random decorative accent circles with enhanced glow */}
                <div className={`absolute top-[-100px] right-[-80px] w-[260px] h-[260px] rounded-full ${accentColorClasses[index]} blur-3xl opacity-70`}></div>
                <div className={`absolute bottom-[-60px] left-[-80px] w-[280px] h-[280px] rounded-full ${accentColorClasses[(index + 2) % 6]} blur-3xl opacity-60`}></div>
                <div className={`absolute top-[40%] right-[10%] w-[120px] h-[120px] rounded-full ${accentColorClasses[(index + 4) % 6]} blur-xl opacity-50`}></div>
                
                {/* Enhanced background radial gradient unique to each card */}
                <div className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at ${20 + index * 12}% ${30 + index * 8}%, rgba(99, 102, 241, 0.18) 0%, transparent 60%)
                    `
                  }}
                ></div>
                
                {/* Icon with direct display and much larger size */}
                <div className="relative z-10 mb-14 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                  <item.icon className="w-40 h-40 text-gray-900 opacity-85" />
                </div>
                
                {/* Label text with enhanced styling */}
                <span className="relative z-10 text-2xl font-semibold text-gray-900 tracking-wide group-hover:scale-105 transition-transform duration-500">{item.label}</span>
                
                {/* Subtle bottom border glow with cool colors */}
                <div className="absolute bottom-0 left-[5%] right-[5%] h-[3px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Home section with favorites preview - Moved lower */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-1 bg-gray-200 rounded-md mr-2">
              <HiOutlineBuildingOffice2 className="w-4 h-4 text-gray-700" />
            </div>
            <h2 className="text-xl font-medium">Recent Favorites</h2>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-3 pr-8 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
            <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="btn btn-sm btn-primary">
            <HiOutlinePlus className="w-4 h-4 mr-1" />
            New
          </button>
        </div>
        
        {/* Table header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200 px-2 text-sm text-gray-500">
          <div className="w-full">Name</div>
          <div className="w-32 text-right">Last modified</div>
        </div>
        
        {/* Database previews */}
        <div className="space-y-2 mt-2">
          {favoriteDbPreviews.map((db) => (
            <DatabasePreviewCard 
              key={db.title}
              title={db.title}
              icon={db.icon}
              path={db.path}
            />
          ))}
          
          {/* View all favorites link */}
          <div 
            className="rounded-xl px-4 py-3 text-accent-primary hover:bg-accent-primary/5 transition-colors duration-200 cursor-pointer flex items-center"
            onClick={() => navigate('/favorites')}
          >
            <span className="font-medium">View all favorites</span>
            <HiOutlineArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 