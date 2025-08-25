import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Assuming react-icons/hi2 is installed, or adjust imports as needed
import { 
  HiOutlineHome, 
  HiOutlineStar, 
  HiOutlineBolt, // Using Bolt for Triggers (was Signal)
  HiOutlineArrowUpOnSquare, 
  HiOutlineTrash,
  HiOutlineCog6Tooth, // Settings icon
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown, // Dropdown icons
  HiOutlineChevronRight,
  HiOutlineDocumentMagnifyingGlass, // Icon for AI Trace Report
  HiOutlineIdentification, // Icon for Manage Contacts
  HiOutlineCircleStack, // Icon for Database
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBuildingOffice2,
  HiOutlineCpuChip,
  HiOutlineEnvelope, // Icon for Email
  HiOutlineChartBar, // Icon for Outreach Tracking
  HiOutlineClipboardDocumentCheck,
  HiOutlineGlobeAlt
} from 'react-icons/hi2'; 
import { useLayout } from '../context/LayoutContext'; 

const SideNav = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout(); 

  // Define reusable classes
  const linkBaseClass = `flex items-center p-2 rounded text-sm transition-colors duration-200`;
  const linkTextColor = "text-gray-700 hover:bg-gray-200";
  const activeLinkClass = "bg-gray-200 font-medium text-gray-900"; 
  // No margin logic here
  const iconClass = `w-5 h-5 text-gray-500 flex-shrink-0`; 
  const nestedLinkClass = `flex items-center pr-2 py-1.5 rounded text-xs transition-colors duration-200 ${linkTextColor}`;
  const nestedActiveLinkClass = "bg-gray-200 font-medium text-gray-800";
  // Text class handles visibility/width
  const linkTextClass = `whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'}`; // Add margin-left here for expanded state

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    // Sidebar container: light background, fixed position, width, padding
    <nav 
      className={`fixed top-0 left-0 h-screen bg-gray-50 flex flex-col z-30 border-r border-gray-200 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20 px-2 py-4' : 'w-60 p-4'}`}
    >
      {/* Logo/Title Section */}
      <div className={`mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-2'}`}> 
         <span className={`font-semibold text-gray-800 transition-all duration-200 ${isSidebarCollapsed ? 'text-lg' : 'text-xl'}`}> 
           {/* Changed to DB */} 
           {isSidebarCollapsed ? 'IL' : 'Imperium Law'} 
         </span> 
      </div>

      {/* Main Navigation Links */}
      <ul className="flex-grow space-y-1 overflow-y-auto overflow-x-hidden">
        <li>
          <NavLink
            to="/"
            end 
            // Center content when collapsed
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Home" : undefined}
          >
            <HiOutlineHome className={iconClass} />
            <span className={linkTextClass}>Home</span>
          </NavLink>
        </li>
        {/* Databases */}
        <li>
          <NavLink
            to="/databases" 
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Databases" : undefined}
          >
            <HiOutlineCircleStack className={iconClass} />
            <span className={linkTextClass}>Databases</span>
          </NavLink>
        </li>
        {/* Favorites */}
        <li>
          <NavLink
            to="/favorites" 
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Favorites" : undefined}
          >
            <HiOutlineStar className={iconClass} />
            <span className={linkTextClass}>Favorites</span>
          </NavLink>
        </li>
        
        {/* Renamed Signals to Triggers */}
        <li>
          <NavLink
            to="/exports" 
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Exports" : undefined}
          >
            <HiOutlineArrowUpOnSquare className={iconClass} />
            <span className={linkTextClass}>Exports</span>
          </NavLink>
        </li>
        {/* Email Link */}
        <li>
          <NavLink
            to="/email"
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Email" : undefined}
          >
            <HiOutlineEnvelope className={iconClass} />
            <span className={linkTextClass}>Email</span>
          </NavLink>
        </li>
        {/* Outreach Tracking Link */}
        <li>
          <NavLink
            to="/outreach-tracking"
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Outreach Tracking" : undefined}
          >
            <HiOutlineChartBar className={iconClass} />
            <span className={linkTextClass}>Outreach Tracking</span>
          </NavLink>
        </li>
         <li>
          <NavLink
            to="/trash" 
            className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : linkTextColor} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? "Trash" : undefined}
          >
            <HiOutlineTrash className={iconClass} />
            <span className={linkTextClass}>Trash</span>
          </NavLink>
        </li>
      </ul>

      {/* Bottom Links & Collapse Button */}
      <div className={`mt-auto pt-2 space-y-0.5 ${isSidebarCollapsed ? 'border-t border-gray-200 pt-2' : ''}`}> 
         <li className={`${isSidebarCollapsed ? 'mt-2' : 'mt-4'}`}> 
             <button 
                 onClick={toggleSidebar} 
                 // Apply centering when collapsed
                 className={`${linkBaseClass} ${linkTextColor} w-full ${isSidebarCollapsed ? 'justify-center' : ''}`} 
                 title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             > 
                 {isSidebarCollapsed ? 
                     <HiOutlineArrowRightOnRectangle className={iconClass} /> 
                     : 
                     <HiOutlineArrowLeftOnRectangle className={iconClass} /> 
                 }
                 <span className={linkTextClass}>Collapse</span> 
             </button> 
         </li> 
      </div>
    </nav>
  );
};

export default SideNav; 