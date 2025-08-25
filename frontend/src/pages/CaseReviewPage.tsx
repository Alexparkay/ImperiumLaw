import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineExclamationTriangle,
  HiOutlineFolder,
  HiOutlineFolderPlus,
  HiOutlineInformationCircle,
  HiOutlinePaperClip,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineDocumentDuplicate,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineArrowUpTray,
  HiOutlinePlusCircle,
  HiOutlineEye,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineArrowRight
} from 'react-icons/hi2';

// Mock data for due diligence tasks
const dueDiligenceCategories = [
  {
    id: 'financial',
    name: 'Financial',
    icon: <HiOutlineChartBar className="w-5 h-5 text-blue-500" />,
    progress: 65,
    tasks: [
      { id: 'fin-1', name: 'Financial Statements (3 years)', status: 'completed', dueDate: '2023-09-05', assignee: 'Michael Chen' },
      { id: 'fin-2', name: 'Cash Flow Analysis', status: 'completed', dueDate: '2023-09-08', assignee: 'Michael Chen' },
      { id: 'fin-3', name: 'Debt Schedule Review', status: 'completed', dueDate: '2023-09-12', assignee: 'Sarah Johnson' },
      { id: 'fin-4', name: 'Revenue Recognition Assessment', status: 'in-progress', dueDate: '2023-09-18', assignee: 'Michael Chen' },
      { id: 'fin-5', name: 'Tax Returns (3 years)', status: 'completed', dueDate: '2023-09-10', assignee: 'Michael Chen' },
      { id: 'fin-6', name: 'Working Capital Analysis', status: 'not-started', dueDate: '2023-09-25', assignee: 'Sarah Johnson' },
      { id: 'fin-7', name: 'Inventory Valuation', status: 'in-progress', dueDate: '2023-09-20', assignee: 'Michael Chen' },
    ]
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: <HiOutlineShieldCheck className="w-5 h-5 text-purple-500" />,
    progress: 42,
    tasks: [
      { id: 'leg-1', name: 'Corporate Records Review', status: 'completed', dueDate: '2023-09-07', assignee: 'David Martinez' },
      { id: 'leg-2', name: 'Contract Review', status: 'in-progress', dueDate: '2023-09-22', assignee: 'David Martinez' },
      { id: 'leg-3', name: 'Litigation Review', status: 'in-progress', dueDate: '2023-09-15', assignee: 'David Martinez' },
      { id: 'leg-4', name: 'IP Review', status: 'not-started', dueDate: '2023-09-28', assignee: 'Emily Wilson' },
      { id: 'leg-5', name: 'Regulatory Compliance', status: 'not-started', dueDate: '2023-10-05', assignee: 'David Martinez' },
      { id: 'leg-6', name: 'Environmental Compliance', status: 'not-started', dueDate: '2023-10-12', assignee: 'Emily Wilson' }
    ]
  },
  {
    id: 'operational',
    name: 'Operational',
    icon: <HiOutlineCog6Tooth className="w-5 h-5 text-amber-500" />,
    progress: 80,
    tasks: [
      { id: 'ops-1', name: 'Facilities Assessment', status: 'completed', dueDate: '2023-09-05', assignee: 'James Wilson' },
      { id: 'ops-2', name: 'Supply Chain Review', status: 'completed', dueDate: '2023-09-08', assignee: 'James Wilson' },
      { id: 'ops-3', name: 'Operational Procedures', status: 'completed', dueDate: '2023-09-12', assignee: 'James Wilson' },
      { id: 'ops-4', name: 'Equipment Evaluation', status: 'completed', dueDate: '2023-09-15', assignee: 'Alex Thompson' },
      { id: 'ops-5', name: 'Capacity Analysis', status: 'in-progress', dueDate: '2023-09-20', assignee: 'James Wilson' }
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: <HiOutlineUserGroup className="w-5 h-5 text-green-500" />,
    progress: 30,
    tasks: [
      { id: 'hr-1', name: 'Employment Contracts', status: 'completed', dueDate: '2023-09-10', assignee: 'Sarah Johnson' },
      { id: 'hr-2', name: 'Compensation Review', status: 'in-progress', dueDate: '2023-09-18', assignee: 'Sarah Johnson' },
      { id: 'hr-3', name: 'Benefits Analysis', status: 'not-started', dueDate: '2023-09-26', assignee: 'Sarah Johnson' },
      { id: 'hr-4', name: 'Organizational Structure', status: 'not-started', dueDate: '2023-10-02', assignee: 'Alex Thompson' },
      { id: 'hr-5', name: 'Culture Assessment', status: 'not-started', dueDate: '2023-10-09', assignee: 'Alex Thompson' }
    ]
  }
];

// Recent activity mock data
const recentActivity = [
  { id: 1, user: 'Michael Chen', action: 'uploaded', document: 'Q3 Financial Statement', time: '35 minutes ago', icon: <HiOutlineArrowUpTray className="w-4 h-4 text-blue-500" /> },
  { id: 2, user: 'Sarah Johnson', action: 'completed', document: 'Employee Contracts Review', time: '2 hours ago', icon: <HiOutlineCheckCircle className="w-4 h-4 text-green-500" /> },
  { id: 3, user: 'David Martinez', action: 'commented on', document: 'Litigation Risk Assessment', time: '3 hours ago', icon: <HiOutlineDocumentText className="w-4 h-4 text-purple-500" /> },
  { id: 4, user: 'James Wilson', action: 'updated', document: 'Supplier Agreements', time: '5 hours ago', icon: <HiOutlineDocumentDuplicate className="w-4 h-4 text-amber-500" /> },
  { id: 5, user: 'Emily Wilson', action: 'flagged issue with', document: 'Trademark Registration', time: '1 day ago', icon: <HiOutlineExclamationTriangle className="w-4 h-4 text-red-500" /> }
];

// Risk factors mock data
const riskFactors = [
  { id: 1, category: 'Financial', name: 'Customer Concentration', severity: 'high', description: 'Top 3 customers represent 60% of revenue' },
  { id: 2, category: 'Legal', name: 'Pending Litigation', severity: 'medium', description: 'Trademark dispute with potential competitor' },
  { id: 3, category: 'Operational', name: 'Supply Chain Risk', severity: 'medium', description: 'Single source supplier for key component' },
  { id: 4, category: 'HR', name: 'Key Personnel Retention', severity: 'high', description: 'CTO and lead developer not committed to stay post-acquisition' }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  let label = '';

  switch (status) {
    case 'completed':
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-500';
      icon = <HiOutlineCheckCircle className="w-4 h-4 mr-1" />;
      label = 'Completed';
      break;
    case 'in-progress':
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-500';
      icon = <HiOutlineArrowPath className="w-4 h-4 mr-1" />;
      label = 'In Progress';
      break;
    case 'not-started':
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
      icon = <HiOutlineClipboardDocumentList className="w-4 h-4 mr-1" />;
      label = 'Not Started';
      break;
    default:
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Risk severity component
const RiskSeverity = ({ severity }: { severity: string }) => {
  let bgColor = '';
  let textColor = '';

  switch (severity.toLowerCase()) {
    case 'high':
      bgColor = 'bg-red-500/20';
      textColor = 'text-red-500';
      break;
    case 'medium':
      bgColor = 'bg-amber-500/20';
      textColor = 'text-amber-500';
      break;
    case 'low':
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-500';
      break;
    default:
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

const DueDiligencePage = () => {
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useLayout();
  const [selectedCategory, setSelectedCategory] = useState(dueDiligenceCategories[0].id);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

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

  // Calculate total progress
  const totalTasks = dueDiligenceCategories.reduce((acc, category) => acc + category.tasks.length, 0);
  const completedTasks = dueDiligenceCategories.reduce((acc, category) => 
    acc + category.tasks.filter(task => task.status === 'completed').length, 0);
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  // Toggle task expansion
  const toggleTaskExpansion = (categoryId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Get the selected category data
  const selectedCategoryData = dueDiligenceCategories.find(category => category.id === selectedCategory);

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
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">Due Diligence</h1>
          <p className="text-gray-600">
            Track and manage the due diligence process for your acquisition targets.
          </p>
        </motion.div>
        
        {/* Overview stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-4 gap-6 mb-8"
        >
          {/* Overall progress */}
          <div className="glass-panel rounded-xl p-5 border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <HiOutlineClipboardDocumentCheck className="w-5 h-5 mr-2 text-blue-500" />
              Overall Progress
            </dt>
            <dd className="mt-2">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">{overallProgress}%</span>
              </div>
            </dd>
            <dd className="mt-3 text-sm text-gray-500">
              {completedTasks} of {totalTasks} tasks complete
            </dd>
          </div>
          
          {/* Days remaining */}
          <div className="glass-panel rounded-xl p-5 border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:scale-[1.02]">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <HiOutlineClock className="w-5 h-5 mr-2 text-red-500" />
              Days Remaining
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-800">
              14
            </dd>
            <dd className="mt-1 text-xs text-gray-600">
              Until target completion date
            </dd>
          </div>
          
          {/* Open issues */}
          <div className="glass-panel rounded-xl p-5 border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02]">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <HiOutlineExclamationTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Open Issues
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-800">
              4
            </dd>
            <dd className="mt-1 flex items-center text-xs text-gray-600">
              <span className="text-red-500 flex items-center">
                <HiOutlineExclamationTriangle className="w-3 h-3 mr-1" />
                2 high priority
              </span>
            </dd>
          </div>
          
          {/* Documents */}
          <div className="glass-panel rounded-xl p-5 border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:scale-[1.02]">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <HiOutlineDocumentText className="w-5 h-5 mr-2 text-green-500" />
              Documents
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-800">
              32
            </dd>
            <dd className="mt-1 text-xs text-gray-600">
              21 approved, 11 pending
            </dd>
          </div>
        </motion.div>
        
        {/* Main content area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-6"
        >
          {/* Left sidebar with category selection */}
          <div className="w-1/4">
            <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Categories</h2>
              </div>
              <div className="p-2">
                {dueDiligenceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 mr-3 ${
                      selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className={`h-1.5 rounded-full ${selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-600'}`}
                            style={{ width: `${category.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{category.progress}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all duration-300">
                  <span className="flex items-center">
                    <HiOutlineArrowUpTray className="w-5 h-5 mr-2" />
                    Upload Document
                  </span>
                  <HiOutlinePlusCircle className="w-5 h-5" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-all duration-300">
                  <span className="flex items-center">
                    <HiOutlineFolderPlus className="w-5 h-5 mr-2" />
                    Create Task
                  </span>
                  <HiOutlinePlusCircle className="w-5 h-5" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all duration-300">
                  <span className="flex items-center">
                    <HiOutlineCalendar className="w-5 h-5 mr-2" />
                    Schedule Meeting
                  </span>
                  <HiOutlinePlusCircle className="w-5 h-5" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-all duration-300">
                  <span className="flex items-center">
                    <HiOutlineExclamationTriangle className="w-5 h-5 mr-2" />
                    Flag Issue
                  </span>
                  <HiOutlinePlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right side - Tasks and details */}
          <div className="w-3/4 space-y-6">
            {/* Tasks for selected category */}
            {selectedCategoryData && (
              <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    {selectedCategoryData.icon}
                    <span className="ml-2">{selectedCategoryData.name} Tasks</span>
                  </h2>
                  <button 
                    className="bg-blue-500/20 text-blue-500 rounded-lg px-3 py-1.5 text-sm flex items-center transition-all duration-300 hover:bg-blue-500/30"
                    onClick={() => toggleTaskExpansion(selectedCategoryData.id)}
                  >
                    {expandedTasks[selectedCategoryData.id] ? (
                      <>
                        <HiOutlineChevronDown className="w-4 h-4 mr-1" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <HiOutlineChevronRight className="w-4 h-4 mr-1" />
                        Expand All
                      </>
                    )}
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {selectedCategoryData.tasks.map(task => (
                      <div 
                        key={task.id} 
                        className="bg-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-gray-800 font-medium flex items-center">
                              {task.name}
                              {task.status === 'in-progress' && (
                                <span className="ml-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                              )}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-gray-50 rounded-md text-xs text-gray-500">
                              {task.assignee}
                            </span>
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                        
                        <div className="flex mt-3 space-x-2">
                          <button className="text-sm text-blue-500 hover:text-blue-400 flex items-center transition-colors duration-300">
                            <HiOutlineEye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button className="text-sm text-green-500 hover:text-green-400 flex items-center transition-colors duration-300">
                            <HiOutlineCheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </button>
                          <button className="text-sm text-purple-500 hover:text-purple-400 flex items-center transition-colors duration-300">
                            <HiOutlinePaperClip className="w-4 h-4 mr-1" />
                            Attach
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom grid - Recent activity and Risk factors */}
            <div className="grid grid-cols-2 gap-6">
              {/* Recent activity */}
              <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    <HiOutlineClock className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Activity
                  </h2>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {recentActivity.map(activity => (
                      <li key={activity.id} className="flex items-start text-sm">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {activity.icon}
                        </div>
                        <div>
                          <div className="text-gray-800">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="text-blue-500">{activity.document}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{activity.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 text-center">
                    <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors duration-300">
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Risk factors */}
              <div className="glass-panel rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    <HiOutlineExclamationTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Risk Factors
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {riskFactors.map(risk => (
                      <div 
                        key={risk.id} 
                        className="bg-gray-100 rounded-xl p-4 transition-all duration-300 hover:bg-gray-200"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">{risk.category}:</span>
                            <h4 className="text-gray-800 font-medium">{risk.name}</h4>
                          </div>
                          <RiskSeverity severity={risk.severity} />
                        </div>
                        <p className="text-sm text-gray-500">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button className="text-sm text-gray-500 hover:text-gray-800 flex items-center transition-colors duration-300">
                      <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                      Risk Methodology
                    </button>
                    <button className="text-sm text-red-500 hover:text-red-400 flex items-center transition-colors duration-300">
                      <HiOutlinePlusCircle className="w-4 h-4 mr-1" />
                      Add Risk Factor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DueDiligencePage; 