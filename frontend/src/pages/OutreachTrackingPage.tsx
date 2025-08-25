import React, { useState } from 'react';
import { 
    HiOutlineChartBar, 
    HiOutlineEnvelope, 
    HiOutlineEnvelopeOpen, 
    HiOutlineChatBubbleLeftEllipsis,
    HiOutlineXCircle,
    HiOutlineCalendarDays,
    HiOutlineFunnel,
    HiOutlineArrowsUpDown,
    HiOutlineArrowTrendingUp,
    HiOutlineReceiptPercent,
    HiOutlineClock,
    HiOutlineSparkles,
    HiOutlineChevronDown,
    HiOutlineChevronUp
} from 'react-icons/hi2';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Legal Outreach Data for the Table
interface OutreachItem {
  id: string;
  recipient: string;
  company: string;
  subject: string;
  status: 'Sent' | 'Opened' | 'Replied' | 'Bounced';
  sentDate: Date;
  lastActivityDate: Date;
  openedDate?: Date;
  repliedDate?: Date;
  campaign: string;
  tags?: string[];
}

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const today = new Date();
const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

// Generate realistic legal outreach data for display purposes
const generateHighVolumeOutreachData = () => {
  // For display purposes, we'll show a smaller sample in the table
  // representing outreach to law firms and financial institutions
  const tableDisplayItems: OutreachItem[] = Array.from({ length: 15 }, (_, i) => {
    const sentDate = generateRandomDate(lastYear, today);
    let status: OutreachItem['status'] = 'Sent';
    let openedDate: Date | undefined = undefined;
    let repliedDate: Date | undefined = undefined;
    let lastActivityDate = sentDate;
    const randomStatus = Math.random();

    if (randomStatus > 0.1 && randomStatus <= 0.6) {
        status = 'Opened';
        openedDate = generateRandomDate(sentDate, today);
        lastActivityDate = openedDate;
        if (Math.random() < 0.25) {
             status = 'Replied';
             repliedDate = generateRandomDate(openedDate, today);
             lastActivityDate = repliedDate;
        }
    } else if (randomStatus <= 0.1) {
        status = 'Bounced';
        lastActivityDate = new Date(sentDate.getTime() + 60000);
    }

    const companies = ['Sterling & Associates', 'Blackstone Law Group', 'Summit Legal Partners', 'Wells Fargo Legal', 'Chase Mortgage Services', 'Pinnacle Law Firm', 'First National Bank', 'Apex Financial Legal'];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const campaigns = ['Q1 Foreclosure Optimization Campaign', 'Legal Services Outreach', 'Bank Partnership Initiative', 'Case Duration Reduction Program'];
    const tags = ['High Priority', 'Tier 1 Firm', 'Follow Up Needed', 'Initial Contact', 'Strategic Partner'];
    
    return {
        id: `${i + 1}`,
        recipient: `contact${i+1}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        company: company,
        subject: `Foreclosure Case Optimization Services for ${company}`,
        status: status as OutreachItem['status'],
        sentDate,
        openedDate,
        repliedDate,
        lastActivityDate,
        campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
        tags: Math.random() > 0.5 ? [tags[Math.floor(Math.random() * tags.length)]] : undefined,
    };
  }).sort((a, b) => b.lastActivityDate.getTime() - a.lastActivityDate.getTime());

  return tableDisplayItems;
};

const sampleOutreachData = generateHighVolumeOutreachData();

// Stats for legal outreach campaign (for display purposes only)
const highVolumeStats = {
  totalSent: 15843,
  totalOpened: 9782,
  totalReplied: 2847,
  totalBounced: 634,
  positiveReplies: 1423,
  avgOpenTime: '4.2 Hours'
};

// 2. Data for the Chart with upward trend (Last 12 Months)
interface MonthlyStats {
  month: string;
  Sent: number;
  Opened: number;
  Replied: number; // Cases reviewed
  Bounced: number;
}

const generateTrendingChartData = (): MonthlyStats[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let result: MonthlyStats[] = [];
  
  // Base value that gradually increases to show upward trend
  let baseSent = 800;
  const growthRate = 1.12; // 12% average growth

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12; // Start 11 months ago
    const year = monthIndex > currentMonth ? currentYear - 1 : currentYear;
    const monthName = `${months[monthIndex]} '${year.toString().slice(-2)}`;
    
    // Apply growth with random fluctuation
    const fluctuation = 0.9 + (Math.random() * 0.2); // Fluctuation between 90% and 110%
    const sentValue = Math.floor(baseSent * fluctuation);
    
    // Calculate other values as percentages of sent with slight fluctuations
    const openedRate = 0.5 + (Math.random() * 0.1); // 50-60% open rate
    const repliedRate = 0.15 + (Math.random() * 0.08); // 15-23% reply rate
    const bouncedRate = 0.03 + (Math.random() * 0.02); // 3-5% bounce rate
    
    const openedValue = Math.floor(sentValue * openedRate);
    const repliedValue = Math.floor(openedValue * repliedRate);
    const bouncedValue = Math.floor(sentValue * bouncedRate);
    
    result.push({
      month: monthName,
      Sent: sentValue,
      Opened: openedValue,
      Replied: repliedValue,
      Bounced: bouncedValue
    });
    
    // Increase base for next month (upward trend)
    baseSent = Math.floor(baseSent * growthRate);
  }
  
  return result;
};

const chartData = generateTrendingChartData();

// --- Helper Functions ---
const formatDate = (date?: Date): string => {
  if (!date) return '-';
  return date.toLocaleDateString('en-CA');
};

const getStatusPill = (status: OutreachItem['status']) => {
  let bgColor, textColor, icon;
  switch (status) {
    case 'Sent':    bgColor = 'bg-gray-700/50'; textColor = 'text-gray-300'; icon = <HiOutlineEnvelope className="w-3 h-3 mr-1.5"/>; break;
    case 'Opened':  bgColor = 'bg-green-800/60'; textColor = 'text-green-300'; icon = <HiOutlineEnvelopeOpen className="w-3 h-3 mr-1.5"/>; break;
    case 'Replied': bgColor = 'bg-blue-800/60'; textColor = 'text-blue-300'; icon = <HiOutlineChatBubbleLeftEllipsis className="w-3 h-3 mr-1.5"/>; break;
    case 'Bounced': bgColor = 'bg-red-800/60'; textColor = 'text-red-300'; icon = <HiOutlineXCircle className="w-3 h-3 mr-1.5"/>; break;
    default: return null;
  }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{icon}{status}</span>;
};

const formatPercentage = (value: number): string => {
    if (isNaN(value) || value === Infinity) return '0.0%';
    return `${value.toFixed(1)}%`;
}

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// --- Component --- 
const OutreachTrackingPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('Last Year');
  const [isEmailLogExpanded, setIsEmailLogExpanded] = useState(true);
  
  // Use the pre-defined high volume stats
  const { totalSent, totalOpened, totalReplied, totalBounced, positiveReplies, avgOpenTime } = highVolumeStats;
  
  const openRate = (totalOpened / (totalSent - totalBounced)) * 100;
  const replyRate = (totalReplied / totalOpened) * 100;
  const bounceRate = (totalBounced / totalSent) * 100;

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, rate?: number, rateIcon?: React.ReactNode, rateColor?: string) => (
     <motion.div 
       className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-primary/10 transition-all duration-300"
       whileHover={{ y: -5 }}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
     >
          <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-text-muted uppercase font-medium tracking-wider">{title}</p>
              <div className="p-2 rounded-lg bg-white/5">
                  {icon}
              </div>
          </div>
           <p className="text-3xl font-semibold text-text-primary mb-1">{typeof value === 'number' ? formatNumber(value) : value}</p>
           {rate !== undefined && (
              <div className={`flex items-center text-xs ${rateColor || 'text-green-400'}`}>
                 {rateIcon}
                 <span className="ml-1">{formatPercentage(rate)}</span>
                 <span className="text-text-muted ml-1"> {title === 'Emails Opened' ? 'Open Rate' : title === 'Cases Reviewed' ? 'Review Rate' : 'Bounce Rate'}</span> 
              </div>
           )}
      </motion.div>
  );

  return (
    <div className="p-6 md:p-8 bg-background-primary min-h-full">
      <motion.div 
        className="flex flex-wrap justify-between items-center mb-10 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
         <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Legal Outreach Performance</h1>
          <div className="relative">
             <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)} 
                className="appearance-none glass-panel rounded-lg pl-4 pr-10 py-2.5 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/70 border border-white/10 shadow-inner shadow-black/20"
             >
                <option className="bg-background-secondary text-text-primary">Last Year</option>
                <option className="bg-background-secondary text-text-primary">Last 6 Months</option> 
                <option className="bg-background-secondary text-text-primary">Last 30 Days</option>
             </select>
             <HiOutlineCalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" /> 
          </div>
      </motion.div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {renderStatCard('Firms Contacted', totalSent, <HiOutlineEnvelope className="w-5 h-5 text-blue-400" />)}
        {renderStatCard('Emails Opened', totalOpened, <HiOutlineEnvelopeOpen className="w-5 h-5 text-green-400" />, openRate, <HiOutlineArrowTrendingUp className="w-3.5 h-3.5"/>, 'text-green-400')}
        {renderStatCard('Cases Reviewed', totalReplied, <HiOutlineChatBubbleLeftEllipsis className="w-5 h-5 text-cyan-400" />, replyRate, <HiOutlineArrowTrendingUp className="w-3.5 h-3.5"/>, 'text-cyan-400')}
        {renderStatCard('Failed Deliveries', totalBounced, <HiOutlineXCircle className="w-5 h-5 text-red-500" />, bounceRate, <HiOutlineArrowTrendingUp className="w-3.5 h-3.5"/>, 'text-red-500')}
        {renderStatCard('Interested Firms', positiveReplies, <HiOutlineSparkles className="w-5 h-5 text-yellow-400" />, (positiveReplies/totalReplied)*100 || 0, <HiOutlineReceiptPercent className="w-3.5 h-3.5"/>, 'text-yellow-400')}
        {renderStatCard('Avg. Response Time', avgOpenTime, <HiOutlineClock className="w-5 h-5 text-purple-400" />)} 
      </div>

      <motion.div 
        className="glass-panel rounded-xl p-6 shadow-lg shadow-black/30 border border-white/10 mb-10 backdrop-blur-md hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
          <HiOutlineChartBar className="w-5 h-5 mr-2 text-blue-400" />
          Legal Outreach Performance Over Time
        </h2>
         <ResponsiveContainer width="100%" height={400}> 
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
                 <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/> 
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05}/>
                </linearGradient>
                 <linearGradient id="colorBounced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.7}/> 
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#A3A3A3' }}
                axisLine={false} 
                tickLine={false} 
                dy={10}
            />
            <YAxis 
                tick={{ fontSize: 12, fill: '#A3A3A3' }} 
                axisLine={false} 
                tickLine={false} 
                width={40}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', 
                    padding: '12px 16px'
                }} 
                labelStyle={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}
                itemStyle={{ color: '#E0E0E0', fontSize: '12px', paddingTop: '4px', paddingBottom: '4px' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.08)' }}
                formatter={(value: number) => formatNumber(value)}
            />
            <Legend 
                verticalAlign="top" 
                align="right"
                height={40} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: '#B3B3B3', fontSize: '12px', paddingBottom: '20px' }}
            />
            <Area type="monotone" dataKey="Bounced" stackId="1" stroke="#EF4444" fill="url(#colorBounced)" strokeWidth={2} name="Failed" />
            <Area type="monotone" dataKey="Replied" stackId="1" stroke="#06B6D4" fill="url(#colorReplied)" strokeWidth={2} name="Reviewed" />
            <Area type="monotone" dataKey="Opened" stackId="1" stroke="#10B981" fill="url(#colorOpened)" strokeWidth={2} name="Opened" /> 
            <Area type="monotone" dataKey="Sent" stackId="1" stroke="#3B82F6" fill="url(#colorSent)" strokeWidth={2} name="Contacted" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div 
        className="glass-panel rounded-xl shadow-lg shadow-black/30 border border-white/10 overflow-hidden backdrop-blur-md hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
          <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b border-white/10">
             <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <HiOutlineEnvelope className="w-5 h-5 mr-2 text-blue-400" />
                Legal Outreach Communication Log
             </h2>
             <div className="flex items-center gap-3">
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-sm transition-colors duration-200"
                    onClick={() => setIsEmailLogExpanded(!isEmailLogExpanded)}
                  >
                      {isEmailLogExpanded 
                        ? <HiOutlineChevronUp className="w-4 h-4"/> 
                        : <HiOutlineChevronDown className="w-4 h-4"/>
                      }
                      <span>{isEmailLogExpanded ? 'Collapse' : 'Expand'}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-sm transition-colors duration-200">
                      <HiOutlineFunnel className="w-4 h-4"/>
                      <span>Filters</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-sm transition-colors duration-200">
                      <HiOutlineArrowsUpDown className="w-4 h-4"/>
                      <span>Sort By</span>
                  </button>
             </div>
          </div>

          <AnimatePresence>
            {isEmailLogExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto"
              >
                <table className="min-w-full bg-transparent border-collapse">
                  <thead>
                    <tr className="border-b border-white/15">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Contact</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Law Firm / Institution</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Campaign</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Last Activity</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Sent Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleOutreachData.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors duration-150 group">
                        <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.recipient}</div>
                            {item.tags && (
                              <div className="text-xs text-accent-secondary mt-0.5">{item.tags.join(', ')}</div>
                            )} 
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-text-muted group-hover:text-text-secondary transition-colors">{item.company}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-text-muted group-hover:text-text-secondary transition-colors">{item.campaign}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                            {getStatusPill(item.status)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-text-muted group-hover:text-text-secondary transition-colors">{formatDate(item.lastActivityDate)}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-text-muted group-hover:text-text-secondary transition-colors">{formatDate(item.sentDate)}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-text-muted">
                          <button className="p-1.5 rounded text-accent-primary/70 hover:text-accent-primary hover:bg-white/10 transition-all mr-2" title="View Email">
                            <HiOutlineEnvelopeOpen className="w-4 h-4" />
                          </button>
                          {item.status === 'Replied' && (
                            <button className="p-1.5 rounded text-accent-secondary/70 hover:text-accent-secondary hover:bg-white/10 transition-all" title="View Case Details">
                              <HiOutlineChatBubbleLeftEllipsis className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OutreachTrackingPage; 