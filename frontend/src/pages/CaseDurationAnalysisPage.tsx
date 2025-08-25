import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';
import {
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineCurrencyDollar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineScale,
  HiOutlineChartPie,
  HiOutlineUsers,
  HiOutlineMapPin,
  HiOutlineInformationCircle,
  HiOutlineArrowPath,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCalendar,
  HiOutlineArrowsUpDown,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineExclamationTriangle,
  HiOutlineChevronDown,
  HiOutlineFunnel,
  HiOutlineMap,
  HiOutlineClock,
  HiOutlineDocument,
  HiOutlineArrowDown,
  HiOutlineSquares2X2,
  HiOutlineArrowsUpDown as HiOutlineArrowsExpand,
  HiOutlineAdjustmentsVertical as HiOutlineFilter,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap } from 'recharts';

// Mock data for industries
const industryAnalysisData = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Analysis of manufacturing industry segments including electronics, automotive, and general manufacturing.',
    totalCompanies: 1458,
    averageMultiple: 5.7,
    growthRate: 3.8,
    marketSize: '$287B',
    segments: [
      { name: 'Electronics', percentage: 32, growth: 5.2, companies: 467, trend: 'up' },
      { name: 'Automotive', percentage: 28, growth: 2.1, companies: 408, trend: 'stable' },
      { name: 'Industrial', percentage: 25, growth: 3.8, companies: 365, trend: 'up' },
      { name: 'Consumer Goods', percentage: 15, growth: 4.2, companies: 218, trend: 'up' }
    ],
    topMarkets: [
      { region: 'Midwest', percentage: 35 },
      { region: 'Northeast', percentage: 25 },
      { region: 'West', percentage: 20 },
      { region: 'South', percentage: 15 },
      { region: 'International', percentage: 5 }
    ],
    metrics: {
      medianRevenue: '$4.2M',
      medianEbitda: '$840K',
      medianEmployees: 42,
      medianAskingPrice: '$5.1M'
    },
    trends: [
      { name: 'Automation Integration', impact: 'High', description: 'Increasing adoption of automation and robotics in manufacturing processes.' },
      { name: 'Supply Chain Restructuring', impact: 'Medium', description: 'Companies diversifying suppliers and reshoring operations.' },
      { name: 'Sustainable Manufacturing', impact: 'Medium', description: 'Growing focus on environmentally sustainable practices and certifications.' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Analysis of technology industry segments including software, IT services, and hardware.',
    totalCompanies: 2134,
    averageMultiple: 8.2,
    growthRate: 7.5,
    marketSize: '$412B',
    segments: [
      { name: 'Software', percentage: 45, growth: 9.8, companies: 960, trend: 'up' },
      { name: 'IT Services', percentage: 30, growth: 6.5, companies: 640, trend: 'up' },
      { name: 'Hardware', percentage: 15, growth: 3.2, companies: 320, trend: 'stable' },
      { name: 'Telecommunications', percentage: 10, growth: 4.1, companies: 214, trend: 'stable' }
    ],
    topMarkets: [
      { region: 'West', percentage: 45 },
      { region: 'Northeast', percentage: 25 },
      { region: 'South', percentage: 15 },
      { region: 'Midwest', percentage: 10 },
      { region: 'International', percentage: 5 }
    ],
    metrics: {
      medianRevenue: '$3.8M',
      medianEbitda: '$950K',
      medianEmployees: 28,
      medianAskingPrice: '$7.8M'
    },
    trends: [
      { name: 'AI Integration', impact: 'High', description: 'Accelerating adoption of AI and machine learning across applications.' },
      { name: 'Cloud Migration', impact: 'High', description: 'Continued shift to cloud-based services and infrastructure.' },
      { name: 'Cybersecurity Focus', impact: 'High', description: 'Increasing investment in security solutions and compliance.' }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Analysis of healthcare industry segments including services, technology, and supplies.',
    totalCompanies: 1876,
    averageMultiple: 6.8,
    growthRate: 5.2,
    marketSize: '$328B',
    segments: [
      { name: 'Services', percentage: 40, growth: 4.8, companies: 750, trend: 'up' },
      { name: 'Technology', percentage: 25, growth: 8.5, companies: 469, trend: 'up' },
      { name: 'Medical Supplies', percentage: 20, growth: 3.2, companies: 375, trend: 'stable' },
      { name: 'Pharmaceuticals', percentage: 15, growth: 4.5, companies: 282, trend: 'up' }
    ],
    topMarkets: [
      { region: 'Northeast', percentage: 30 },
      { region: 'West', percentage: 25 },
      { region: 'South', percentage: 25 },
      { region: 'Midwest', percentage: 15 },
      { region: 'International', percentage: 5 }
    ],
    metrics: {
      medianRevenue: '$5.1M',
      medianEbitda: '$920K',
      medianEmployees: 48,
      medianAskingPrice: '$6.2M'
    },
    trends: [
      { name: 'Telehealth Expansion', impact: 'High', description: 'Continued growth of remote healthcare services and platforms.' },
      { name: 'Value-Based Care', impact: 'Medium', description: 'Shift from fee-for-service to outcome-based payment models.' },
      { name: 'Healthcare Data Analytics', impact: 'High', description: 'Increased use of data for operational efficiency and patient care.' }
    ]
  }
];

// Component for trend impact indicator
const ImpactIndicator = ({ impact }: { impact: string }) => {
  let bgColor = '';
  let textColor = '';

  switch (impact.toLowerCase()) {
    case 'high':
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-500';
      break;
    case 'medium':
      bgColor = 'bg-amber-500/20';
      textColor = 'text-amber-500';
      break;
    case 'low':
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
      break;
    default:
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {impact}
    </span>
  );
};

// Component for trend indicator
const TrendIndicator = ({ trend }: { trend: string }) => {
  switch (trend.toLowerCase()) {
    case 'up':
      return <HiOutlineArrowTrendingUp className="text-green-500 ml-1" />;
    case 'down':
      return <HiOutlineArrowTrendingDown className="text-red-500 ml-1" />;
    case 'stable':
    default:
      return <span className="inline-block w-4 h-0.5 bg-amber-500 ml-1"></span>;
  }
};

// Fix the issue with industry data type
type MarketTrendsDataType = {
  year: string;
  technology: number;
  healthcare: number;
  manufacturing: number;
  retail: number;
  finance: number;
  [key: string]: string | number; // Add index signature
};

// Mock data for market trends
const marketTrendsData: MarketTrendsDataType[] = [
  { year: '2018', technology: 4.5, healthcare: 3.2, manufacturing: 2.8, retail: 2.1, finance: 3.8 },
  { year: '2019', technology: 5.2, healthcare: 3.5, manufacturing: 2.5, retail: 1.9, finance: 4.0 },
  { year: '2020', technology: 6.8, healthcare: 4.1, manufacturing: 1.9, retail: 1.2, finance: 3.5 },
  { year: '2021', technology: 8.5, healthcare: 4.8, manufacturing: 2.7, retail: 1.8, finance: 4.3 },
  { year: '2022', technology: 9.2, healthcare: 5.3, manufacturing: 3.1, retail: 2.3, finance: 4.6 },
  { year: '2023', technology: 10.1, healthcare: 5.7, manufacturing: 3.4, retail: 2.5, finance: 4.9 },
  { year: '2024', technology: 11.5, healthcare: 6.4, manufacturing: 3.9, retail: 2.9, finance: 5.3 },
];

// Mock data for market segments
const marketSegmentsData = [
  { name: 'Enterprise', value: 45 },
  { name: 'Mid-Market', value: 30 },
  { name: 'Small Business', value: 15 },
  { name: 'Consumer', value: 10 },
];

// Mock data for competitive landscape
const competitiveLandscapeData = [
  { name: 'Company A', marketShare: 24, growth: 28, revenue: 850 },
  { name: 'Company B', marketShare: 19, growth: 15, revenue: 650 },
  { name: 'Company C', marketShare: 15, growth: 32, revenue: 450 },
  { name: 'Company D', marketShare: 12, growth: 8, revenue: 380 },
  { name: 'Company E', marketShare: 9, growth: 22, revenue: 320 },
  { name: 'Company F', marketShare: 7, growth: 18, revenue: 240 },
  { name: 'Company G', marketShare: 5, growth: 5, revenue: 190 },
  { name: 'Others', marketShare: 9, growth: 12, revenue: 350 },
];

// Mock data for regional distribution
const regionalDistributionData = [
  { name: 'North America', value: 42 },
  { name: 'Europe', value: 28 },
  { name: 'Asia Pacific', value: 18 },
  { name: 'Latin America', value: 8 },
  { name: 'Middle East & Africa', value: 4 },
];

// Mock data for growth by segment
const growthBySegmentData = [
  { segment: 'SaaS', cagr: 18.6 },
  { segment: 'Cloud Infrastructure', cagr: 15.7 },
  { segment: 'Cybersecurity', cagr: 14.5 },
  { segment: 'AI/ML', cagr: 38.2 },
  { segment: 'IoT', cagr: 16.7 },
  { segment: 'Big Data', cagr: 13.2 },
  { segment: 'DevOps', cagr: 21.3 },
];

// Mock data for key market drivers
const keyMarketDriversData = [
  { name: 'Digital Transformation', score: 95 },
  { name: 'Remote Work', score: 87 },
  { name: 'Data Security', score: 85 },
  { name: 'Cloud Migration', score: 90 },
  { name: 'AI Adoption', score: 92 },
  { name: 'Cost Reduction', score: 70 },
  { name: 'Customer Experience', score: 88 },
];

// Mock data for technology maturity
const technologyMaturityData = [
  { subject: 'Innovation', A: 90, B: 65, fullMark: 100 },
  { subject: 'Market Adoption', A: 75, B: 85, fullMark: 100 },
  { subject: 'Competitive Edge', A: 85, B: 70, fullMark: 100 },
  { subject: 'Profitability', A: 65, B: 80, fullMark: 100 },
  { subject: 'Scalability', A: 95, B: 75, fullMark: 100 },
  { subject: 'Regulatory Impact', A: 70, B: 60, fullMark: 100 },
];

// Colors for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const MarketAnalysisPage = () => {
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useLayout();
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [timeframe, setTimeframe] = useState('5 Years');
  const [selectedRegion, setSelectedRegion] = useState('Global');
  
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
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">Market Analysis</h1>
          <p className="text-gray-600">
            Explore and evaluate market trends and opportunities.
          </p>
        </motion.div>
        
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
            <HiOutlineGlobeAlt className="h-5 w-5 mr-2 text-blue-500" />
            <select 
              className="bg-transparent text-gray-800 focus:outline-none"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="All Industries" className="bg-white">All Industries</option>
              <option value="Technology" className="bg-white">Technology</option>
              <option value="Healthcare" className="bg-white">Healthcare</option>
              <option value="Manufacturing" className="bg-white">Manufacturing</option>
              <option value="Retail" className="bg-white">Retail</option>
              <option value="Finance" className="bg-white">Finance</option>
            </select>
          </div>
          
          <div className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
            <HiOutlineMap className="h-5 w-5 mr-2 text-purple-500" />
            <select 
              className="bg-transparent text-gray-800 focus:outline-none"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="Global" className="bg-white">Global</option>
              <option value="North America" className="bg-white">North America</option>
              <option value="Europe" className="bg-white">Europe</option>
              <option value="Asia Pacific" className="bg-white">Asia Pacific</option>
              <option value="Latin America" className="bg-white">Latin America</option>
              <option value="Middle East & Africa" className="bg-white">Middle East & Africa</option>
            </select>
          </div>
          
          <div className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50">
            <HiOutlineClock className="h-5 w-5 mr-2 text-amber-500" />
            <select 
              className="bg-transparent text-gray-800 focus:outline-none"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="1 Year" className="bg-white">1 Year</option>
              <option value="3 Years" className="bg-white">3 Years</option>
              <option value="5 Years" className="bg-white">5 Years</option>
              <option value="10 Years" className="bg-white">10 Years</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <button className="glass-panel flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 hover:bg-gray-100/70 transition-all">
              <HiOutlineDocument className="h-5 w-5 mr-2 text-blue-500" />
              Export Report
            </button>
          </div>
        </motion.div>
        
        {/* Market Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Market Growth Trends</h2>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineInformationCircle className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineFilter className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineArrowsExpand className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={marketTrendsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  {Object.keys(marketTrendsData[0])
                    .filter(key => key !== 'year')
                    .map((key, index) => (
                      <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1}/>
                      </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="year" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '0.5rem',
                    color: '#333' 
                  }} 
                />
                <Legend wrapperStyle={{ color: '#666666' }} />
                {Object.keys(marketTrendsData[0])
                  .filter(key => key !== 'year')
                  .map((key, index) => (
                    <Area 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      fillOpacity={1} 
                      fill={`url(#color${key})`} 
                      activeDot={{ r: 6 }}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {Object.keys(marketTrendsData[0])
              .filter(key => key !== 'year')
              .map((industry, index) => {
                // Get the current and previous values safely using type assertion
                const currentValue = Number(marketTrendsData[marketTrendsData.length-1][industry]);
                const previousValue = Number(marketTrendsData[marketTrendsData.length-2][industry]);
                const difference = currentValue - previousValue;
                
                return (
                  <div key={industry} className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">{industry.charAt(0).toUpperCase() + industry.slice(1)}</div>
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                    </div>
                    <div className="text-lg font-medium mt-1 text-gray-800">{currentValue}%</div>
                    <div className="text-xs text-green-500 mt-0.5">
                      +{difference.toFixed(1)}% YoY
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
        
        {/* 2x2 Grid of market visualization components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Market Segments */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Market Segments</h2>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineInformationCircle className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineArrowsExpand className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketSegmentsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {marketSegmentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Market Share']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderRadius: '0.5rem',
                      color: '#333' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {marketSegmentsData.map((segment, index) => (
                <div key={segment.name} className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="text-sm">{segment.name} <span className="text-gray-500">{segment.value}%</span></div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Regional Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Regional Distribution</h2>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineInformationCircle className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineArrowsExpand className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={regionalDistributionData}
                  dataKey="value"
                  aspectRatio={4 / 3}
                  stroke="#ccc"
                  fill="#8884d8"
                  nameKey="name"
                >
                  {regionalDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Growth by Segment */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Growth by Segment (CAGR)</h2>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineInformationCircle className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineArrowsExpand className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthBySegmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#666666" />
                  <YAxis dataKey="segment" type="category" stroke="#666666" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'CAGR']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderRadius: '0.5rem',
                      color: '#333' 
                    }}
                  />
                  <Bar dataKey="cagr" radius={[0, 5, 5, 0]}>
                    {growthBySegmentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cagr > 25 ? COLORS[0] : entry.cagr > 15 ? COLORS[2] : COLORS[4]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Technology Maturity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Technology Maturity Comparison</h2>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineInformationCircle className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                  <HiOutlineArrowsExpand className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={technologyMaturityData}>
                  <PolarGrid stroke="rgba(0,0,0,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#666666' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666666' }} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke={COLORS[0]}
                    fill={COLORS[0]}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Emerging"
                    dataKey="B"
                    stroke={COLORS[2]}
                    fill={COLORS[2]}
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ color: '#666666' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderRadius: '0.5rem',
                      color: '#333' 
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        
        {/* Competitive Landscape */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Competitive Landscape</h2>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineInformationCircle className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineFilter className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineArrowsExpand className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-[350px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  type="number" 
                  dataKey="marketShare" 
                  name="Market Share" 
                  unit="%" 
                  stroke="#666666"
                  label={{ value: 'Market Share (%)', position: 'insideBottom', offset: -5, fill: '#666666' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="growth" 
                  name="Growth" 
                  unit="%" 
                  stroke="#666666"
                  label={{ value: 'Annual Growth (%)', angle: -90, position: 'insideLeft', offset: 10, fill: '#666666' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="revenue" 
                  range={[50, 400]} 
                  name="Revenue" 
                  unit="M"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '0.5rem',
                    color: '#333' 
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'Growth') return [`${value}%`, name];
                    if (name === 'Market Share') return [`${value}%`, name];
                    if (name === 'Revenue') return [`$${value}M`, name];
                    return [value, name];
                  }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Legend wrapperStyle={{ color: '#666666' }} />
                <Scatter 
                  name="Companies" 
                  data={competitiveLandscapeData} 
                  fill="#8884d8"
                  shape="circle"
                >
                  {competitiveLandscapeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-auto glass-panel border border-gray-200 bg-gray-50/50 shadow-lg shadow-gray-200/50 backdrop-blur-md rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Market Share</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Annual Growth</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {competitiveLandscapeData.map((company, index) => (
                  <tr key={company.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-gray-800">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right whitespace-nowrap text-gray-800">{company.marketShare}%</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`text-sm ${company.growth > 20 ? 'text-green-500' : company.growth > 10 ? 'text-amber-500' : 'text-gray-500'}`}>
                        {company.growth}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right whitespace-nowrap text-gray-800">${company.revenue}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Market Drivers & Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="glass-panel border border-gray-200 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Key Market Drivers & Insights</h2>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineInformationCircle className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-blue-500">
                <HiOutlineDocumentText className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Impact Factors</h3>
                <div className="space-y-3">
                  {keyMarketDriversData.map((driver) => (
                    <div key={driver.name} className="bg-gray-100 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">{driver.name}</div>
                        <div className={`text-sm font-medium ${driver.score >= 90 ? 'text-green-500' : driver.score >= 80 ? 'text-blue-500' : driver.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                          {driver.score}/100
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${driver.score >= 90 ? 'bg-green-500' : driver.score >= 80 ? 'bg-blue-500' : driver.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${driver.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-3">Strategic Insights</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="glass-panel border border-gray-200 bg-gray-100/50 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg mr-3">
                      <HiOutlineLightBulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Market Consolidation Opportunity</h4>
                      <p className="text-gray-500 text-sm">
                        The {selectedIndustry === 'All Industries' ? 'technology' : selectedIndustry.toLowerCase()} sector is showing signs of consolidation with smaller players struggling to maintain growth. This creates acquisition opportunities for companies looking to expand market share and technology capabilities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-panel border border-gray-200 bg-gray-100/50 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 text-purple-500 p-2 rounded-lg mr-3">
                      <HiOutlineTrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Emerging Growth Segments</h4>
                      <p className="text-gray-500 text-sm">
                        AI/ML applications are showing the highest growth potential at 38.2% CAGR, followed by DevOps at 21.3%. Companies in these segments are prime targets for acquisition as they offer strong growth potential and technological advantages.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-panel border border-gray-200 bg-gray-100/50 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="bg-amber-500/20 text-amber-500 p-2 rounded-lg mr-3">
                      <HiOutlineExclamationCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Regional Expansion Consideration</h4>
                      <p className="text-gray-500 text-sm">
                        While North America dominates with 42% market share, Asia Pacific shows the highest growth rate. Consider acquisition targets in this region to establish presence in this rapidly developing market and leverage cost advantages.
                      </p>
                    </div>
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

// Fix TypeScript errors in custom icon components by adding proper types
const HiOutlineLightBulb = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

const HiOutlineTrendingUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const HiOutlineExclamationCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

export default MarketAnalysisPage; 