import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineScale, 
  HiOutlineBuildingLibrary, 
  HiOutlineDocumentDuplicate,
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';

interface FavoriteCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  stats: {
    totalRecords: number;
    lastUpdated: string;
    topRegions: string[];
  };
  tags: string[];
  masterPrompt?: string;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ title, description, icon: Icon, path, stats, tags, masterPrompt }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="glass-panel relative rounded-xl border border-white/10 shadow-lg shadow-black/20 
                hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 
                bg-background-secondary/70 backdrop-filter backdrop-blur-lg overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
            <Icon className="w-6 h-6 text-accent-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        </div>
        
        <p className="text-text-secondary mb-4">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs mb-1 flex items-center">
              <HiOutlineDocumentText className="w-3 h-3 mr-1" />
              Total Records
            </span>
            <span className="text-text-primary text-lg font-semibold">{stats.totalRecords.toLocaleString()}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-text-muted text-xs mb-1 flex items-center">
              <HiOutlineCalendarDays className="w-3 h-3 mr-1" />
              Last Updated
            </span>
            <span className="text-text-primary text-sm">{stats.lastUpdated}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-text-muted text-xs mb-1 flex items-center">
              <HiOutlineGlobeAlt className="w-3 h-3 mr-1" />
              Top Regions
            </span>
            <span className="text-text-primary text-sm">{stats.topRegions.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Master Prompt Section */}
      {masterPrompt && (
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-br from-background-accent/5 to-background-accent/10 backdrop-blur-sm 
                        border border-white/5 rounded-xl p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-accent-primary" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">Search Criteria</h4>
            </div>
            
            <div className="space-y-2">
              {masterPrompt.split('\n\n').map((section, index) => (
                <div key={index} className="space-y-1">
                  {section.split('\n').map((line, lineIndex) => {
                    if (line.startsWith('Target:')) {
                      return (
                        <div key={lineIndex} className="mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2 text-accent-primary">
                            <HiOutlineUser className="w-4 h-4" />
                            <span className="text-xs font-medium">{line}</span>
                          </div>
                        </div>
                      );
                    }
                    
                    if (line.includes(':')) {
                      const [label, value] = line.split(':').map(str => str.trim());
                      return (
                        <div key={lineIndex} className="flex">
                          <span className="text-xs text-text-muted min-w-[120px]">{label}:</span>
                          <span className="text-xs text-text-primary flex-1 pl-2">{value}</span>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={lineIndex} className="text-xs text-text-primary pl-2">
                        {line}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mini Chart - Visual Element */}
      <div className="px-6 pb-4">
        <div className="w-full h-16 bg-background-accent/30 rounded-lg overflow-hidden">
          <div className="flex h-full items-end justify-between px-2">
            {[40, 65, 35, 70, 50, 80, 40, 60, 75, 45, 55, 70].map((height, index) => (
              <div 
                key={index} 
                className="w-1 bg-accent-primary/70 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="px-6 pb-6 flex justify-end">
        <button 
          onClick={() => navigate(path)}
          className="btn btn-primary gap-2"
        >
          Open Database
          <HiOutlineArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const favorites: FavoriteCardProps[] = [
    {
      title: "NY Foreclosure Database",
      description: "Comprehensive New York State foreclosure case data with duration optimization insights for legal professionals.",
      icon: HiOutlineScale,
      path: "/database/ny-foreclosure",
      stats: {
        totalRecords: 563,
        lastUpdated: "Jan 18, 2025",
        topRegions: ["New York", "Kings", "Queens"]
      },
      tags: ["Legal Analytics", "Foreclosure", "Case Duration", "NY Courts"],
      masterPrompt: `Case Type: Foreclosure Proceedings
Jurisdiction: New York State Courts
Total Cases: 563 Active & Disposed
Average Duration: 287 days
Efficiency Opportunity: 35% reduction potential
Plaintiffs: Major Banks & Lenders
Defendants: Property Owners
Court Coverage: 30+ NY Counties

Target: Legal Counsel, Law Firms specializing in foreclosure defense

Key metrics include case duration analysis, attorney performance benchmarks, and efficiency optimization opportunities for faster case resolution.`
    }
  ];

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Legal Databases</h1>
        <p className="text-text-secondary">Access comprehensive legal case data and analytics</p>
      </div>
      
      {/* Stats Overview */}
      <div className="glass-panel p-6 rounded-xl mb-8 border border-white/10 shadow-lg shadow-black/20 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
            <HiOutlineDocumentText className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-text-primary">563</h3>
            <p className="text-text-muted text-sm">Total Cases</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
            <HiOutlineChartBar className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-text-primary">35%</h3>
            <p className="text-text-muted text-sm">Efficiency Gain</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4">
            <HiOutlineUser className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-text-primary">84</h3>
            <p className="text-text-muted text-sm">Law Firms</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mr-4">
            <HiOutlineClock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-text-primary">287 days</h3>
            <p className="text-text-muted text-sm">Avg. Case Duration</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard 
            key={favorite.title}
            title={favorite.title}
            description={favorite.description}
            icon={favorite.icon}
            path={favorite.path}
            stats={favorite.stats}
            tags={favorite.tags}
            masterPrompt={favorite.masterPrompt}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage; 