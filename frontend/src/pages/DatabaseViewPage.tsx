import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Papa from 'papaparse';
import CompanyDetailModal from '../components/CompanyDetailModal'; // Adjust path if needed
import CaseAnalyticsVisualization from '../components/CaseAnalyticsVisualization';
import ForeclosureEmailView from '../components/ForeclosureEmailView';
import { FiMaximize2, FiX, FiSearch, FiFilter, FiChevronDown, FiCopy, FiEye } from 'react-icons/fi'; // Import necessary icons
import { FaSortAmountDown } from 'react-icons/fa'; // Import specific sort icon
import { useLayout } from '../context/LayoutContext'; // Import useLayout
import { 
    HiOutlineInformationCircle, 
    HiOutlineArrowRight, // Use the standard right arrow
    HiOutlineCheckCircle, // For Accept button
    HiOutlineCircleStack, // Replaced Database icon
    HiOutlineSparkles, // Used in Loading
    HiOutlineDocumentText, // Icon for criteria
    HiOutlineTableCells,
    HiOutlineAdjustmentsHorizontal, // Icon for Filtering Animation
    HiOutlineEnvelope,
    HiOutlineUser, 
    HiOutlineBuildingOffice2,
    HiOutlineCurrencyDollar,
    HiOutlineScale, // For Legal Form/Ownership
    HiOutlineExclamationTriangle, // For Risk
    HiOutlineCalendar, // For Dates
    HiOutlineMapPin, // For Address
    HiOutlineLink, // For Website
    HiOutlineBriefcase,
    HiOutlineHashtag,
    HiOutlineIdentification,
    HiOutlineReceiptPercent,
    HiOutlineShieldCheck,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineChevronDoubleRight,
    HiOutlinePencil, // For Edit action
    HiOutlineChartBar,
    HiOutlineClipboardDocumentList, // For Copy
    HiOutlinePlusCircle, // For Enrich
    HiOutlineMagnifyingGlass, // Replaced DocumentSearch icon
    HiOutlineClipboard,
    HiOutlineEye
} from 'react-icons/hi2';
import toast from 'react-hot-toast'; // For Copy feedback
import { transformLegalData, getLegalHeaders } from '../utils/legalDataTransform';

// Define a type for the row data (optional but recommended)
interface CsvRow {
  [key: string]: string; // Allows any string keys
}

interface DataSet {
  name: string;
  filePath: string;
  data: CsvRow[];
  headers: string[];
  isLoading: boolean;
  error: string | null;
}

const TABS_CONFIG: Omit<DataSet, 'data' | 'headers' | 'isLoading' | 'error'>[] = [
  {
    name: 'All Foreclosure Cases (200)',
    filePath: '/Law Database/Search-Dockets-Attorneys-Table-1-Default-view-export-1755808906060.csv'
  },
  {
    name: 'Case Analytics',
    filePath: '/Law Database/Search-Dockets-Attorneys-Table-1-Default-view-export-1755808906060.csv'
  }
];

// --- Tab Descriptions ---
const TAB_DESCRIPTIONS = [
    "Complete database of New York State foreclosure cases with detailed information on case duration, legal representatives, and efficiency opportunities.",
    "Visual analytics and insights into case patterns, duration trends, and court performance across New York State counties."
];

const ITEMS_PER_PAGE = 25;

// Component to handle truncated text and showing full text in modal
interface TruncatedTextProps {
  text: string;
  maxWidthClass: string;
  onExpandClick: (text: string, header: string) => void;
  header: string;
  children?: React.ReactNode; // Allow children for wrapping elements like links/buttons
  className?: string; // Allow passing additional classes
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxWidthClass, onExpandClick, header, children, className = '' }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      // Check if the rendered content (children or text) overflows the container
      let contentWidth = 0;
      if (textRef.current) {
          contentWidth = textRef.current.scrollWidth;
      }
      if (containerRef.current) {
        setIsTruncated(contentWidth > containerRef.current.offsetWidth);
      }
    };

    // Use ResizeObserver for more reliable detection
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
        checkTruncation(); // Initial check
        resizeObserver = new ResizeObserver(checkTruncation);
        resizeObserver.observe(containerRef.current);
    }
    
    // Re-check if text content changes
    checkTruncation();

    return () => {
        if (resizeObserver && containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
        }
    };
  }, [text, children]); // Re-check if text or children change

  return (
    // Use flex container to align text/children and the button
    <div ref={containerRef} className={`flex items-center justify-between ${maxWidthClass} ${className}`}> 
      {/* Render children if provided (e.g., a link), otherwise render text */}
      <span ref={textRef} className="block whitespace-nowrap overflow-hidden text-ellipsis">
        {children || text}
      </span>
      {isTruncated && (
        <button 
          onClick={(e) => { 
             e.stopPropagation(); // Prevent row click/selection if the button is clicked
             onExpandClick(text, header); 
          }}
          className="btn btn-ghost btn-xs shrink-0 p-0 ml-1 text-blue-600 hover:text-blue-800" 
          aria-label="Expand text"
          title="View full text"
        >
          <FiMaximize2 size={14} />
        </button>
      )}
    </div>
  );
};

// Reusable Table Component (Modified for Row Animation)
interface DataTableProps {
  dataSet: DataSet;
  itemsPerPage: number;
  onCompanyClick: (rowData: CsvRow) => void; 
  onExpandTextClick: (text: string, header: string) => void;
  onRowDetailClick: (rowData: CsvRow) => void;
  // Add a prop to know if animation should run (prevents re-animating on page change)
  isDataLoadingOrAnimating: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ dataSet, itemsPerPage, onCompanyClick, onExpandTextClick, onRowDetailClick, isDataLoadingOrAnimating }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { data: fullData, headers, isLoading, error } = dataSet;
  const linkHeaders = useMemo(() => new Set(['LinkedIn Profile', 'Website', 'Company Website', 'Company Domain', 'All Websites']), []);
  const isUrl = useCallback((str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      // More robust check: includes protocol or www.
      return str.startsWith('http://') || str.startsWith('https://') || (str.includes('.') && !str.includes(' ') && str.length > 3);
    } catch (_) {
      return false;
    }
  }, []);
  const ensureProtocol = useCallback((url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        // Check if it starts with www. and add https
        if (url.startsWith('www.')) {
            return `https://${url}`;
        }
        // Basic domain check - add https (heuristic)
        if (url.includes('.') && !url.includes(' ') && !url.startsWith('/')) {
             return `https://${url}`;
        }
        // Otherwise, return original (might be an internal path or invalid)
        return url;
    }
    return url;
  }, []);

  // Reset page/selection/scroll when dataset changes
  const prevFilePath = useRef(dataSet.filePath);
  useEffect(() => {
      if (prevFilePath.current !== dataSet.filePath) {
        console.log("Dataset changed, resetting page and selection.");
        setCurrentPage(1);
        setSelectedRows(new Set());
        prevFilePath.current = dataSet.filePath;
        // Optionally scroll table container to top
        document.querySelector('.table-scroll-container')?.scrollTo(0, 0);
      }
  }, [dataSet.filePath]);

  const totalItems = fullData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);

  const currentPageData = useMemo(() => {
    const endIndex = startIndex + itemsPerPage;
    return fullData.slice(startIndex, endIndex);
  }, [fullData, startIndex, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedRows(new Set());
    }
  };
  const handleRowSelect = (absoluteIndex: number) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(absoluteIndex)) {
        newSelected.delete(absoluteIndex);
      } else {
        newSelected.add(absoluteIndex);
      }
      return newSelected;
    });
  };
  const handleSelectAllCurrentPage = (isChecked: boolean) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      currentPageData.forEach((_, index) => {
        const absoluteIndex = startIndex + index;
        if (isChecked) {
          newSelected.add(absoluteIndex);
        } else {
          // Only deselect rows that are currently visible on this page
          if (currentPageData.find((__, i) => startIndex + i === absoluteIndex)) {
             newSelected.delete(absoluteIndex);
          }
        }
      });
      return newSelected;
    });
  };
  const isAllCurrentPageSelected = useMemo(() => {
      // Check if all *currently displayed* rows are selected
      return currentPageData.length > 0 && currentPageData.every((_, index) => selectedRows.has(startIndex + index));
  }, [currentPageData, selectedRows, startIndex]);
  const copySelectedRows = () => {
    const selectedData = Array.from(selectedRows)
      .map(index => fullData[index]) // Map absolute indices to data
      .filter(Boolean); // Filter out potential undefined if index is somehow out of bounds

    if (selectedData.length > 0) {
        const tsvHeaders = ['#', ...headers].join('\t'); // Use actual headers
        // Get the absolute indices of the selected rows for numbering
        const sortedSelectedIndices = Array.from(selectedRows).sort((a, b) => a - b);

        const tsvRows = sortedSelectedIndices.map((absoluteIndex) => {
            const row = fullData[absoluteIndex];
            if (!row) return ''; // Should not happen with filter, but safety check
            // Ensure we map values based on the header order
            const rowValues = headers.map(header => String(row[header] ?? '').trim().replace(/\n|\t/g, ' ')); // Replace newlines/tabs
            return [absoluteIndex + 1, ...rowValues].join('\t');
        }).filter(Boolean); // Filter out any empty strings from safety check

        const tsvString = [tsvHeaders, ...tsvRows].join('\n');
        navigator.clipboard.writeText(tsvString)
            .then(() => console.log(`${selectedRows.size} selected rows copied!`))
            .catch(err => console.error('Copy failed: ', err));
    }
  };

  // --- Modified renderPaginationButtons --- 
  interface PaginationButtonData {
    key: string | number;
    pageNumber?: number;
    isCurrent?: boolean;
    isEllipsis?: boolean;
    isDisabled?: boolean; // For first/last maybe
  }

  const renderPaginationButtons = (): PaginationButtonData[] => {
    const buttons: PaginationButtonData[] = [];
    const maxButtonsToShow = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    if (startPage > 1) {
      buttons.push({ key: 1, pageNumber: 1 });
      if (startPage > 2) buttons.push({ key: 'start-ellipsis', isEllipsis: true });
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push({ key: i, pageNumber: i, isCurrent: currentPage === i });
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push({ key: 'end-ellipsis', isEllipsis: true });
      buttons.push({ key: totalPages, pageNumber: totalPages });
    }
    return buttons;
  };
  // --- End Modified renderPaginationButtons --- 

  // --- Render Logic --- 
  // Show nothing if the initial data load is happening (covered by overlay)
  if (isLoading && isDataLoadingOrAnimating) {
    // Return a placeholder with the correct height to avoid layout shifts
    // Or simply return null if the parent handles the loading state covering this area
    return <div className="min-h-[400px]"></div>; // Placeholder height
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Error loading {dataSet.name}: {error}</span>
      </div>
    );
  }

  if (fullData.length === 0 && !isLoading) {
     return <div className="text-center text-gray-500 py-10">Database for {dataSet.name} loaded, but no data found.</div>;
  }

  // Define max widths for columns (adjust as needed)
  const columnMaxWidths: { [key: string]: string } = {
    'Title': 'max-w-60', 
    'Law Firm': 'max-w-48',    
    'Attorney Name': 'max-w-48',
    'Court': 'max-w-52',
    'Nature of Suit / Type': 'max-w-64',
    'Foreclosure Outreach Email': 'max-w-80',
    'LinkedIn Profile Summary': 'max-w-72',
    'Profile Summary on Decision Maker': 'max-w-72',
    'Party Name': 'max-w-52',
    'Docket': 'max-w-40',
    'Linkedin Url': 'max-w-40',
    'All Relevant Documents associated with Case': 'max-w-80',
    'Case Duration (Days/Months)': 'max-w-40',
    default: 'max-w-48'
  };

  return (
     <div className="flex flex-col h-full"> {/* Ensure container takes height */}
        {/* Top action bar - Apply Dark Theme */}
        <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
             <div className="flex items-center space-x-3 text-sm text-text-muted">
                 {/* Use text instead of buttons for static info */}
                 <span>{headers.length} columns</span> 
                 <span>/</span> 
                 <span>{totalItems} rows</span> 
             </div>
             <div className="flex items-center space-x-2"> 
                 <div className="relative"> 
                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted/70"/> 
                     <input 
                         type="search" 
                         placeholder="Search table..." 
                         className="pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm focus:ring-accent-primary focus:border-accent-primary text-text-secondary placeholder-text-muted/60 shadow-inner shadow-black/10"
                     />
                 </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-sm transition-colors duration-200">
                      <FiFilter className="w-4 h-4"/>
                      <span>Filters</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-sm transition-colors duration-200">
                      <FaSortAmountDown className="w-4 h-4"/>
                      <span>Sort</span>
                  </button>
                 <button 
                    onClick={copySelectedRows} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors duration-200 ${selectedRows.size > 0 ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20' : 'bg-white/5 border-white/10 text-text-muted cursor-not-allowed opacity-60'}`}
                    disabled={selectedRows.size === 0}
                 >
                    <FiCopy className="w-4 h-4"/> Copy Selected ({selectedRows.size})
                 </button>
            </div>
        </div>

        {/* Table container - Make it flex-grow and add custom scrollbar class */}
        <div className="flex-grow overflow-auto border border-white/10 rounded-lg table-scroll-container scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scrollbar-thumb-rounded-full">
          <table className="min-w-full bg-transparent border-collapse">
            <thead className="sticky top-0 bg-background-secondary z-10"> 
              <tr className="border-b border-white/15">
                 {/* Checkbox Header */}
                 <th className="sticky left-0 z-20 bg-background-secondary px-3 py-2.5 text-center border-r border-white/15" style={{width: '3rem'}}> 
                    <label className="flex justify-center items-center">
                       <input type="checkbox" className="checkbox checkbox-xs checkbox-primary border-white/30 focus:ring-offset-0" 
                         checked={isAllCurrentPageSelected} onChange={(e) => handleSelectAllCurrentPage(e.target.checked)} aria-label="Select all" />
                     </label>
                 </th>
                 {/* Index Header */} 
                 <th className="sticky left-12 z-20 bg-background-secondary px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase tracking-wider border-r border-white/15" style={{width: '4rem'}}>#</th> 
                 {/* Data Headers */}
                 {headers.map((header, index) => (
                  <th key={header} className={`px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase tracking-wider ${index < headers.length - 1 ? 'border-r border-white/15' : ''}`}>
                      {header}
                  </th>
                ))}
              </tr>
            </thead>
             {/* Added key to tbody to trigger re-render on data change for animation */}
            <tbody className="divide-y divide-white/10 relative z-0" key={dataSet.filePath || 'loading'}> 
              {currentPageData.map((row, rowIndex) => {
                const absoluteIndex = startIndex + rowIndex;
                const isSelected = selectedRows.has(absoluteIndex);
                // Calculate animation delay - only apply if not currently loading/animating from parent
                const animationDelay = !isDataLoadingOrAnimating ? `${rowIndex * 0.03}s` : '0s'; 
                return (
                  <tr 
                    key={absoluteIndex} 
                    className={`${isSelected ? 'bg-accent-primary/10' : 'hover:bg-gray-200/20 dark:hover:bg-white/10'} transition-colors duration-150 row-appear-animation cursor-pointer`} 
                    style={{ animationDelay }}
                  >
                     {/* Checkbox Cell */}
                     <td className={`sticky left-0 z-10 px-3 py-3 align-middle text-center border-r border-white/15 ${isSelected ? 'bg-accent-primary/10' : 'bg-gray-50 dark:bg-background-secondary/90 backdrop-blur-sm'} transition-colors duration-200`}> 
                       <label className="flex justify-center items-center">
                         <input type="checkbox" className="checkbox checkbox-xs checkbox-primary border-white/30 focus:ring-offset-0" 
                           checked={isSelected} onChange={() => handleRowSelect(absoluteIndex)} onClick={(e) => e.stopPropagation()} aria-label={`Select row ${absoluteIndex + 1}`} />
                       </label>
                     </td>
                     {/* Index Cell - Clickable */} 
                     <td 
                       className={`sticky left-12 z-10 px-4 py-3 align-middle font-mono text-sm text-gray-600 dark:text-text-muted border-r border-white/15 ${isSelected ? 'bg-accent-primary/10' : 'bg-gray-50 dark:bg-background-secondary/90 backdrop-blur-sm'} hover:text-accent-primary cursor-pointer transition-colors duration-200`}
                       onClick={(e) => {
                         e.stopPropagation();
                         onRowDetailClick(row);
                       }}
                     >
                       <span className="hover:underline">{absoluteIndex + 1}</span>
                     </td>
                     {/* Data Cells */}
                    {headers.map((header, cellIndex) => {
                      const cellData = String(row[header] ?? '').trim();
                      const maxWidthClass = columnMaxWidths[header] || columnMaxWidths.default;
                      const cellBaseClasses = `px-6 py-3 align-middle text-sm`;
                      const borderClass = cellIndex < headers.length - 1 ? 'border-r border-white/15' : '';
                      const isEmailColumn = header.toLowerCase().includes('email');

                      let cellContent: React.ReactNode;
                      if (header === 'Company Name') {
                        cellContent = (
                            <TruncatedText text={cellData} header={header} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} className="w-full">
                                <button className="text-blue-600 hover:underline text-left w-full block overflow-hidden text-ellipsis whitespace-nowrap" onClick={(e) => { e.stopPropagation(); onCompanyClick(row); }}>
                                    {cellData} 
                                </button>
                           </TruncatedText>
                        );
                      } else if (linkHeaders.has(header) && isUrl(cellData)) {
                         const correctedUrl = ensureProtocol(cellData);
                         cellContent = (
                            <TruncatedText text={cellData} header={header} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} className="w-full">
                                <a href={correctedUrl} target="_blank" rel="noopener noreferrer" className={`text-blue-600 hover:text-blue-800 hover:underline block overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors duration-200`} onClick={(e) => e.stopPropagation()}>
                                    {cellData}
                                </a>
                            </TruncatedText>
                         );
                      } else {
                        if (isEmailColumn && cellData.includes('@')) {
                          cellContent = (
                            <TruncatedText text={cellData} header={header} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} className="w-full">
                                <a href={`mailto:${cellData}`} className={`text-blue-600 hover:text-blue-800 hover:underline block overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors duration-200`} onClick={(e) => e.stopPropagation()}>
                                    {cellData}
                                </a>
                            </TruncatedText>
                          );
                        } else {
                          cellContent = ( <TruncatedText text={cellData} header={header} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} className="w-full text-gray-700 dark:text-text-secondary group-hover:text-gray-900 dark:group-hover:text-text-primary transition-colors duration-200" /> );
                        }
                      }

                      return (
                        <td key={`${absoluteIndex}-${header}`} className={`${cellBaseClasses} ${borderClass}`}>
                           <div className="min-h-[20px]">{cellContent}</div> {/* Ensure min height for empty cells */} 
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- Modified Pagination Rendering --- */}
        <div className="flex justify-between items-center mt-4 px-1 flex-shrink-0">
            <span className="text-sm text-text-muted">
                 Page <span className="font-medium text-text-secondary">{currentPage}</span> of <span className="font-medium text-text-secondary">{totalPages}</span> ({totalItems} results)
             </span> 
             <div className="flex items-center space-x-1">
                 {/* Previous Button */}
                 <button onClick={() => handlePageChange(currentPage - 1)} className="btn btn-sm btn-ghost text-text-muted hover:bg-white/10 disabled:bg-transparent disabled:text-text-muted/50" disabled={currentPage === 1}>&laquo; Prev</button>
                 
                 {/* Map over the button data array */}
                 {renderPaginationButtons().map((btnData) => {
                     if (btnData.isEllipsis) {
                         return <span key={btnData.key} className="px-3 py-1 text-sm text-text-muted">...</span>;
                     }
                     if (btnData.pageNumber) {
                         const isCurrent = btnData.isCurrent;
                         return (
                             <button 
                                 key={btnData.key} 
                                 onClick={() => handlePageChange(btnData.pageNumber!)}
                                 className={`btn btn-sm border ${isCurrent ? 'bg-accent-primary border-accent-primary text-white' : 'border-white/10 bg-transparent text-text-secondary hover:bg-white/10'}`}
                             >
                                 {btnData.pageNumber}
                             </button>
                         );
                     }
                     return null; // Should not happen
                 })}

                 {/* Next Button */}
                 <button onClick={() => handlePageChange(currentPage + 1)} className="btn btn-sm btn-ghost text-text-muted hover:bg-white/10 disabled:bg-transparent disabled:text-text-muted/50" disabled={currentPage === totalPages}>Next &raquo;</button>
             </div>
        </div>
     </div>
  );
};

// --- Intro Modal Component (Redesigned for Aesthetics) ---
interface IntroModalProps {
  onAccept: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onAccept }) => {
    return (
        // Modal container - ensures centering and backdrop
        <dialog id="intro_modal" className="modal modal-open bg-black/60 backdrop-blur-lg flex items-center justify-center p-4">
            {/* Modal Box - Increased max-width, no padding (handled internally), overflow hidden */}
            <div className="modal-box max-w-5xl w-full bg-background-secondary/80 border border-white/10 shadow-2xl glass-panel p-0 overflow-hidden rounded-2xl">
                <div className="flex flex-col md:flex-row">
                    {/* Left Column: Image & Title */}
                    {/* Gradient background with accent colors to match website aesthetic */}
                    <div className="w-full md:w-[45%] bg-gradient-to-br from-accent-primary/20 via-background-secondary/15 to-transparent p-8 md:p-12 flex flex-col items-center justify-center border-r border-white/5 min-h-[300px]">
                        <img 
                            src="/productivity-vector.png"
                            alt="Database Productivity Illustration"
                            className="max-w-[280px] w-full h-auto mb-8 drop-shadow-lg"
                        />
                        <h2 className="font-bold text-3xl text-text-primary mb-2 text-center">NY Foreclosure Database</h2>
                        <p className="text-text-muted text-center text-base">Legal case duration optimization.</p>
                    </div>

                    {/* Right Column: Content & Action */}
                    <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col">
                        <h3 className="font-semibold text-2xl text-text-primary mb-6">Database Overview</h3>
                        
                        {/* Criteria Section - Refined Look matching site aesthetic */}
                        <div className="mb-6 border border-white/10 bg-background-accent/30 rounded-lg p-5">
                            <h4 className="font-medium text-base mb-3 text-text-primary flex items-center">
                                <HiOutlineDocumentText className="w-5 h-5 mr-2 text-accent-primary flex-shrink-0"/>Case Statistics
                             </h4>
                            <div className="text-sm grid grid-cols-2 gap-x-5 gap-y-2 pl-7"> 
                                <div><span className="font-medium text-text-muted w-20 inline-block">Cases:</span><span className="text-text-primary">563 Total</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Counties:</span><span className="text-text-primary">30+ NY Courts</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Type:</span><span className="text-text-primary">Foreclosures</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Status:</span><span className="text-text-primary">Active & Disposed</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Avg Duration:</span><span className="text-text-primary">287 days</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Efficiency:</span><span className="text-text-primary">35% Faster</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Plaintiffs:</span><span className="text-text-primary">Major Banks</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Target:</span><span className="text-text-primary">Legal Counsel</span></div>
                             </div>
                         </div>

                        {/* Enhanced Flowchart with clearer process visualization */}
                        <div className="flex-grow mb-4">
                            <h4 className="font-medium text-base mb-4 text-text-primary">Database Features</h4>
                            
                            {/* Visual flowchart with connecting arrows and database size indicators */}
                            <div className="relative pl-12 pb-6">
                                {/* Main vertical line */}
                                <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-accent-primary/30 rounded"></div>
                                
                                {/* Step 1: All USA */}
                                <div className="relative mb-8">
                                    <div className="absolute left-[-12px] top-4 w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center text-xs font-bold z-10">1</div>
                                    <div className="bg-background-accent/20 border border-white/10 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Complete Case Data</h5>
                                                <p className="text-xs text-text-secondary mt-1">All NY State foreclosure cases with full details</p>
                                </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">563 cases</span>
                                </div>
                                </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[22px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
                                </div>
                                </div>
                                
                                {/* Step 2: Employee Filter */}
                                <div className="relative mb-8 ml-4">
                                    <div className="absolute left-[-16px] top-4 w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center text-xs font-bold z-10">2</div>
                                    <div className="bg-background-accent/20 border border-white/10 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Efficiency Analysis</h5>
                                                <p className="text-xs text-text-secondary mt-1">Duration metrics and optimization opportunities</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">35% avg reduction</span>
                                        </div>
                                    </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[18px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
                             </div>
                        </div>

                                {/* Step 3: Keyword Filter */}
                                <div className="relative mb-8 ml-8">
                                    <div className="absolute left-[-20px] top-4 w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center text-xs font-bold z-10">3</div>
                                    <div className="bg-background-accent/20 border border-white/10 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Outreach Templates</h5>
                                                <p className="text-xs text-text-secondary mt-1">Pre-written personalized email campaigns</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">84 emails</span>
                                        </div>
                                    </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[14px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
                                    </div>
                                </div>
                                
                                {/* Step 4: Geographic Filter */}
                                <div className="relative mb-8 ml-12">
                                    <div className="absolute left-[-24px] top-4 w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center text-xs font-bold z-10">4</div>
                                    <div className="bg-background-accent/20 border border-white/10 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Legal Contact Data</h5>
                                                <p className="text-xs text-text-secondary mt-1">Decision maker profiles and LinkedIn data</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">450+ contacts</span>
                                        </div>
                                    </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[10px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
                                    </div>
                                </div>
                                
                                {/* Step 5: Top Targets */}
                                <div className="relative ml-16">
                                    <div className="absolute left-[-28px] top-4 w-7 h-7 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 text-accent-secondary flex items-center justify-center text-xs font-bold z-10">5</div>
                                    <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Case Analytics</h5>
                                                <p className="text-xs text-text-secondary mt-1">Visual insights and performance metrics</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-secondary/10 text-accent-secondary rounded-md">Live charts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button - Changed to blue to match website aesthetic */}
                        <div className="mt-6 text-center">
                             <button 
                                className="btn btn-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none text-white font-semibold px-12 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 rounded-full text-base tracking-wide"
                                onClick={onAccept}
                             >
                                 Start Exploring Database
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

// --- Loading Overlay Component ---
const LOADING_MESSAGES = [
    "Analyzing case precedents...",
    "Calculating duration metrics...",
    "Processing court data...",
    "Identifying efficiency opportunities..."
];

const LoadingOverlay: React.FC = () => {
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 1100); // Cycle messages

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-background-primary/95 backdrop-blur-md flex flex-col items-center justify-center z-[9999]">
            <div className="flex items-center justify-center mb-6">
                <HiOutlineSparkles className="w-8 h-8 text-accent-primary animate-pulse" />
            </div>
            <p className="text-lg text-text-secondary animate-pulse text-center px-4">
                {LOADING_MESSAGES[loadingMessageIndex]}
            </p>
        </div>
    );
};

// --- Filtering Animation Overlay Component ---
const FILTERING_MESSAGES = [
    "Applying filter criteria...",
    "Segmenting dataset...",
    "Optimizing view...",
    "Rendering results...",
];

const FilteringAnimationOverlay: React.FC = () => {
    const [filterMessageIndex, setFilterMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFilterMessageIndex((prevIndex) => (prevIndex + 1) % FILTERING_MESSAGES.length);
        }, 1100); // Cycle messages

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-background-primary/95 backdrop-blur-md flex flex-col items-center justify-center z-[9999]">
            <div className="flex space-x-2 mb-6 h-8 items-end">
                <div className="w-2 h-8 bg-accent-primary/50 rounded filter-bar" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-6 bg-accent-primary/50 rounded filter-bar" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-8 bg-accent-primary/50 rounded filter-bar" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-4 bg-accent-primary/50 rounded filter-bar" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-8 bg-accent-primary/50 rounded filter-bar" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-lg text-text-secondary animate-pulse">
                {FILTERING_MESSAGES[filterMessageIndex]}
            </p>
        </div>
    );
};

// --- Helper: Score to Color/Width --- 
const getScoreVisuals = (score: number, type: 'paydex' | 'failure' | 'delinquency'): { color: string; widthPercent: number; label: string } => {
    let color = 'bg-gray-500'; // Default
    let widthPercent = 0;
    let label = 'N/A';
    if (isNaN(score)) return { color, widthPercent, label };

    if (type === 'paydex') {
        widthPercent = Math.max(0, Math.min(100, score));
        if (score >= 80) { color = 'bg-emerald-500'; label = 'Good'; }
        else if (score >= 50) { color = 'bg-yellow-500'; label = 'Fair'; }
        else if (score >= 1) { color = 'bg-red-500'; label = 'Poor'; }
        else { label = 'Undetermined'; }
    } else { // failure & delinquency (assuming similar scale interpretation for demo)
        widthPercent = Math.max(0, Math.min(100, score)); 
        if (score >= 60) { color = 'bg-emerald-500'; label = 'Low Risk'; }
        else if (score >= 30) { color = 'bg-yellow-500'; label = 'Moderate Risk'; }
        else { color = 'bg-red-500'; label = 'High Risk'; }
    }
    return { color, widthPercent: widthPercent, label };
};

// --- Top Target Card Component (v3.5 - Final Syntax Fixes) ---
interface TopTargetCardProps {
  targetData: CsvRow;
  onCompanyClick: (rowData: CsvRow) => void;
  onExpandTextClick: (text: string, header: string) => void;
}

const TopTargetCard: React.FC<TopTargetCardProps> = ({ targetData, onCompanyClick, onExpandTextClick }): JSX.Element => {
    const { handleEnrichClick } = useDatabaseViewContext(); 
    const navigate = useNavigate();
    
    // --- Helper Functions --- 
    function isUrl(str: string): boolean { if (!str || typeof str !== 'string') return false; try { return str.startsWith('http') || str.startsWith('https://') || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str); } catch { return false; } }
    function ensureProtocol(url: string): string { if (!url) return '#'; if (!/^https?:\/\//i.test(url)) { return `https://${url.replace(/^www\./i, '')}`; } return url; }
    const getData = (key: string): string => targetData[key]?.trim() || '';
    const getRiskColorClass = (riskLevel: string, type: 'text' | 'bg' = 'text'): string => { 
         let colorClass = type === 'text' ? 'text-text-muted' : 'bg-gray-500';
         switch (riskLevel?.toLowerCase()) {
             case 'moderate-high': colorClass = type === 'text' ? 'text-orange-400' : 'bg-orange-500/80'; break;
             case 'high': colorClass = type === 'text' ? 'text-red-500' : 'bg-red-500/80'; break;
             case 'moderate': colorClass = type === 'text' ? 'text-yellow-400' : 'bg-yellow-500/80'; break;
             case 'low': colorClass = type === 'text' ? 'text-green-400' : 'bg-green-500/80'; break;
         }
         return colorClass;
     };
    const formatNumber = (value: string): string => {
         if (!value || value === 'N/A') return 'N/A';
         const num = parseInt(value.replace(/[^0-9.-]/g, ''), 10);
         if (isNaN(num)) return 'N/A';
         return new Intl.NumberFormat('en-US', {
             style: 'currency',
             currency: 'USD',
             notation: 'compact',
             maximumFractionDigits: 1
         }).format(num);
     };

    const formatYear = (value: string): string => {
        if (!value || value === 'N/A') return 'N/A';
        const year = parseInt(value.match(/\d{4}/)?.[0] || '', 10);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) return 'N/A';
        return year.toString();
     };
    
    // --- Data Extraction --- 
    const allFields: { [key: string]: string } = {};
    const headersFromData = Object.keys(targetData); 
    headersFromData.forEach(header => { allFields[header.trim()] = getData(header); });
    allFields["City, State"] = allFields['Address']?.split(',').slice(1, 3).join(', ').trim() || '';
    allFields["Principal Name Display"] = allFields['Principal Name'] || allFields['Named Principal'] || 'N/A';
    allFields["Principal Title Display"] = allFields['Principal Titles']?.split(',')[0]?.trim() || 'N/A';
    allFields["Website Display"] = allFields['Website'] || allFields['Company Website'] || allFields['Company Domain'] || '';
    allFields["Business Description Display"] = allFields['Business Description'] || allFields['Business Activity Description'] || '';
    allFields["Annual Sales Display"] = formatNumber(allFields['Annual Sales (USD)']);
    allFields["Business Started Display"] = formatYear(allFields['Business Started']);

    // Define order and grouping for display 
    const displaySections: Record<string, string[]> = {
        "Key Contact": ['Principal Name Display', 'Principal Title Display', 'LinkedIn Profile'],
        "Location & Web": ['Address', 'City, State', 'Website Display'],
        "Operations": ['Line of Business', 'Business Description Display', 'Facility Size', 'Business Started Display'],
        "Corporate": ['Legal Form', 'Ownership', 'State of Incorporation', 'D-U-N-S Number'],
        "Financials & Risk": ['Annual Sales Display', 'Maximum Credit Recommendation (USD)', 'PAYDEX', 'Risk Level'], 
        "Trade Experience": ['Total Trade Experiences', 'Days Beyond Terms (DBT)', 'Highest Past Due (USD)', 'Highest Now Owing (USD)']
    };
    const longTextHeaders = useMemo(() => new Set(['Business Description', 'Business Activity Description', 'Line of Business', 'Principal Titles', 'Trade Names', 'UCC Secured Party', 'Address']), []);

    // --- Render Helper Functions --- 
    const renderInfoItem = (label: string, value: string | React.ReactNode, icon?: React.ReactNode, opts: { isLongText?: boolean; fullWidth?: boolean } = {}) => {
         const { isLongText, fullWidth } = opts;
         const displayValue = typeof value === 'string' ? value.trim() : value;
         if (!displayValue || displayValue === 'N/A' || displayValue === '') return null; 
         
         let valueNode: React.ReactNode = isLongText ? (
             <TruncatedText text={String(displayValue)} header={label} maxWidthClass="max-w-full" onExpandClick={onExpandTextClick} className="text-text-primary leading-snug" />
         ) : (
            <span className="text-text-primary break-words leading-snug">{String(displayValue)}</span>
         );

         return (
             <div className={`py-2 ${fullWidth ? 'sm:col-span-2' : 'col-span-1'}`}>
                 <p className="text-xs font-medium text-text-muted flex items-center mb-1 truncate" title={label}>
                     {icon && React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5 mr-1.5 opacity-70 flex-shrink-0" })}
                     {label}
                  </p>
                  <div className="text-sm pl-5">{valueNode}</div>
             </div>
         );
    };
    
    const renderTopStat = (label: string, value: string, icon: React.ReactNode) => (
          <div className="text-center border border-white/10 bg-black/20 backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg hover:bg-black/25 transition-all duration-300">
              <div className="flex items-center justify-center mb-1.5 text-text-muted/70">
                  {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className="text-lg font-semibold text-text-primary">{value || 'N/A'}</p>
          </div>
      );

    // --- Enrichment Data Simulation (Duplicated from EnrichmentModal for now) ---
    // In a real app, this might be a shared utility or fetched on demand
    const generateEnrichment = (company: string, name: string, titles: string) => {
        const fakeLinkedInBase = `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${company.substring(0,3).toLowerCase()}`;
        const sources = ['LinkedIn', 'Company Website', 'Industry Article'];
        let signals: { source: string; detail: string; url?: string }[] = [];
        let synopsis = `General enrichment suggests focusing on ${company}'s position in the market.`;
        signals.push({ source: 'LinkedIn', detail: `${name} (${titles}) profile reviewed.`, url: fakeLinkedInBase });
        if (targetData['Website'] || targetData['Company Website']) {
            signals.push({ source: 'Website', detail: `Official website analyzed for recent news & positioning.` });
        }
        // Add more dynamic/plausible signals based on company name or random chance for demo
        if (Math.random() > 0.4) {
            signals.push({ source: 'Article', detail: `Referenced in "Wire Harness Trends Q${Math.floor(Math.random()*4)+1} ${new Date().getFullYear()}" regarding market consolidation.`, url: `#` });
            synopsis = `Recent article mentions suggest potential industry consolidation. ${name} might be evaluating strategic options for ${company}. Outreach angle could focus on partnership or acquisition synergies.`
        }
        if (Math.random() > 0.6) {
             signals.push({ source: 'LinkedIn Post', detail: `${name} recently shared thoughts on scaling manufacturing businesses.`, url: fakeLinkedInBase + '/details/posts/' });
             synopsis = `${name}'s recent LinkedIn activity indicates interest in growth strategies. Approaching with potential for scaling ${company} through acquisition could be effective.`
        }
        
        return { sources, signals, synopsis, fakeLinkedIn: fakeLinkedInBase };
     };

     // --- Action Handlers ---
     const handleCopy = () => {
         const text = `Company: ${allFields['Company Name'] || 'N/A'}\nContact: ${allFields['Principal Name Display']}\nLocation: ${allFields['Address'] || 'N/A'}\nPhone: ${allFields['Phone Number'] || 'N/A'}`;
         navigator.clipboard.writeText(text).then(() => {
             toast.success('Contact info copied!');
         }).catch(() => {
             toast.error('Copy failed');
         });
     };

     const handleEmail = () => {
        const subject = `Regarding ${allFields['Company Name']} - Potential Opportunity`;
        const body = `Hello ${allFields['Principal Name Display'].split(',')[0]},\n\nI'd like to discuss a potential opportunity with ${allFields['Company Name']}.`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
     };
    // --- End Action Handlers ---

    return (
        <div className="glass-panel bg-background-secondary/70 rounded-2xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-white/20">            
            {/* --- Card Header --- */}
            <div className="flex justify-between items-start gap-4 p-5 bg-gradient-to-b from-black/20">
                 <div className="flex-grow overflow-hidden">
                    <h3 className="text-xl font-semibold text-text-primary mb-1 hover:text-accent-primary transition-colors duration-300 cursor-pointer" 
                        onClick={() => onCompanyClick(targetData)} 
                        title={allFields['Company Name']}>
                        {allFields['Company Name']}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <HiOutlineMapPin className="w-4 h-4 opacity-70" />
                        <span title={allFields['Address']}>{allFields['City, State'] || 'N/A'}</span>
                </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                        <HiOutlineUser className="w-4 h-4 opacity-70" />
                        <span>{allFields['Principal Name Display']}</span>
                        {allFields['Principal Title Display'] !== 'N/A' && (
                            <span className="text-xs opacity-70">• {allFields['Principal Title Display']}</span>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-lg font-medium text-sm ${getRiskColorClass(allFields['Risk Level'], 'bg')} backdrop-blur-sm`}>
                        {allFields['Risk Level'] || 'N/A'} Risk
                    </span>
                 </div>
            </div>

            {/* --- Scrollable Main Data Area --- */}
            <div className="max-h-60 overflow-y-auto p-4 space-y-6">
                {Object.entries(displaySections).map(([sectionTitle, sectionFields]) => {
                    const fieldsToRender = sectionFields.filter(field => !!allFields[field]);
                    if (fieldsToRender.length === 0) return null;
                    
                    return (
                        <section key={sectionTitle} className="mb-4 last:mb-0">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">{sectionTitle}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {fieldsToRender.map(field => {
                                    const value = allFields[field];
                                    // Skip empty values
                                    if (!value || value === 'N/A') return null;
                                    
                                    // Get the original header name for display
                                    const originalHeader = field.replace('Display', '').trim();
                                    
                                    // Check if this is a URL - should be a link
                                    const isLink = field.includes('Website') || (originalHeader.includes('Website') && isUrl(value));
                                    
                                    // Check if this should be treated as long text
                                    const isLong = longTextHeaders.has(originalHeader) || (!!value && value.length > 100);
                                    
                                    // Regular field rendering
                                    return renderInfoItem(
                                        originalHeader,
                                        isLink ? <a href={ensureProtocol(value)} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">{value}</a> : value,
                                        undefined,
                                        { isLongText: isLong, fullWidth: isLong }
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex justify-end gap-2 p-4 border-t border-white/10 bg-black/20">
                <button onClick={handleCopy} className="btn btn-sm btn-ghost">
                    <HiOutlineClipboard className="w-4 h-4 mr-1" />
                    Copy
                 </button>
                <button onClick={handleEmail} className="btn btn-sm btn-ghost">
                    <HiOutlineEnvelope className="w-4 h-4 mr-1" />
                    Email
                 </button>
                <button onClick={() => handleEnrichClick(targetData)} className="btn btn-sm btn-primary">
                    <HiOutlinePlusCircle className="w-4 h-4 mr-1" />
                    Enrich
                 </button>
             </div>
        </div>
    );
};

// --- Enrichment Modal Component ---
interface EnrichmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetData: CsvRow | null; // Data for the company being enriched
}

const EnrichmentModal: React.FC<EnrichmentModalProps> = ({ isOpen, onClose, targetData }) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const companyName = targetData?.['Company Name'] || 'N/A';
    const principalName = targetData?.['Principal Name'] || targetData?.['Named Principal'] || 'Key Contact';
    const principalTitles = targetData?.['Principal Titles'] || targetData?.['Job Title'] || 'N/A';

    // --- Simulate Enrichment Data --- 
    const generateEnrichment = (company: string, name: string, titles: string) => {
        const fakeLinkedInBase = `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${company.substring(0,3).toLowerCase()}`;
        const sources = ['LinkedIn', 'Company Website', 'Industry Article'];
        let signals: { source: string; detail: string; url?: string }[] = [];
        let synopsis = `General enrichment suggests focusing on ${company}'s position in the market.`;
        signals.push({ source: 'LinkedIn', detail: `${name} (${titles}) profile reviewed.`, url: fakeLinkedInBase });
        if (targetData?.['Website'] || targetData?.['Company Website']) {
            signals.push({ source: 'Website', detail: `Official website analyzed for recent news & positioning.` });
        }
        // Add more dynamic/plausible signals based on company name or random chance for demo
        if (Math.random() > 0.4) {
            signals.push({ source: 'Article', detail: `Referenced in "Wire Harness Trends Q${Math.floor(Math.random()*4)+1} ${new Date().getFullYear()}" regarding market consolidation.`, url: `#` });
            synopsis = `Recent article mentions suggest potential industry consolidation. ${name} might be evaluating strategic options for ${company}. Outreach angle could focus on partnership or acquisition synergies.`
        }
        if (Math.random() > 0.6) {
             signals.push({ source: 'LinkedIn Post', detail: `${name} recently shared thoughts on scaling manufacturing businesses.`, url: fakeLinkedInBase + '/details/posts/' });
             synopsis = `${name}'s recent LinkedIn activity indicates interest in growth strategies. Approaching with potential for scaling ${company} through acquisition could be effective.`
        }
        
        return { sources, signals, synopsis, fakeLinkedIn: fakeLinkedInBase };
    };

    const enrichment = useMemo(() => {
        if (!targetData) return null;
        return generateEnrichment(companyName, principalName, principalTitles);
    }, [targetData, companyName, principalName, principalTitles]);
    // --- End Simulation --- 

    // Effect to handle modal opening/closing based on isOpen prop
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    if (!enrichment) return null; // Don't render if no target data

    return (
        <dialog ref={modalRef} id="enrichment_modal" className="modal modal-bottom sm:modal-middle">
           <div className="modal-box max-w-2xl bg-background-secondary border border-white/10 shadow-2xl glass-panel">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-xl text-text-primary flex items-center">
                         <HiOutlineMagnifyingGlass className="w-5 h-5 mr-2 text-accent-primary"/> Enrichment Details: {companyName} {/* Updated Icon */}
                     </h3>
                     <button className="btn btn-sm btn-circle btn-ghost text-text-muted" onClick={onClose}>✕</button>
                </div>

                {/* Simulated Findings */}
                 <div className="space-y-4">
                     <div>
                         <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-secondary mb-2">Simulated Signals</h4>
                         <ul className="list-none pl-0 space-y-2 text-sm">
                             {enrichment.signals.map((signal, index) => (
                                <li key={index} className="flex items-start gap-2 p-2 bg-black/10 rounded border border-white/5">
                                     <span className="font-medium w-20 text-text-muted flex-shrink-0 text-right text-xs pt-0.5">{signal.source}:</span>
                                     <span className="text-text-secondary flex-grow">{signal.detail}</span>
                                     {signal.url && signal.url !== '#' && (
                                        <a href={signal.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0 tooltip tooltip-left" data-tip="View Source (Simulated)">
                                             <HiOutlineArrowTopRightOnSquare className="w-4 h-4"/>
                                         </a>
                                     )}
                                 </li>
                             ))}
                         </ul>
                     </div>

                    {/* Synopsis */}
                     <div>
                         <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-secondary mb-2">Synopsis & Potential Angle</h4>
                         <p className="text-sm text-text-secondary bg-black/10 p-3 rounded border border-white/5 leading-relaxed">
                             {enrichment.synopsis}
                         </p>
                     </div>
                     
                     {/* Sources Cited */}
                      <div>
                         <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-secondary mb-2">Sources Consulted (Simulated)</h4>
                         <div className="flex flex-wrap gap-2">
                            {enrichment.sources.map(source => (
                                 <span key={source} className="badge badge-outline border-white/20 text-text-muted text-xs">{source}</span>
                             ))}
                         </div>
                     </div>
                 </div>

                <div className="modal-action mt-5">
                    <button className="btn btn-sm btn-ghost text-text-muted hover:bg-white/10" onClick={onClose}>Close</button>
                </div>
            </div>
            {/* Click outside to close */} 
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

// --- Context (Add Enrichment Handler) ---
interface DatabaseViewContextType {
    handleCompanyClick: (rowData: CsvRow) => void;
    handleExpandTextClick: (text: string, header: string) => void;
    handleEnrichClick: (targetData: CsvRow) => void; // Add enrichment handler
}
const DatabaseViewContext = React.createContext<DatabaseViewContextType | null>(null);
const useDatabaseViewContext = () => {
    const context = React.useContext(DatabaseViewContext);
    if (!context) { throw new Error("useDatabaseViewContext must be used within a DatabaseViewProvider"); }
    return context;
};

// Row Detail Side Panel Component
interface RowDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: CsvRow | null;
  headers: string[];
}

const RowDetailPanel: React.FC<RowDetailPanelProps> = ({ isOpen, onClose, rowData, headers }) => {
  if (!rowData) return null;

  // Group fields by category for better organization
  const categorizeFields = () => {
    const categories = {
      'Case Information': ['Date - Case first started', 'Nature of Suit / Type', 'Court', 'Docket', 'Title', 'Status', 'Last Updated - When Court Case Finished', 'Case Duration (Days/Months'],
      'Parties Involved': ['Party Type', 'Party Name', 'Judge'],
      'Legal Representatives': ['Attorney Name', 'Law Firm', 'First Name', 'Last Name', 'Job Title'],
      'Contact Information': ['Foreclosure Legal Contact', 'Foreclosure Outreach Email', 'Linkedin Url', 'LinkedIn Profile Summary'],
      'Additional Details': ['Profile Summary on Decisioon Maker', 'All Relevant Documents associated with Case']
    };

    const categorizedData: Record<string, Array<{ header: string; value: string }>> = {};
    
    Object.entries(categories).forEach(([category, fields]) => {
      categorizedData[category] = fields
        .filter(field => headers.includes(field) && rowData[field])
        .map(field => ({ header: field, value: rowData[field] || '' }));
    });

    // Add any remaining fields not categorized
    const categorizedFields = new Set(Object.values(categories).flat());
    const uncategorized = headers
      .filter(header => !categorizedFields.has(header) && rowData[header])
      .map(header => ({ header, value: rowData[header] || '' }));
    
    if (uncategorized.length > 0) {
      categorizedData['Other Information'] = uncategorized;
    }

    return categorizedData;
  };

  const categorizedData = categorizeFields();
  
  const isUrl = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      const trimmed = str.trim();
      return trimmed.startsWith('http://') || trimmed.startsWith('https://') || 
             trimmed.includes('linkedin.com') || trimmed.includes('.com');
    } catch {
      return false;
    }
  };

  const ensureProtocol = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-1">Case Details</h2>
              <p className="text-sm text-text-secondary">
                {rowData['Title'] || 'Case Information'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-88px)] custom-scrollbar">
          {Object.entries(categorizedData).map(([category, fields]) => (
            fields.length > 0 && (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  {category === 'Case Information' && <HiOutlineScale className="w-5 h-5 text-accent-primary" />}
                  {category === 'Parties Involved' && <HiOutlineUser className="w-5 h-5 text-accent-primary" />}
                  {category === 'Legal Representatives' && <HiOutlineBriefcase className="w-5 h-5 text-accent-primary" />}
                  {category === 'Contact Information' && <HiOutlineEnvelope className="w-5 h-5 text-accent-primary" />}
                  {category === 'Additional Details' && <HiOutlineDocumentText className="w-5 h-5 text-accent-primary" />}
                  {category === 'Other Information' && <HiOutlineInformationCircle className="w-5 h-5 text-accent-primary" />}
                  {category}
                </h3>
                <div className="space-y-3">
                  {fields.map(({ header, value }) => (
                    <div key={header} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="text-xs text-text-muted mb-1">{header}</div>
                      <div className="text-sm text-text-primary">
                        {isUrl(value) ? (
                          <a 
                            href={ensureProtocol(value)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-accent-primary hover:underline flex items-center gap-1"
                          >
                            {value}
                            <HiOutlineArrowTopRightOnSquare className="w-3 h-3" />
                          </a>
                        ) : value.length > 200 ? (
                          <details className="cursor-pointer">
                            <summary className="text-accent-primary hover:underline">
                              {value.substring(0, 200)}... <span className="text-xs">(Click to expand)</span>
                            </summary>
                            <div className="mt-2 whitespace-pre-wrap">{value}</div>
                          </details>
                        ) : (
                          <div className="whitespace-pre-wrap">{value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary/20 transition-colors duration-200">
              <FiCopy className="w-4 h-4" />
              Copy All Details
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-text-secondary rounded-lg hover:bg-white/20 transition-colors duration-200">
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Page Component
const DatabaseViewPage = () => {
  const navigate = useNavigate(); // Use navigate for back button
  const { setIsSidebarCollapsed } = useLayout(); // Use layout context
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [datasets, setDatasets] = useState<DataSet[]>(() => 
      TABS_CONFIG.map(tab => ({ ...tab, data: [], headers: [], isLoading: true, error: null }))
  );
  // Separate modal states
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEnrichmentModalOpen, setIsEnrichmentModalOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState<CsvRow | null>(null);

  // Full Text Modal State
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [fullTextContent, setFullTextContent] = useState('');
  const [fullTextHeader, setFullTextHeader] = useState('');

  // State to control the intro modal visibility
  const [showIntroModal, setShowIntroModal] = useState(true);
  
  // Side panel state for row details
  const [isRowDetailPanelOpen, setIsRowDetailPanelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<CsvRow | null>(null);

  // New state for loading animation after intro
  const [isLoadingAfterIntro, setIsLoadingAfterIntro] = useState(false);

  // New state for filtering animation
  const [isFilteringAnimationActive, setIsFilteringAnimationActive] = useState(false);

  // Ref to track if it's the very first load after intro
  const isInitialTabLoad = useRef(true);

  // Handle navigation to favorites page
  const handleBackToFavorites = () => {
    navigate('/favorites');
  };

  // Effect to control sidebar collapse
  useEffect(() => {
    console.log('DatabaseViewPage mounted, collapsing sidebar.');
    setIsSidebarCollapsed(true); // Collapse sidebar when this page is shown
    return () => {
      console.log('DatabaseViewPage unmounted, expanding sidebar.');
      setIsSidebarCollapsed(false); // Expand sidebar when navigating away
    };
  }, [setIsSidebarCollapsed]); // Dependency array includes the setter

  // Fetch data for a specific tab
  const fetchDataForTab = useCallback((tabIndex: number, isInitial = false) => {
    const tabConfig = TABS_CONFIG[tabIndex];
    // Don't refetch if already loaded unless it's the very first load after intro
    if (!tabConfig || (!isInitial && datasets[tabIndex] && !datasets[tabIndex].isLoading && datasets[tabIndex].data.length > 0)) {
        // If not fetching, ensure loading state is false for the active tab
        if(datasets[tabIndex] && datasets[tabIndex].isLoading) {
             setDatasets(prev => prev.map((ds, index) => index === tabIndex ? { ...ds, isLoading: false } : ds));
        }
        return;
    }
  
     setDatasets(prev => prev.map((ds, index) => 
         index === tabIndex ? { ...ds, isLoading: true, error: null } : ds
     ));

    console.log(`Fetching data for tab: ${tabIndex}`); // Debug log
    Papa.parse(tabConfig.filePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(`Fetch complete for tab: ${tabIndex}`); // Debug log
        // Add a small delay for visual effect when switching tabs
        setTimeout(() => {
            setDatasets(prev => prev.map((ds, index) => {
              if (index === tabIndex) {
                if (results.errors.length) {
                  console.error("CSV Parsing Errors:", results.errors);
                  return { ...ds, isLoading: false, error: `Error parsing CSV: ${results.errors[0].message}` };
                }
                if (results.data && results.data.length > 0) {
                   // Ensure data is CsvRow[]
                   const typedData = results.data as CsvRow[];
                   // Check if the first row looks like headers (heuristic)
                   const firstRowValues = Object.values(typedData[0]);
                   const headerRow = results.meta.fields;
                   let dataToUse = typedData;
                   let headersToUse = headerRow ? headerRow.map(h => h.trim()) : Object.keys(typedData[0]).map(h => h.trim());
                   
                   if(headerRow && firstRowValues.every((val, idx) => String(val).trim() === String(headerRow[idx]).trim())) {
                        console.warn("Detected potential duplicate header row, skipping first data row.");
                        dataToUse = typedData.slice(1);
                   }

                   // Apply legal data transformation if this appears to be legal case data
                   if (headerRow && (headerRow.includes('doc_number') || headerRow.includes('time_took') || headerRow.includes('nature_of_suit'))) {
                       const transformedData = transformLegalData(dataToUse);
                       // Convert all values to strings to match CsvRow interface
                       dataToUse = transformedData.map(row => {
                           const stringRow: CsvRow = {};
                           Object.entries(row).forEach(([key, value]) => {
                               stringRow[key] = value !== undefined ? String(value) : '';
                           });
                           return stringRow;
                       });
                       headersToUse = getLegalHeaders();
                   }

                  return { ...ds, data: dataToUse, headers: headersToUse, isLoading: false, error: null };
                } else {
                  return { ...ds, data: [], headers: results.meta.fields ? results.meta.fields.map(h => h.trim()) : [], isLoading: false, error: 'CSV file is empty or has no data rows.' };
                }
              }
              return ds;
            }));
        }, isInitial ? 0 : 300); // Add delay only for tab switches, not initial load
      },
      error: (err: Error) => {
         console.error("CSV Fetch/Parse Error:", err);
         // Add delay here too for consistency
          setTimeout(() => {
             setDatasets(prev => prev.map((ds, index) => 
              index === tabIndex ? { ...ds, isLoading: false, error: `Failed to load: ${err.message}` } : ds
            ));
         }, 300);
      }
    });
  }, [datasets]); // Dependency: datasets (to check current state)

  // Effect to fetch data after intro OR when tab changes
  useEffect(() => {
    if (!showIntroModal && !isLoadingAfterIntro && !isFilteringAnimationActive) {
        console.log(`Effect triggered: Fetching tab ${activeTabIndex}, initial: ${isInitialTabLoad.current}`);
        fetchDataForTab(activeTabIndex, isInitialTabLoad.current);
        if(isInitialTabLoad.current) {
             isInitialTabLoad.current = false; // Mark initial load as done
        }
    }
    // If filtering just finished, ensure isLoading is false for the active tab
    // This handles the case where fetch finished before the animation timer
    if (!isFilteringAnimationActive && datasets[activeTabIndex]?.isLoading) {
         setDatasets(prev => prev.map((ds, index) => index === activeTabIndex ? { ...ds, isLoading: false } : ds));
    }
  }, [fetchDataForTab, activeTabIndex, showIntroModal, isLoadingAfterIntro, isFilteringAnimationActive, datasets]); // Add isFilteringAnimationActive dependency

  const handleTabClick = (index: number) => {
     if (index === activeTabIndex || isFilteringAnimationActive) return; // Prevent switching during animation
    console.log(`Tab clicked: ${index}`);
    setActiveTabIndex(index);
    setIsFilteringAnimationActive(true); // Start filter animation
    fetchDataForTab(index); // Start fetching data in background

    // End animation after 5 seconds
    setTimeout(() => {
        setIsFilteringAnimationActive(false);
        // Data table will show when isLoading becomes false after fetch completes (handled by useEffect)
    }, 5000);
  };
  
  const activeDataSet = datasets[activeTabIndex] || { name: '', filePath: '', data: [], headers: [], isLoading: true, error: null };

  // Modal Handlers
  const handleCompanyClick = (rowData: CsvRow) => {
    setSelectedCompanyData(rowData);
    setIsCompanyModalOpen(true);
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setTimeout(() => {
        setSelectedCompanyData(null);
    }, 300);
  };

  // Enrichment Handlers
  const handleEnrichClick = (targetData: CsvRow) => {
    if (activeTabIndex === 4) { // Only handle enrichment on Top 3 Expanded tab
      setSelectedCompanyData(targetData);
      setIsEnrichmentModalOpen(true);
    }
  };

  const handleCloseEnrichmentModal = () => {
    setIsEnrichmentModalOpen(false);
    setTimeout(() => {
      if (!isCompanyModalOpen) { // Only clear if company modal is also closed
        setSelectedCompanyData(null);
      }
    }, 300);
  };

  // Full Text Modal Handlers
  const handleExpandTextClick = (text: string, header: string) => {
    setFullTextContent(text);
    setFullTextHeader(header);
    setIsTextModalOpen(true);
    // Use DaisyUI programmatic modal opening
    const modal = document.getElementById('full_text_modal') as HTMLDialogElement | null;
    modal?.showModal();
  };
  const handleCloseTextModal = () => {
    setIsTextModalOpen(false); // Hide the backdrop/state
    // Use DaisyUI programmatic modal closing
    const modal = document.getElementById('full_text_modal') as HTMLDialogElement | null;
    modal?.close();
    // Clear content *after* closing animation (or immediately if no animation)
    setTimeout(() => {
      setFullTextContent('');
      setFullTextHeader('');
    }, 300); // Adjust timing based on modal close animation
  };
  
  // Row Detail Side Panel Handlers
  const handleRowDetailClick = (rowData: CsvRow) => {
    setSelectedRowData(rowData);
    setIsRowDetailPanelOpen(true);
  };
  
  const handleCloseRowDetailPanel = () => {
    setIsRowDetailPanelOpen(false);
    setTimeout(() => {
      setSelectedRowData(null);
    }, 300);
  };

  // Helper to get active dataset headers safely
  const getActiveHeaders = () => activeDataSet?.headers || [];

  const handleAcceptIntro = () => {
      setShowIntroModal(false);
      setIsLoadingAfterIntro(true); 
      isInitialTabLoad.current = true; // Reset initial load flag
      setTimeout(() => {
          setIsLoadingAfterIntro(false);
          // Fetching will be triggered by useEffect now that isLoadingAfterIntro is false
      }, 5000); 
  };

  // Determine if the *data* itself is loading (for DataTable animation prop)
  const isDataLoadingOrAnimating = activeDataSet.isLoading || isFilteringAnimationActive;

  const contextValue = {
      handleCompanyClick,
      handleExpandTextClick,
      handleEnrichClick
  };

  return (
    <DatabaseViewContext.Provider value={contextValue}>
       {/* --- Intro Modal --- */} 
       {showIntroModal && <IntroModal onAccept={handleAcceptIntro} />} 
      
       {/* --- Main Content Drawer System --- */} 
       {/* Wrap drawer in conditional rendering *or* rely on modal overlay */} 
       {/* Let's keep it rendered but obscured by modal initially */} 
       <div className={`relative drawer drawer-end h-full ${showIntroModal ? 'invisible' : ''}`}> {/* Hide drawer content visibility while modal is open */} 
          {/* Loading Overlay */} 
          {isLoadingAfterIntro && <LoadingOverlay />} 

          {/* Hidden checkbox */}
          <input id="company-drawer" type="checkbox" className={`drawer-toggle ${isLoadingAfterIntro ? 'peer' : ''}`} checked={isCompanyModalOpen} onChange={handleCloseCompanyModal} readOnly />
          
          {/* Drawer Content (Main Page) */}
          <div className={`drawer-content flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-background-primary ${isLoadingAfterIntro ? 'opacity-70 blur-sm pointer-events-none' : ''} transition-opacity duration-300`}>
            {/* Top Navigation Bar - Just a white streak with back arrow and workspace icon */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
              <div className="flex items-center justify-between h-14 px-4">
                {/* Left side with back button only */}
                <div className="flex items-center">
                  <button 
                    onClick={handleBackToFavorites}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                    aria-label="Back to favorites"
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

            {/* Database Title Section - Larger heading with subtext */}
            <div className="flex-shrink-0 bg-white px-6 pt-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-800">NY Foreclosure Database</h1>
                  <p className="text-sm text-gray-600 mt-2">Analyze foreclosure cases and optimize case durations for legal counsel</p>
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Law Database/Search-Dockets-Attorneys-Table-1-Default-view-export-1755808906060.csv';
                    link.download = 'NY_Foreclosure_Database.csv';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success('CSV file downloaded successfully!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <HiOutlineArrowTopRightOnSquare className="w-4 h-4 transform rotate-90" />
                  Download CSV
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
             <div className="flex-shrink-0 flex items-center px-6 py-3 border-b border-gray-200 bg-white">
                {/* Tabs - Apply Hover Style */}
                <div className="flex border-b border-gray-200 -mb-px">
                   {datasets.map((dataset, index) => (
                      <button
                         key={dataset.name}
                         onClick={() => handleTabClick(index)}
                         className={`px-4 py-2.5 text-sm font-medium focus:outline-none border-b-2 transition-colors duration-200 ${
                           activeTabIndex === index
                             ? 'border-blue-500 text-blue-600' // Active tab style
                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab hover style
                         } ${isFilteringAnimationActive ? 'cursor-wait opacity-70' : ''}`}
                         disabled={isFilteringAnimationActive}
                      >
                         {dataset.name}
                      </button>
                   ))}
                 </div>
             </div>

            {/* Tab Description Area */}
             <div className="px-6 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                     <p className="text-sm text-blue-800 leading-relaxed">
                        {TAB_DESCRIPTIONS[activeTabIndex]}
                     </p>
                 </div>
             </div>

            {/* Main Content Area - Conditional Rendering */}
             <div className="relative flex-grow flex flex-col min-h-0 px-6 pb-6 pt-2">
                {/* Show Filtering Overlay OR Content */} 
                {isFilteringAnimationActive ? ( 
                    <FilteringAnimationOverlay /> 
                 ) : activeTabIndex === 1 ? (
                     <CaseAnalyticsVisualization 
                         dataSet={activeDataSet} 
                         isLoading={activeDataSet.isLoading}
                     />
                 ) : ( 
                     <DataTable 
                        key={activeDataSet.filePath || activeTabIndex} 
                        dataSet={activeDataSet}
                        itemsPerPage={ITEMS_PER_PAGE} 
                        onCompanyClick={handleCompanyClick}
                        onExpandTextClick={handleExpandTextClick}
                        onRowDetailClick={handleRowDetailClick}
                        isDataLoadingOrAnimating={activeDataSet.isLoading}
                     />
                 )}
             </div>
          </div> 

          {/* Drawer Side (Company Detail) */}
          <div className="drawer-side z-30">
            <label htmlFor="company-drawer" className="drawer-overlay"></label> 
            <div className={`w-full ${activeTabIndex === 2 || activeTabIndex === 3 ? 'max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl' : 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl'} bg-background-secondary border border-white/10 shadow-2xl glass-panel text-text-primary h-full overflow-hidden`}> 
                 {isCompanyModalOpen && selectedCompanyData && (
                     <CompanyDetailModal 
                         companyData={selectedCompanyData} 
                         headers={getActiveHeaders()}
                         onClose={handleCloseCompanyModal}
                     />
                )}
             </div>
          </div>
       </div>

       {/* --- Full Text Modal --- */} 
       <dialog id="full_text_modal" className="modal modal-bottom sm:modal-middle">
           {isTextModalOpen ? (
               <div className="modal-box bg-background-secondary text-text-primary border border-white/10 shadow-xl">
                   <h3 className="font-bold text-lg mb-4 text-text-primary">{fullTextHeader}</h3>
                   <div className="bg-black/20 p-4 rounded-md max-h-60 overflow-y-auto text-sm text-text-secondary whitespace-pre-wrap border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                       {fullTextContent}
                   </div>
                   <div className="modal-action mt-4">
                      <button className="btn btn-sm btn-ghost text-text-muted hover:bg-white/10" onClick={handleCloseTextModal}>Close</button>
                   </div>
               </div>
           ) : null}
           <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
              <button onClick={handleCloseTextModal}>close</button>
           </form>
       </dialog>
       
       {/* Remove redundant Company Detail Modal since we're using the drawer */}
       
       {/* Row Detail Side Panel */}
       <RowDetailPanel
         isOpen={isRowDetailPanelOpen}
         onClose={handleCloseRowDetailPanel}
         rowData={selectedRowData}
         headers={getActiveHeaders()}
       />
       
       {/* Enrichment Modal - Only render when on Top 3 Expanded tab */}
       {activeTabIndex === 4 && (
         <EnrichmentModal 
             isOpen={isEnrichmentModalOpen} 
             onClose={handleCloseEnrichmentModal} 
           targetData={selectedCompanyData} 
       />
       )}
    </DatabaseViewContext.Provider>
  );
};

export default DatabaseViewPage; 