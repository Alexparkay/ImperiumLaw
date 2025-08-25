import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineFlag, 
  HiOutlineChartBar, 
  HiOutlineClock, 
  HiOutlineCheck, 
  HiOutlineStar,
  HiOutlineExclamationTriangle,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineArrowSmallRight,
  HiOutlineArrowPath,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineEllipsisVertical
} from 'react-icons/hi2';

// Mock data for goals
const mockGoals = [
  {
    id: 1,
    title: "Increase conversion rate",
    description: "Improve website conversion rate from 2.3% to 3.5%",
    category: "Marketing",
    progress: 65,
    dueDate: "2024-09-15",
    priority: "High",
    status: "In Progress"
  },
  {
    id: 2,
    title: "Reduce customer acquisition cost",
    description: "Lower CAC from $52 to $38 per customer",
    category: "Finance",
    progress: 40,
    dueDate: "2024-08-30",
    priority: "High",
    status: "In Progress"
  },
  {
    id: 3,
    title: "Expand to new market",
    description: "Launch products in European market",
    category: "Growth",
    progress: 20,
    dueDate: "2024-12-01",
    priority: "Medium",
    status: "Planning"
  },
  {
    id: 4,
    title: "Implement CRM integration",
    description: "Connect our platform with Salesforce CRM",
    category: "Technology",
    progress: 90,
    dueDate: "2024-07-20",
    priority: "Medium",
    status: "Almost Complete"
  },
  {
    id: 5,
    title: "Achieve ISO 27001 certification",
    description: "Complete security audit and certification process",
    category: "Compliance",
    progress: 10,
    dueDate: "2024-11-15",
    priority: "Low",
    status: "Planning"
  }
];

// Recent updates for the activity feed
const recentUpdates = [
  { id: 1, goalId: 1, message: "Conversion rate reached 3.1%", timestamp: "2 hours ago", user: "Alex Chen", type: "milestone" },
  { id: 2, goalId: 4, message: "API integration phase completed", timestamp: "Yesterday", user: "Sofia Martinez", type: "update" },
  { id: 3, goalId: 2, message: "New attribution model implemented", timestamp: "2 days ago", user: "Marcus Johnson", type: "update" },
  { id: 4, goalId: 3, message: "Market research phase started", timestamp: "3 days ago", user: "Emma Wilson", type: "started" },
  { id: 5, goalId: 5, message: "Security assessment scheduled", timestamp: "1 week ago", user: "Ryan Thompson", type: "update" },
];

// Get the icon for the goal category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Marketing':
      return <HiOutlineChartBar className="w-5 h-5 text-blue-500" />;
    case 'Finance':
      return <HiOutlineStar className="w-5 h-5 text-amber-500" />;
    case 'Growth':
      return <HiOutlineFlag className="w-5 h-5 text-green-500" />;
    case 'Technology':
      return <HiOutlineCog className="w-5 h-5 text-purple-500" />;
    case 'Compliance':
      return <HiOutlineCheck className="w-5 h-5 text-indigo-500" />;
    default:
      return <HiOutlineFlag className="w-5 h-5 text-blue-500" />;
  }
};

// Get the background color for the progress bar based on progress
const getProgressColor = (progress: number, status: string) => {
  if (status === 'Completed') return 'bg-green-500';
  if (progress < 25) return 'bg-red-500';
  if (progress < 50) return 'bg-amber-500';
  if (progress < 75) return 'bg-blue-500';
  return 'bg-green-500';
};

// Get the icon for the update type
const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'milestone':
      return <div className="p-2 rounded-full bg-green-100"><HiOutlineCheck className="w-4 h-4 text-green-600" /></div>;
    case 'update':
      return <div className="p-2 rounded-full bg-blue-100"><HiOutlineArrowPath className="w-4 h-4 text-blue-600" /></div>;
    case 'started':
      return <div className="p-2 rounded-full bg-purple-100"><HiOutlinePlusCircle className="w-4 h-4 text-purple-600" /></div>;
    default:
      return <div className="p-2 rounded-full bg-gray-100"><HiOutlineFlag className="w-4 h-4 text-gray-600" /></div>;
  }
};

// Goal Card Component
const GoalCard = ({ goal, index }: { goal: any; index: number }) => {
  const progressColor = getProgressColor(goal.progress, goal.status);
  const daysRemaining = Math.ceil(
    (new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return (
    <motion.div 
      className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(goal.category)}
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {goal.category}
            </span>
          </div>
          <div className="flex items-center">
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              goal.priority === 'High' ? 'bg-red-100 text-red-800' : 
              goal.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {goal.priority}
            </div>
            <button className="ml-2 text-gray-400 hover:text-gray-700">
              <HiOutlineEllipsisVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">{goal.progress}% Complete</span>
            <span className="text-xs font-medium text-gray-500">{goal.status}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${progressColor} h-2 rounded-full`} 
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <HiOutlineCalendar className="w-4 h-4 mr-1 text-gray-500" />
            <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
          </div>
          
          <div className={`flex items-center text-sm ${
            daysRemaining < 7 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <HiOutlineClock className="w-4 h-4 mr-1" />
            <span>{daysRemaining} days left</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Goals = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Calculate goal statistics
  const totalGoals = mockGoals.length;
  const completedGoals = mockGoals.filter(goal => goal.status === 'Completed').length;
  const inProgressGoals = mockGoals.filter(goal => goal.status === 'In Progress').length;
  const planningGoals = mockGoals.filter(goal => goal.status === 'Planning').length;
  
  // Calculate average progress
  const averageProgress = Math.round(
    mockGoals.reduce((acc, goal) => acc + goal.progress, 0) / totalGoals
  );
  
  // Filter goals based on the active filter
  const filteredGoals = activeFilter === 'all' 
    ? mockGoals 
    : mockGoals.filter(goal => goal.status.toLowerCase().includes(activeFilter.toLowerCase()));
  
  return (
    <div className="goals-page w-full p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Goals & Objectives</h1>
        <p className="text-base text-text-muted">Track your business goals and measure progress toward key objectives.</p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Goals */}
        <motion.div 
          className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <HiOutlineFlag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Goals</h3>
              <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Progress */}
        <motion.div 
          className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <HiOutlineChartBar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Average Progress</h3>
              <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
            </div>
          </div>
        </motion.div>
        
        {/* In Progress */}
        <motion.div 
          className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100">
              <HiOutlineClock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-gray-900">{inProgressGoals}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Completed */}
        <motion.div 
          className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-100">
              <HiOutlineCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-2">
          <div className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">Current Goals</h2>
              <div className="flex items-center">
                <select 
                  className="text-sm border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Goals</option>
                  <option value="progress">In Progress</option>
                  <option value="planning">Planning</option>
                  <option value="complete">Completed</option>
                </select>
                <button className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 flex items-center">
                  <HiOutlinePlusCircle className="w-4 h-4 mr-1" />
                  New Goal
                </button>
              </div>
            </div>
            <div className="space-y-5">
              {filteredGoals.map((goal, index) => (
                <GoalCard key={goal.id} goal={goal} index={index} />
              ))}
              {filteredGoals.length === 0 && (
                <div className="text-center py-8">
                  <HiOutlineExclamationTriangle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No goals found with the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          {/* Recent Activity */}
          <motion.div 
            className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 flex items-center">
                <HiOutlineClock className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </h2>
            </div>
            <div className="p-5">
              <ul className="space-y-4">
                {recentUpdates.map(update => (
                  <li key={update.id} className="flex items-start text-sm">
                    <div className="flex-shrink-0 mr-3">
                      {getUpdateIcon(update.type)}
                    </div>
                    <div>
                      <div className="text-gray-800">
                        <span className="font-medium">{update.user}</span>: {update.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{update.timestamp}</div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center mx-auto">
                  View All Activity
                  <HiOutlineArrowSmallRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Goal Categories */}
          <motion.div 
            className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 flex items-center">
                <HiOutlineStar className="w-5 h-5 mr-2 text-amber-500" />
                Goal Categories
              </h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiOutlineChartBar className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-gray-700">Marketing</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    1
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiOutlineStar className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="text-gray-700">Finance</span>
                  </div>
                  <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    1
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiOutlineFlag className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-gray-700">Growth</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    1
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiOutlineCog className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-gray-700">Technology</span>
                  </div>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    1
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiOutlineCheck className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="text-gray-700">Compliance</span>
                  </div>
                  <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    1
                  </span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                  <HiOutlinePlusCircle className="w-4 h-4 mr-1" />
                  Add Category
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Goals; 