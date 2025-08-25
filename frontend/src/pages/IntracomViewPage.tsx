import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Papa from 'papaparse';
import CompanyDetailModal from '../components/CompanyDetailModal'; // Adjust path if needed
import { FiMaximize2, FiX, FiSearch, FiFilter, FiChevronDown, FiCopy } from 'react-icons/fi'; // Import necessary icons
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
    HiOutlineMagnifyingGlass // Replaced DocumentSearch icon
} from 'react-icons/hi2';
import toast from 'react-hot-toast'; // For Copy feedback
import '../styles/animations.css'; // Import animations CSS

// Ensure the styles are applied
const styleEl = document.createElement('style');
styleEl.textContent = `
  /* Apply custom styling for modal */
  .modal-custom-large {
    --tw-bg-opacity: 0.95;
    backdrop-filter: blur(16px);
  }
  
  .modal-custom-large::backdrop {
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
  }
  
  .modal-custom-large .modal-box {
    max-width: 80vw;
    width: 100%;
    max-height: 85vh;
  }
`;
document.head.appendChild(styleEl);

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

// Define the tabs configuration for Intracom data
const TABS_CONFIG: Omit<DataSet, 'data' | 'headers' | 'isLoading' | 'error'>[] = [
  {
    name: 'Installers: 1-10 emp, USA (5,400 rows)',
    filePath: '/Intracom/IC Intracom - Network, Security, A_V Installers - 1=10 - No closer than 50 miles to a major city or town (pop 100,000 or above) - V-Installers-1-10-employee\'s-USA - 5.4k .csv'
  },
  {
    name: 'AV Installers: All (1,065 rows)',
    filePath: '/Intracom/ICTC - For Alex - AV Installers - All.csv'
  },
  {
    name: 'AV Installers: Location Specific (65 rows)',
    filePath: '/Intracom/ICTC - For Alex - AV Installers - Location Specific.csv'
  }
];

// --- Tab Descriptions ---
const TAB_DESCRIPTIONS = [
    "Full dataset of network, security, and A/V installers with 1-10 employees across the United States.",
    "Comprehensive list of AV installers across the United States, selected based on specialized criteria for partnership opportunities.",
    "Targeted list of AV installers in specific geographic locations, optimized for strategic market coverage and partnership development."
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
  // Add a prop to know if animation should run (prevents re-animating on page change)
  isDataLoadingOrAnimating: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ dataSet, itemsPerPage, onCompanyClick, onExpandTextClick, isDataLoadingOrAnimating }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { data: fullData, headers, isLoading, error } = dataSet;
  const linkHeaders = useMemo(() => new Set([
    'LinkedIn Profile', 'Website', 'Company Website', 'Company Domain', 
    'Domain', 'URL', 'LinkedIn URL', 'LinkedIn', 'Web Address', 
    'Company URL', 'Homepage', 'Social Media', 'Facebook', 'Twitter',
    'Instagram', 'YouTube', 'Corporate Website'
  ]), []);
  const isUrl = useCallback((str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      // More robust URL detection:
      // 1. Starts with http:// or https://
      // 2. Contains a domain with a TLD (e.g., .com, .org, etc.)
      // 3. Ensure it's not just an email address (doesn't contain @ symbol)
      // 4. Minimal length requirement to avoid false positives
      const trimmed = str.trim();
      if (trimmed.length < 4) return false; // Too short to be a valid URL
      
      // Check for obvious http/https URLs
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
      
      // Check for www. prefix
      if (trimmed.startsWith('www.')) return true;
      
      // Check for domain pattern (contains a dot, no spaces, not an email)
      if (
        trimmed.includes('.') && 
        !trimmed.includes(' ') && 
        !trimmed.includes('@') &&
        /\.[a-z]{2,}$/i.test(trimmed) // Ends with a TLD (at least 2 chars)
      ) return true;
      
      return false;
    } catch (_) {
      return false;
    }
  }, []);
  const ensureProtocol = useCallback((url: string): string => {
    if (!url) return '#'; // Return a safe default for empty URLs
    
    const trimmed = url.trim();
    
    // Already has a protocol
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    // Add https:// to any URL without a protocol
    return `https://${trimmed}`;
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
    'Company Name': 'max-w-60', 
    'Full Name': 'max-w-48',    
    'Job Title': 'max-w-60',
    'Location': 'max-w-52',
    'LinkedIn Profile': 'max-w-40',
    'Company Domain': 'max-w-40', // Add max-width for domain
    'Justification for Rating': 'max-w-72', 
    'Alignment': 'max-w-72', 
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${selectedRows.size > 0 ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20' : 'bg-white/5 border-white/10 text-text-muted cursor-not-allowed opacity-60'}`}
                    disabled={selectedRows.size === 0}
                 >
                    <FiCopy className="w-4 h-4"/> Copy Selected ({selectedRows.size})
                 </button>
            </div>
        </div>

        {/* Table container - Make it flex-grow and match the gray background */}
        <div className="flex-grow overflow-auto rounded-lg table-scroll-container scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-white/10 scrollbar-track-transparent scrollbar-thumb-rounded-full">
          <table className="min-w-full bg-transparent border-collapse border-none">
            <thead className="sticky top-0 bg-gray-100 dark:bg-background-secondary z-10"> 
              <tr className="border-none">
                 {/* Checkbox Header */}
                 <th className="sticky left-0 z-20 bg-gray-100 dark:bg-background-secondary px-3 py-2.5 text-center" style={{width: '3rem'}}> 
                    <label className="flex justify-center items-center">
                       <input type="checkbox" className="checkbox checkbox-xs checkbox-primary border-gray-300 dark:border-white/30 focus:ring-offset-0" 
                         checked={isAllCurrentPageSelected} onChange={(e) => handleSelectAllCurrentPage(e.target.checked)} aria-label="Select all" />
                     </label>
                 </th>
                 
                 {/* Index Header */}
                 <th className="sticky left-12 z-20 bg-gray-100 dark:bg-background-secondary px-3 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-text-secondary uppercase tracking-wider" style={{width: '4rem'}}>
                    #
                 </th>
                 
                 {/* Data Headers */}
                 {headers.map((header, index) => (
                    <th key={index} className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                      {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((rowData, rowIndex) => {
                const absoluteIndex = startIndex + rowIndex;
                const isSelected = selectedRows.has(absoluteIndex);
                
                // Determine if this is a new row (for animation)
                const animationDelay = isDataLoadingOrAnimating ? `${rowIndex * 30}ms` : '0ms';
                
                return (
                  <tr 
                    key={absoluteIndex} 
                    onClick={() => onCompanyClick(rowData)}
                    className={`hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-accent-primary/10' : 'bg-transparent'} cursor-pointer`}
                    style={{ 
                      animationDelay, 
                      animationFillMode: 'both', 
                      animation: isDataLoadingOrAnimating ? 'fadeInUp 0.3s ease-out' : 'none' 
                    }}
                  >
                    {/* Checkbox Cell - Sticky */}
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2 text-center whitespace-nowrap" onClick={(e) => { e.stopPropagation(); handleRowSelect(absoluteIndex); }}>
                       <label className="flex justify-center items-center">
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-xs checkbox-primary border-gray-300 dark:border-white/30 focus:ring-offset-0" 
                          checked={isSelected} 
                          onChange={() => {}} 
                          aria-label={`Select row ${absoluteIndex + 1}`}
                        />
                       </label>
                     </td>
                    
                    {/* Index Cell - Sticky */}
                    <td className="sticky left-12 z-10 bg-inherit px-3 py-2 text-sm text-gray-500 dark:text-text-muted whitespace-nowrap">
                      {absoluteIndex + 1}
                    </td>
                    
                    {/* Data Cells */}
                    {headers.map((header, cellIndex) => {
                      const cellValue = rowData[header] || '';
                      const isLinkHeader = linkHeaders.has(header);
                      const isValidUrl = isLinkHeader && isUrl(cellValue);
                      const maxWidthClass = columnMaxWidths[header] || columnMaxWidths.default;
                      
                      return (
                        <td key={cellIndex} className="px-3 py-2 text-sm text-gray-900 dark:text-text-primary whitespace-nowrap">
                          {isValidUrl ? (
                            <TruncatedText text={cellValue} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} header={header}>
                              <a 
                                href={ensureProtocol(cellValue)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-accent-primary hover:text-accent-primary/80 hover:underline"
                              >
                                {cellValue}
                                </a>
                            </TruncatedText>
                          ) : (
                            <TruncatedText text={cellValue} maxWidthClass={maxWidthClass} onExpandClick={onExpandTextClick} header={header} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls - simple version matching the image exactly */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-text-secondary py-2 mt-2 border-t border-gray-200 dark:border-gray-700/30">
            <div>
              Page {currentPage} of {totalPages} ({totalItems} results)
            </div>
            
            <div className="flex items-center space-x-3">
                <button 
                     onClick={() => handlePageChange(currentPage - 1)} 
                     disabled={currentPage === 1}
                className="text-sm text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
                 >
                ‹ Prev
                 </button>
              
              {/* Always show page 1 */}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(1)}
                  className={`${currentPage === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  1
                </button>
              )}
              
              {/* Only show ellipsis if we're not near the beginning */}
              {currentPage > 3 && <span className="text-gray-400">...</span>}
              
              {/* Show page numbers around current page */}
              {Array.from({ length: 5 }, (_, i) => {
                // Calculate which pages to show based on current position
                let pageNum;
                if (currentPage <= 3) {
                  // Near the beginning
                  pageNum = i + 2; // Show 2,3,4,5,6
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 5 + i; // Show last 5 pages
                } else {
                  // Middle - show 2 before and 2 after
                  pageNum = currentPage - 2 + i;
                }
                
                // Skip if outside valid range
                if (pageNum <= 1 || pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${currentPage === pageNum ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {/* Only show ellipsis if not near the end */}
              {currentPage < totalPages - 3 && <span className="text-gray-400">...</span>}
              
              {/* Always show last page if we're not on it */}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`${currentPage === totalPages ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  {totalPages}
                </button>
              )}
              
                <button 
                     onClick={() => handlePageChange(currentPage + 1)} 
                     disabled={currentPage === totalPages}
                className="text-sm text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
                 >
                Next ›
                 </button>
            </div>
        </div>
        )}
     </div>
  );
};

// Loading Overlay - Shown when data is initially loading
const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-3">
      <div className="flex items-center justify-center gap-4 mb-2">
        {/* First circle with animation */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-primary animate-spin"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <HiOutlineCircleStack className="h-6 w-6 text-accent-primary" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-medium text-text-primary">Loading Database</h3>
          <p className="text-text-secondary">Preparing Intracom Data...</p>
        </div>
      </div>
      
      <div className="loading-sequence flex items-center gap-3 text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="loading-item">⬤</span>
          <span>Parsing CSV</span>
        </div>
        <span className="text-text-muted/30">→</span>
        <div className="flex items-center gap-1.5">
          <span className="loading-item delay-300">⬤</span>
          <span>Processing Data</span>
        </div>
        <span className="text-text-muted/30">→</span>
        <div className="flex items-center gap-1.5">
          <span className="loading-item delay-600">⬤</span>
          <span>Rendering View</span>
        </div>
      </div>
    </div>
  );
};

// Filtering Animation Overlay - Shown when switching tabs
const FilteringAnimationOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-3">
      <div className="flex items-center justify-center gap-4 mb-2">
        {/* Rotating icon */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <HiOutlineAdjustmentsHorizontal className="h-6 w-6 text-accent-primary animate-pulse" />
          </div>
        </div>
        
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-medium text-text-primary">Filtering Data</h3>
          <p className="text-text-secondary">Applying criteria to database...</p>
        </div>
      </div>
      
      <div className="w-64 h-2 bg-accent-primary/20 rounded-full overflow-hidden">
        <div className="h-full bg-accent-primary rounded-full animate-progress"></div>
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
                        <h2 className="font-bold text-3xl text-text-primary mb-2 text-center">Intracom Database</h2>
                        <p className="text-text-muted text-center text-base">Network, security, and A/V installer intelligence.</p>
        </div>

                    {/* Right Column: Content & Action */}
                    <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col">
                        <h3 className="font-semibold text-2xl text-text-primary mb-6">Database Overview</h3>
                        
                        {/* Criteria Section - Refined Look matching site aesthetic */}
                        <div className="mb-6 border border-white/10 bg-background-accent/30 rounded-lg p-5">
                            <h4 className="font-medium text-base mb-3 text-text-primary flex items-center">
                                <HiOutlineDocumentText className="w-5 h-5 mr-2 text-accent-primary flex-shrink-0"/>Targeting Profile (Key Focus)
                       </h4>
                            <div className="text-sm grid grid-cols-2 gap-x-5 gap-y-2 pl-7"> 
                                <div><span className="font-medium text-text-muted w-20 inline-block">Focus:</span><span className="text-text-primary">Network & A/V</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Employees:</span><span className="text-text-primary">1-10</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Location:</span><span className="text-text-primary">Rural USA</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Distance:</span><span className="text-text-primary">50+ mi from cities</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Skills:</span><span className="text-text-primary">Installation</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Type:</span><span className="text-text-primary">Contractors</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Segments:</span><span className="text-text-primary">Security, A/V</span></div>
                                <div><span className="font-medium text-text-muted w-20 inline-block">Titles:</span><span className="text-text-primary">Owner, Mgr.</span></div>
        </div>
      </div> 

                        {/* Enhanced Flowchart with clearer process visualization */}
                        <div className="flex-grow mb-4">
                            <h4 className="font-medium text-base mb-4 text-text-primary">Filtering Process Flow</h4>
                            
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
                                                <h5 className="text-sm font-medium text-text-primary">1-10 Employees USA</h5>
                                                <p className="text-xs text-text-secondary mt-1">Initial dataset of US installers with 1-10 employees</p>
                          </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">5,400 records</span>
                          </div>
                          </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[22px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
        </div>
      </div>

                                {/* Step 2: Hyper-Targeted Filter */}
                                <div className="relative mb-8 ml-4">
                                    <div className="absolute left-[-16px] top-4 w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center text-xs font-bold z-10">2</div>
                                    <div className="bg-background-accent/20 border border-white/10 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Hyper-Targeted</h5>
                                                <p className="text-xs text-text-secondary mt-1">Filtered by skills, services, and expertise</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">1,500 records</span>
                                        </div>
                                    </div>
                                    {/* Connecting arrow */}
                                    <div className="absolute left-[18px] top-[48px] h-6 w-5 overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent-primary/30"></div>
                                        <div className="absolute left-0 bottom-0 h-3 w-3 border-b border-r border-accent-primary/30 rounded-br-sm transform rotate-45 translate-x-[-4px]"></div>
                                    </div>
                                </div>
                                
                                {/* Step 3: Rural Filter */}
                                <div className="relative ml-8">
                                    <div className="absolute left-[-20px] top-4 w-7 h-7 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 text-accent-secondary flex items-center justify-center text-xs font-bold z-10">3</div>
                                    <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg p-3 ml-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-sm font-medium text-text-primary">Rural Location Filter</h5>
                                                <p className="text-xs text-text-secondary mt-1">50+ miles from cities (pop. 100,000+)</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-accent-secondary/10 text-accent-secondary rounded-md">603 records</span>
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

// Main page component
const IntracomViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPageTitle, setIsSidebarCollapsed } = useLayout();
  
  // State for managing datasets
  const [dataSets, setDataSets] = useState<DataSet[]>(
    TABS_CONFIG.map(config => ({
      ...config,
      data: [],
      headers: [],
      isLoading: false,
      error: null
    }))
  );
  
  // Active tab index and loading states
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [isDataSwitching, setIsDataSwitching] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true); // Show intro modal by default
  
  // Selected company for detail view
  const [selectedCompany, setSelectedCompany] = useState<CsvRow | null>(null);
  
  // For expanded text modal
  const [expandedText, setExpandedText] = useState<string>('');
  const [expandedHeader, setExpandedHeader] = useState<string>('');
  const [showTextModal, setShowTextModal] = useState(false);
  
  const activeDataSet = useMemo(() => dataSets[activeTabIndex], [dataSets, activeTabIndex]);
  const companyDetailModalRef = useRef<HTMLDialogElement>(null);
  const textModalRef = useRef<HTMLDialogElement>(null);
  
  // Set page title
  useEffect(() => {
    setPageTitle('Intracom Database');
  }, [setPageTitle]);
  
  // Effect to control sidebar collapse, just like PCBAPage and DatabaseViewPage
  useEffect(() => {
    console.log('IntracomViewPage mounted, collapsing sidebar.');
    setIsSidebarCollapsed(true); // Collapse sidebar when this page is shown
    return () => {
      console.log('IntracomViewPage unmounted, expanding sidebar.');
      setIsSidebarCollapsed(false); // Expand sidebar when navigating away
    };
  }, [setIsSidebarCollapsed]);

  // Load the active dataset
  useEffect(() => {
    const loadActiveDataSet = async () => {
      const currentDataSet = dataSets[activeTabIndex];
      
      // Skip if data is already loaded or currently loading
      if (currentDataSet.data.length > 0 || currentDataSet.isLoading) {
        return;
      }
      
      // Set loading state
      setDataSets(prev => {
        const newDataSets = [...prev];
        newDataSets[activeTabIndex] = {
          ...newDataSets[activeTabIndex],
          isLoading: true,
          error: null
        };
        return newDataSets;
      });
      
      try {
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Fetch data
        const response = await fetch(currentDataSet.filePath);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        // Parse CSV
        Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
            const parsedData = results.data as CsvRow[];
            const headers = results.meta.fields || [];
            
            setDataSets(prev => {
              const newDataSets = [...prev];
              newDataSets[activeTabIndex] = {
                ...newDataSets[activeTabIndex],
                data: parsedData,
                headers: headers,
                isLoading: false
              };
              return newDataSets;
            });
            
            // End loading states after a short delay for animation
        setTimeout(() => {
              setIsInitialDataLoading(false);
              setIsDataSwitching(false);
            }, 500);
          },
          error: (error: Error) => {
            console.error("CSV Parsing Error:", error);
            setDataSets(prev => {
              const newDataSets = [...prev];
              newDataSets[activeTabIndex] = {
                ...newDataSets[activeTabIndex],
                isLoading: false,
                error: `CSV parsing error: ${error.message}`
              };
              return newDataSets;
            });
            
            setIsInitialDataLoading(false);
            setIsDataSwitching(false);
          }
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setDataSets(prev => {
          const newDataSets = [...prev];
          newDataSets[activeTabIndex] = {
            ...newDataSets[activeTabIndex],
            isLoading: false,
            error: error instanceof Error ? error.message : String(error)
          };
          return newDataSets;
        });
        
        setIsInitialDataLoading(false);
        setIsDataSwitching(false);
      }
    };
    
    loadActiveDataSet();
  }, [activeTabIndex, dataSets]);
  
  // Handle tab click
  const handleTabClick = (index: number) => {
    if (index === activeTabIndex) return;
    
    setActiveTabIndex(index);
    
    // If data isn't loaded yet for this tab, show loading state
    if (dataSets[index].data.length === 0) {
      setIsDataSwitching(true);
    }
  };
  
  // Handle company click for details
  const handleCompanyClick = (rowData: CsvRow) => {
    setSelectedCompany(rowData);
    if (companyDetailModalRef.current) {
      companyDetailModalRef.current.showModal();
    }
  };
  
  // Close company modal
  const handleCloseCompanyModal = () => {
    if (companyDetailModalRef.current) {
      companyDetailModalRef.current.close();
    }
    
    // Reset selected company after a delay (for transition)
    setTimeout(() => {
      setSelectedCompany(null);
    }, 300);
  };

  // Handle expanded text for truncated cells
  const handleExpandTextClick = (text: string, header: string) => {
    setExpandedText(text);
    setExpandedHeader(header);
    setShowTextModal(true);
    
    if (textModalRef.current) {
      textModalRef.current.showModal();
    }
  };
  
  // Close text modal
  const handleCloseTextModal = () => {
    if (textModalRef.current) {
      textModalRef.current.close();
    }
    
    // Reset text after a delay (for transition)
    setTimeout(() => {
      setShowTextModal(false);
      setExpandedText('');
      setExpandedHeader('');
    }, 300);
  };

  // Handle intro modal acceptance
  const handleAcceptIntro = () => {
    setShowIntroModal(false);
  };

  // Add function to handle navigation back to favorites
  const handleBackToFavorites = () => {
    navigate('/favorites');
  };
  
  // Render the component
  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gray-50 dark:bg-background-primary">
      {/* Top Navigation Bar - Keep only this one */}
      <div className="flex-shrink-0 bg-white dark:bg-background-secondary border-b border-gray-200 dark:border-white/10 shadow-sm z-20">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side with back button */}
          <div className="flex items-center">
            <button 
              onClick={handleBackToFavorites}
              className="p-2 text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary rounded-full transition-colors"
              aria-label="Back to favorites"
            >
              <HiOutlineArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
          {/* Right side with workspace icon */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-sm font-medium mr-2">AK</div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-700 dark:text-text-primary">Alex Kaymakannov</span>
                <span className="text-xs text-gray-500 dark:text-text-secondary">Alex's Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Section - Matches the style of other pages */}
      <div className="flex-shrink-0 bg-white dark:bg-background-secondary px-6 pt-6 pb-4">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-text-primary">Intracom Database</h1>
        <p className="text-sm text-gray-600 dark:text-text-secondary mt-2">Browse Intracom's datasets of Network, Security, and A/V installers</p>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex-shrink-0 flex items-center px-6 py-3 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-background-secondary">
        <div className="flex border-b border-gray-200 -mb-px">
          {dataSets.map((dataSet, index) => (
               <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`px-4 py-2.5 text-sm font-medium focus:outline-none border-b-2 transition-colors duration-200 ${
                index === activeTabIndex
                  ? 'border-blue-500 text-blue-600 dark:text-accent-primary dark:border-accent-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-text-secondary dark:hover:text-text-primary dark:hover:border-white/20'
              }`}
            >
              {dataSet.name}
              {dataSet.isLoading && (
                <span className="loading loading-spinner loading-xs ml-2"></span>
              )}
               </button>
             ))}
        </div>
           </div>
        
      {/* Tab Description */}
      <div className="px-6 pt-4">
        <div className="bg-blue-50 dark:bg-background-accent/30 border border-blue-200 dark:border-white/10 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-text-secondary leading-relaxed flex items-start">
            <HiOutlineInformationCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            {TAB_DESCRIPTIONS[activeTabIndex]}
          </p>
            </div>
        </div>

      {/* Main Content Area */}
      <div className="flex-grow px-6 pb-6 pt-4 overflow-hidden">
        <div className="bg-transparent rounded-lg h-full overflow-hidden">
          {/* Table or empty state */}
          <div className="h-full p-4">
          <DataTable 
            dataSet={activeDataSet} 
            itemsPerPage={ITEMS_PER_PAGE} 
            onCompanyClick={handleCompanyClick}
            onExpandTextClick={handleExpandTextClick}
              isDataLoadingOrAnimating={isInitialDataLoading || isDataSwitching}
          />
        </div>
      </div> 

        {/* Loading overlays */}
        {isInitialDataLoading && <LoadingOverlay />}
        {!isInitialDataLoading && isDataSwitching && <FilteringAnimationOverlay />}
                  </div>
      
      {/* Introduction Modal */}
      {showIntroModal && <IntroModal onAccept={handleAcceptIntro} />}
      
      {/* Company Detail Modal */}
      <dialog id="company_detail_modal" className="modal modal-custom-large" ref={companyDetailModalRef}>
        <div className="modal-box">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">
              {selectedCompany && (selectedCompany['Company Name'] || 'Company Details')}
            </h3>
            <button className="btn btn-sm btn-ghost" onClick={handleCloseCompanyModal}>
              <FiX size={20} />
            </button>
              </div>
          <div className="mt-4">
            {selectedCompany && <CompanyDetailModal companyData={selectedCompany} headers={activeDataSet.headers} onClose={handleCloseCompanyModal} />}
        </div>
      </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseCompanyModal}>close</button>
          </form>
        </dialog>
      
      {/* Text Expansion Modal */}
      <dialog id="text_modal" className="modal" ref={textModalRef}>
               <div className="modal-box">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">{expandedHeader}</h3>
            <button className="btn btn-sm btn-ghost" onClick={handleCloseTextModal}>
              <FiX size={20} />
            </button>
                   </div>
          <div className="mt-4 whitespace-pre-wrap break-words">
            {expandedText}
                   </div>
               </div>
           <form method="dialog" className="modal-backdrop">
              <button onClick={handleCloseTextModal}>close</button>
           </form>
       </dialog>
    </div>
  );
};

// Export the IntracomViewPage component as the default export
export default IntracomViewPage;