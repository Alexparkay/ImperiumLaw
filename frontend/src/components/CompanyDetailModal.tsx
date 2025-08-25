import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CgWorkAlt } from 'react-icons/cg';
import { 
  HiOutlineUser, 
  HiOutlineBuildingOffice2, 
  HiOutlineMapPin, 
  HiOutlineCurrencyDollar, 
  HiOutlineUsers, 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineLink, 
  HiOutlineStar, 
  HiOutlineRectangleGroup, 
  HiOutlineDocumentText, 
  HiOutlineBuildingLibrary, 
  HiOutlineCheck, 
  HiOutlineTag,
  HiOutlineXMark,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineScale,
  HiOutlineGlobeAlt,
  HiOutlineExclamationTriangle,
  HiOutlineBriefcase 
} from 'react-icons/hi2';

// Assuming CsvRow type is defined elsewhere or passed
interface CsvRow {
  [key: string]: string;
}

interface CompanyDetailModalProps {
  companyData: CsvRow | null;
  headers: string[];
  onClose: () => void;
}

// Helper for individual key info items
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; emoji?: string }> = ({ icon, label, value, emoji }) => {
  // Function to make values like emails, URLs, etc. clickable if they aren't already React elements
  const renderClickableValue = (val: string | React.ReactNode): React.ReactNode => {
    if (React.isValidElement(val)) return val;
    
    if (typeof val === 'string') {
      // Email links
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return <a href={`mailto:${val}`} className="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">{val}</a>;
      }
      
      // Website/URL links
      if (/^(https?:\/\/|www\.)[^\s]+\.[^\s]+/.test(val) || 
          /\.(com|org|net|edu|gov|io|co)[^\s]*$/.test(val)) {
        const href = val.startsWith('http') ? val : `https://${val.replace(/^www\./, '')}`;
        return <a href={href} className="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">{val}</a>;
      }
      
      // LinkedIn profile links
      if (val.includes('linkedin.com') || label.toLowerCase().includes('linkedin')) {
        const href = val.startsWith('http') ? val : `https://${val.replace(/^www\./, '')}`;
        return <a href={href} className="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">{val}</a>;
      }
      
      // Phone numbers - clickable on mobile
      if (/^\+?[\d\s\(\)-]{7,}$/.test(val)) {
        return <a href={`tel:${val.replace(/[\s\(\)-]/g, '')}`} className="text-text-primary hover:text-accent-primary">{val}</a>;
      }
    }
    
    return val;
  };
  
  return (
    <div className="flex items-start text-sm mb-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
      <span className="text-accent-primary mr-2 mt-0.5">{icon}</span>
      <div className="flex flex-col">
        <div className="flex items-center">
          {emoji && <span className="mr-2">{emoji}</span>}
          <span className="text-text-secondary mr-1.5 text-xs uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-text-primary font-medium break-words mt-1">{renderClickableValue(value)}</span>
      </div>
    </div>
  );
};

// Component for visualizing scores (Rating, Match Score)
const ScoreVisualization: React.FC<{ label: string; score: string; colorClass: string; emoji: string }> = ({ label, score, colorClass, emoji }) => {
  // Extract numerical value (assuming format "X/10")
  const scoreValue = parseInt(score?.split('/')[0] || '0', 10);
  const percentage = isNaN(scoreValue) ? 0 : (scoreValue / 10) * 100;

  return (
    <div className="flex flex-col items-center text-center">
      <div 
        className={`radial-progress ${colorClass} mb-2`} 
        style={{ "--value": percentage, "--size": "5rem", "--thickness": "8px" } as React.CSSProperties} 
        role="progressbar"
      >
        <span className="text-text-primary text-lg font-medium flex flex-col items-center">
          <span className="text-2xl mb-1">{emoji}</span>
          {scoreValue}/10
        </span>
      </div>
      <span className="text-xs text-text-secondary font-medium uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
};

// Updated DetailSection to use ReactMarkdown and a slightly different background
const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: string; emoji?: string }> = ({ title, icon, children, emoji }) => (
  <div className="bg-background-accent/40 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 p-4 rounded-xl mb-4 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
    <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center border-b border-white/10 pb-2">
      {icon}
      <span className="ml-2">{title}</span>
      {emoji && <span className="ml-2">{emoji}</span>}
    </h3>
    <div className="prose prose-invert prose-sm max-w-none text-text-secondary">
       <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  </div>
);

// New component for displaying all raw data in a table
const RawDataTable: React.FC<{ data: CsvRow }> = ({ data }) => {
  const entries = Object.entries(data).filter(([key, value]) => value && value.trim() !== '');
  
  if (entries.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-background-accent/30">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Field</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {entries.map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? 'bg-black/10' : 'bg-black/5'}>
              <td className="px-4 py-2 text-xs text-text-secondary">{key}</td>
              <td className="px-4 py-2 text-sm text-text-primary">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Category types for organizing fields
type FieldCategory = 
  | 'contact' 
  | 'business'
  | 'ownership'
  | 'financial'
  | 'classification'
  | 'risk'
  | 'facility'
  | 'other';

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ companyData, headers, onClose }) => {
  if (!companyData) return null;
  
  // Function to get field value safely
  const getData = (headerName: string): string => {
    // Trim the data to remove leading/trailing whitespace
    const data = headers.includes(headerName) ? companyData[headerName] || '' : '';
    return data.trim();
  };

  // Get company name for header
  const companyName = getData('Company Name');
  
  // Organize data by category for better display
  const categorizedData = useMemo(() => {
    const result: Record<FieldCategory, Record<string, string>> = {
      contact: {},
      business: {},
      ownership: {},
      financial: {},
      classification: {},
      risk: {},
      facility: {},
      other: {}
    };
    
    // Categorize each field
    for (const header of headers) {
      const value = getData(header);
      if (!value) continue;
      
      const lowerHeader = header.toLowerCase();
      
      // Categorize each field based on its name
      if (lowerHeader.includes('name') || lowerHeader.includes('address') || lowerHeader.includes('phone') || 
          lowerHeader.includes('email') || lowerHeader.includes('website') || lowerHeader.includes('contact') || 
          lowerHeader.includes('linkedin')) {
        result.contact[header] = value;
      }
      else if (lowerHeader.includes('business') || lowerHeader.includes('description') || lowerHeader.includes('activity') ||
              lowerHeader.includes('service') || lowerHeader.includes('product') || lowerHeader.includes('industry')) {
        result.business[header] = value;
      }
      else if (lowerHeader.includes('owner') || lowerHeader.includes('principal') || lowerHeader.includes('ceo') || 
              lowerHeader.includes('founder') || lowerHeader.includes('legal form') || lowerHeader.includes('llc') || 
              lowerHeader.includes('incorporation')) {
        result.ownership[header] = value;
      }
      else if (lowerHeader.includes('revenue') || lowerHeader.includes('sales') || lowerHeader.includes('financial') || 
              lowerHeader.includes('income') || lowerHeader.includes('profit') || lowerHeader.includes('credit') || 
              lowerHeader.includes('dollar') || lowerHeader.includes('usd')) {
        result.financial[header] = value;
      }
      else if (lowerHeader.includes('sic') || lowerHeader.includes('naics') || lowerHeader.includes('code') || 
              lowerHeader.includes('classification') || lowerHeader.includes('category')) {
        result.classification[header] = value;
      }
      else if (lowerHeader.includes('risk') || lowerHeader.includes('rating') || lowerHeader.includes('score') || 
              lowerHeader.includes('match') || lowerHeader.includes('paydex') || lowerHeader.includes('probability')) {
        result.risk[header] = value;
      }
      else if (lowerHeader.includes('facility') || lowerHeader.includes('building') || lowerHeader.includes('location') || 
              lowerHeader.includes('premise') || lowerHeader.includes('square feet')) {
        result.facility[header] = value;
      }
      else {
        result.other[header] = value;
      }
    }
    
    return result;
  }, [companyData, headers]);
  
  // Get counts for card header displays
  const contactCount = Object.keys(categorizedData.contact).length;
  const businessCount = Object.keys(categorizedData.business).length;
  const ownershipCount = Object.keys(categorizedData.ownership).length;
  const financialCount = Object.keys(categorizedData.financial).length;
  const classificationCount = Object.keys(categorizedData.classification).length;
  const riskCount = Object.keys(categorizedData.risk).length;
  const facilityCount = Object.keys(categorizedData.facility).length;
  
  // Extract a few key fields for the stats banner
  const employees = getData('Employee Count');
  const revenue = getData('Revenue Estimation') || getData('Annual Sales') || getData('Annual Sales (USD)');
  const yearStarted = getData('Business Started') || getData('Year Started');
  const legalForm = getData('Legal Form');
  const riskLevel = getData('Risk Level');
  
  // --- Glass Panel Styling ---
  const cardClasses = "glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 p-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"; 

  return (
    // Main container with dark background
    <div className="flex flex-col h-full bg-background-primary text-text-primary" onClick={e => e.stopPropagation()}>
      {/* Header with gradient background */}
      <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-white/10 bg-gradient-to-r from-background-secondary/80 to-background-accent/40 backdrop-filter backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary flex items-center">
            <HiOutlineBuildingOffice2 className="w-6 h-6 mr-2 text-accent-primary" />
            {companyName || 'Company Details'}
          </h2>
          {getData('Line of Business') && <p className="text-text-secondary text-sm mt-1">{getData('Line of Business')}</p>}
        </div>
        <button className="btn btn-sm btn-circle btn-ghost text-text-secondary hover:bg-accent/20" onClick={onClose}>
          <HiOutlineXMark className="w-6 h-6" />
        </button>
      </div>

      {/* Body - Scrollable with better padding and improved grid layout */}
      <div className="flex-grow p-4 overflow-y-auto">
        
        {/* Key Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
          {employees && (
            <div className="bg-background-accent/20 rounded-xl p-3 text-center backdrop-blur-md border border-white/5">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-text-primary font-bold text-lg">{employees}</div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Employees</div>
            </div>
          )}
          {revenue && (
            <div className="bg-background-accent/20 rounded-xl p-3 text-center backdrop-blur-md border border-white/5">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-text-primary font-bold text-lg">{revenue}</div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Revenue</div>
            </div>
          )}
          {yearStarted && (
            <div className="bg-background-accent/20 rounded-xl p-3 text-center backdrop-blur-md border border-white/5">
              <div className="text-2xl mb-1">🗓️</div>
              <div className="text-text-primary font-bold text-lg">{yearStarted}</div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Est. Year</div>
            </div>
          )}
          {legalForm && (
            <div className="bg-background-accent/20 rounded-xl p-3 text-center backdrop-blur-md border border-white/5">
              <div className="text-2xl mb-1">⚖️</div>
              <div className="text-text-primary font-bold text-lg">{legalForm}</div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Legal Form</div>
            </div>
          )}
          {riskLevel && (
            <div className="bg-background-accent/20 rounded-xl p-3 text-center backdrop-blur-md border border-white/5">
              <div className="text-2xl mb-1">⚠️</div>
              <div className="text-text-primary font-bold text-lg">{riskLevel}</div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Risk Level</div>
            </div>
          )}
        </div>

        {/* Three column layout for larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Contact Information */}
          {contactCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineUser className="w-5 h-5 mr-2 text-accent-primary" />
                Contact Information
                <span className="ml-2">📇</span>
                <span className="ml-auto text-xs text-text-muted">{contactCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.contact).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={key.toLowerCase().includes('phone') ? <HiOutlinePhone className="w-4 h-4" /> :
                         key.toLowerCase().includes('address') ? <HiOutlineMapPin className="w-4 h-4" /> :
                         key.toLowerCase().includes('website') ? <HiOutlineGlobeAlt className="w-4 h-4" /> :
                         <HiOutlineUser className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={key.toLowerCase().includes('phone') ? '📞' :
                          key.toLowerCase().includes('address') ? '📍' :
                          key.toLowerCase().includes('website') ? '🌐' :
                          key.toLowerCase().includes('email') ? '📧' :
                          '👤'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Business Information */}
          {businessCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineBriefcase className="w-5 h-5 mr-2 text-accent-primary" />
                Business Information
                <span className="ml-2">🏭</span>
                <span className="ml-auto text-xs text-text-muted">{businessCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.business).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineBriefcase className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'🔧'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ownership Information */}
          {ownershipCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineUser className="w-5 h-5 mr-2 text-accent-primary" />
                Ownership Details
                <span className="ml-2">👑</span>
                <span className="ml-auto text-xs text-text-muted">{ownershipCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.ownership).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineUser className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'👥'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Financial Information */}
          {financialCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineCurrencyDollar className="w-5 h-5 mr-2 text-accent-primary" />
                Financial Information
                <span className="ml-2">💵</span>
                <span className="ml-auto text-xs text-text-muted">{financialCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.financial).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'💲'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Classification Information */}
          {classificationCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineTag className="w-5 h-5 mr-2 text-accent-primary" />
                Classification
                <span className="ml-2">🏷️</span>
                <span className="ml-auto text-xs text-text-muted">{classificationCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.classification).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineTag className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'🔖'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Risk Information */}
          {riskCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineExclamationTriangle className="w-5 h-5 mr-2 text-accent-primary" />
                Risk & Ratings
                <span className="ml-2">⚠️</span>
                <span className="ml-auto text-xs text-text-muted">{riskCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.risk).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineExclamationTriangle className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'📊'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Facility Information */}
          {facilityCount > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineBuildingLibrary className="w-5 h-5 mr-2 text-accent-primary" />
                Facility Information
                <span className="ml-2">🏢</span>
                <span className="ml-auto text-xs text-text-muted">{facilityCount} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.facility).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineBuildingLibrary className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'🏛️'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Information */}
          {Object.keys(categorizedData.other).length > 0 && (
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text-primary mb-3 border-b border-white/10 pb-2 flex items-center">
                <HiOutlineDocumentText className="w-5 h-5 mr-2 text-accent-primary" />
                Other Information
                <span className="ml-2">📋</span>
                <span className="ml-auto text-xs text-text-muted">{Object.keys(categorizedData.other).length} fields</span>
              </h3>
              <div className="pr-1 space-y-0.5">
                {Object.entries(categorizedData.other).map(([key, value]) => (
                  <InfoItem 
                    key={key}
                    icon={<HiOutlineDocumentText className="w-4 h-4" />}
                    label={key}
                    value={value}
                    emoji={'ℹ️'}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Complete Raw Data Table (if needed for reference) */}
        <div className="mt-6">
          <details className="bg-background-accent/20 rounded-lg">
            <summary className="cursor-pointer p-3 font-medium text-text-secondary hover:text-text-primary flex items-center">
              <HiOutlineDocumentText className="w-5 h-5 mr-2" />
              View Complete Raw Data
              <span className="ml-2">📄</span>
            </summary>
            <div className="p-3">
              <RawDataTable data={companyData} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;

// --- Add CSS for glass-panel (e.g., in index.css or a global stylesheet) ---
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .glass-panel {
    @apply bg-base-200/70 backdrop-blur-md; // Use theme color with opacity
    @apply border border-white/10; // Subtle border
    @apply shadow-lg shadow-black/30; // Soft shadow using black with alpha
    // Add transition for potential hover effects if needed later
    // @apply transition-all duration-300;
  }
}

// Ensure your tailwind.config.js has the theme colors defined:
// theme: {
//   extend: {
//     colors: {
//       background: {
//         primary: '#0A0A0A',
//         secondary: '#1A1A1A',
//         accent: '#2A2A2A',
//       },
//       text: {
//         primary: '#FFFFFF',
//         secondary: '#B3B3B3',
//         muted: '#666666',
//       },
//       accent: {
//         primary: '#3B82F6', // Blue
//         secondary: '#10B981', // Green
//         warning: '#F59E0B', // Orange
//       }
//     }
//   }
// }
*/ 