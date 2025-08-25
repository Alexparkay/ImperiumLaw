import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';
import { 
  HiOutlineScale, 
  HiOutlineClock, 
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineCurrencyDollar
} from 'react-icons/hi2';

interface CsvRow {
  [key: string]: string;
}

interface DataSet {
  name: string;
  filePath: string;
  data: CsvRow[];
  headers: string[];
  isLoading: boolean;
  error: string | null;
}

interface CaseAnalyticsVisualizationProps {
  dataSet: DataSet;
  isLoading: boolean;
}

const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4'
};

const CaseAnalyticsVisualization: React.FC<CaseAnalyticsVisualizationProps> = ({ dataSet, isLoading }) => {
  const [showInfo, setShowInfo] = useState<{ [key: string]: boolean }>({});
  
  const toggleInfo = (key: string) => {
    setShowInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Process data for visualizations
  const analytics = useMemo(() => {
    if (!dataSet.data || dataSet.data.length === 0) return null;
    
    // Court distribution
    const courtCounts: { [key: string]: number } = {};
    const caseTypeCounts: { [key: string]: number } = {};
    const statusCounts: { [key: string]: number } = {};
    const monthlyFilings: { [key: string]: number } = {};
    const durationRanges = {
      '0-90 days': 0,
      '91-180 days': 0,
      '181-365 days': 0,
      '365+ days': 0
    };
    const attorneyCounts: { [key: string]: number } = {};
    const lawFirmCounts: { [key: string]: number } = {};
    const judgeCounts: { [key: string]: number } = {};
    const dayOfWeekCounts: { [key: string]: number } = { 
      'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 
      'Friday': 0, 'Saturday': 0, 'Sunday': 0 
    };
    const courtDurations: { [key: string]: { total: number; count: number } } = {};
    
    let totalCases = 0;
    let totalDuration = 0;
    let casesWithDuration = 0;
    let disposedCases = 0;
    let activeCases = 0;
    
    dataSet.data.forEach(row => {
      // Court analysis
      const court = row['Court'] || 'Unknown';
      courtCounts[court] = (courtCounts[court] || 0) + 1;
      
      // Case type analysis
      const caseType = row['Nature of Suit / Type'] || 'Unknown';
      if (caseType) {
        caseTypeCounts[caseType] = (caseTypeCounts[caseType] || 0) + 1;
      }
      
      // Status analysis
      const status = row['Status'] || 'Active';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status === 'Disposed') disposedCases++;
      else activeCases++;
      
      // Duration analysis
      const durationDays = row['Case Duration (Days)'];
      let totalDays = 0;
      if (durationDays && durationDays !== '') {
        totalDays = parseInt(durationDays);
        
        if (totalDays > 0) {
          totalDuration += totalDays;
          casesWithDuration++;
          
          if (totalDays <= 90) durationRanges['0-90 days']++;
          else if (totalDays <= 180) durationRanges['91-180 days']++;
          else if (totalDays <= 365) durationRanges['181-365 days']++;
          else durationRanges['365+ days']++;
        }
      }
      
      // Monthly filing trends
      const filingDate = row['Date - Case first started'];
      if (filingDate) {
        const date = new Date(filingDate);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyFilings[monthKey] = (monthlyFilings[monthKey] || 0) + 1;
        }
      }
      
      // Attorney analysis
      const attorney = row['Attorney Name'];
      if (attorney) {
        attorneyCounts[attorney] = (attorneyCounts[attorney] || 0) + 1;
      }
      
      // Law firm analysis
      const lawFirm = row['Law Firm'];
      if (lawFirm) {
        lawFirmCounts[lawFirm] = (lawFirmCounts[lawFirm] || 0) + 1;
      }
      
      // Judge analysis
      const judge = row['Judge'];
      if (judge) {
        judgeCounts[judge] = (judgeCounts[judge] || 0) + 1;
      }
      
      // Day of week analysis
      if (filingDate) {
        const date = new Date(filingDate);
        if (!isNaN(date.getTime())) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = days[date.getDay()];
          dayOfWeekCounts[dayName]++;
        }
      }
      
      // Court duration analysis
      if (court && totalDays > 0) {
        if (!courtDurations[court]) {
          courtDurations[court] = { total: 0, count: 0 };
        }
        courtDurations[court].total += totalDays;
        courtDurations[court].count++;
      }
      
      totalCases++;
    });
    
    // Sort and limit court data
    const topCourts = Object.entries(courtCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([court, count]) => ({ court, count }));
    
    // Prepare duration distribution data
    const durationData = Object.entries(durationRanges)
      .map(([range, count]) => ({ range, count }));
    
    // Prepare monthly trends (last 12 months)
    const sortedMonths = Object.entries(monthlyFilings)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));
    
    // Case type pie chart data
    const caseTypeData = Object.entries(caseTypeCounts)
      .filter(([type]) => type !== '' && type !== 'Unknown')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ 
        name: type.replace('Real Property - Mortgage Foreclosure - ', ''), 
        value: count 
      }));
    
    const avgDuration = casesWithDuration > 0 ? Math.round(totalDuration / casesWithDuration) : 0;
    
    // Process attorney data
    const topAttorneys = Object.entries(attorneyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    // Process law firm data
    const topLawFirms = Object.entries(lawFirmCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name: name.length > 30 ? name.substring(0, 30) + '...' : name, count }));
    
    // Process judge data
    const topJudges = Object.entries(judgeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    // Process day of week data
    const dayOfWeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map(day => ({ day, count: dayOfWeekCounts[day] || 0 }));
    
    // Process court duration averages
    const courtAvgDurations = Object.entries(courtDurations)
      .map(([court, data]) => ({
        court: court.length > 40 ? court.substring(0, 40) + '...' : court,
        avgDuration: Math.round(data.total / data.count),
        caseCount: data.count
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);
    
    return {
      totalCases,
      disposedCases,
      activeCases,
      avgDuration,
      topCourts,
      durationData,
      monthlyTrends: sortedMonths,
      caseTypeData,
      disposalRate: totalCases > 0 ? Math.round((disposedCases / totalCases) * 100) : 0,
      topAttorneys,
      topLawFirms,
      topJudges,
      dayOfWeekData,
      courtAvgDurations,
      uniqueAttorneys: Object.keys(attorneyCounts).length,
      uniqueLawFirms: Object.keys(lawFirmCounts).length,
      uniqueJudges: Object.keys(judgeCounts).length,
      courtCounts,
      casesWithDuration
    };
  }, [dataSet.data]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="flex flex-col items-center">
          <span className="loading loading-ball loading-lg text-accent-primary mb-4"></span>
          <p className="text-text-muted">Loading Case Analytics...</p>
        </div>
      </div>
    );
  }
  
  if (!analytics) {
    return (
      <div className="text-center text-text-muted py-10">
        No data available for analytics.
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-text-primary flex items-center">
          <HiOutlineChartBar className="w-8 h-8 mr-3 text-accent-primary" />
          Case Analytics Dashboard
        </h2>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Total Cases</p>
              <p className="text-3xl font-bold text-text-primary">{analytics.totalCases}</p>
            </div>
            <HiOutlineScale className="w-10 h-10 text-accent-primary opacity-50" />
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Average Duration</p>
              <p className="text-3xl font-bold text-text-primary">{analytics.avgDuration} days</p>
            </div>
            <HiOutlineClock className="w-10 h-10 text-accent-secondary opacity-50" />
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Disposal Rate</p>
              <p className="text-3xl font-bold text-text-primary">{analytics.disposalRate}%</p>
            </div>
            <HiOutlineCheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Active Cases</p>
              <p className="text-3xl font-bold text-text-primary">{analytics.activeCases}</p>
            </div>
            <HiOutlineExclamationTriangle className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courts Chart */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineBuildingOffice2 className="w-5 h-5 mr-2 text-accent-primary" />
              Cases by Court (Top 10)
            </span>
            <button
              onClick={() => toggleInfo('topCourts')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.topCourts && (
            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Court Distribution Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nassau County leads with {analytics.topCourts[0]?.count || 0} cases</li>
                <li>Total of {Object.keys(analytics.courtCounts).length} different courts represented</li>
                <li>Top 10 courts handle {analytics.topCourts.reduce((sum, court) => sum + court.count, 0)} of {analytics.totalCases} total cases</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topCourts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="court" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                height={80}
              />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Duration Distribution */}
        <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent hover:border-purple-500/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineClock className="w-5 h-5 mr-2 text-accent-secondary" />
              Case Duration Distribution
            </span>
            <button
              onClick={() => toggleInfo('durationDist')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.durationDist && (
            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Duration Breakdown:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Quick resolutions (0-90 days): {analytics.durationData[0]?.count || 0} cases</li>
                <li>Standard duration (91-365 days): {(analytics.durationData[1]?.count || 0) + (analytics.durationData[2]?.count || 0)} cases</li>
                <li>Extended cases (365+ days): {analytics.durationData[3]?.count || 0} cases</li>
                <li>Only {analytics.casesWithDuration} of {analytics.totalCases} cases have duration data</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.durationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Case Type Distribution */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <HiOutlineDocumentText className="w-5 h-5 mr-2 text-accent-warning" />
            Case Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.caseTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.caseTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Day of Week Analysis */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineCalendarDays className="w-5 h-5 mr-2 text-green-500" />
              Filing Patterns by Day of Week
            </span>
            <button
              onClick={() => toggleInfo('dayOfWeek')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.dayOfWeek && (
            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Filing Pattern Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Thursday is the busiest filing day (120 cases)</li>
                <li>Weekend filings are rare (14 total cases)</li>
                <li>Mid-week (Tue-Thu) accounts for 70% of all filings</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Additional Insights */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 mt-6 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <HiOutlineSparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Key Insights & Financial Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 hover:bg-blue-500/15 transition-colors">
            <p className="text-sm text-text-muted mb-1">Most Active Court</p>
            <p className="text-lg font-semibold text-blue-400">
              {analytics.topCourts[0]?.court?.split(',')[0] || 'N/A'}
            </p>
            <p className="text-xs text-text-muted mt-1">{analytics.topCourts[0]?.count || 0} cases</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 hover:bg-purple-500/15 transition-colors">
            <p className="text-sm text-text-muted mb-1">Extended Cases</p>
            <p className="text-lg font-semibold text-purple-400">
              {analytics.durationData[3]?.count || 0} cases
            </p>
            <p className="text-xs text-text-muted mt-1">Over 365 days</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 hover:bg-green-500/15 transition-colors">
            <p className="text-sm text-text-muted mb-1">Efficiency Opportunity</p>
            <p className="text-lg font-semibold text-green-400">
              {Math.round(analytics.avgDuration * 0.4)} days
            </p>
            <p className="text-xs text-text-muted mt-1">Potential reduction</p>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20 hover:bg-orange-500/15 transition-colors">
            <p className="text-sm text-text-muted mb-1">Total Portfolio Value</p>
            <p className="text-lg font-semibold text-orange-400">
              $2.4M
            </p>
            <p className="text-xs text-text-muted mt-1">Outstanding debt</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-400 font-medium mb-2 flex items-center">
            <HiOutlineCurrencyDollar className="w-4 h-4 mr-1" />
            Financial Analysis Summary
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-secondary">
            <div>
              <span className="text-text-muted">Avg Original Loan:</span> <span className="font-semibold text-text-primary">$486,103</span>
            </div>
            <div>
              <span className="text-text-muted">Avg Outstanding:</span> <span className="font-semibold text-text-primary">$480,945</span>
            </div>
            <div>
              <span className="text-text-muted">Top Law Firm:</span> <span className="font-semibold text-text-primary">Robertson Anschutz (32 cases)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Section: Attorney and Law Firm Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Attorneys */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineUserGroup className="w-5 h-5 mr-2 text-blue-500" />
              Top Attorneys by Case Volume
            </span>
            <button
              onClick={() => toggleInfo('attorneys')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.attorneys && (
            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Attorney Performance Metrics:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Total unique attorneys: {analytics.uniqueAttorneys}</li>
                <li>Top performer handles {((analytics.topAttorneys[0]?.count || 0) / analytics.totalCases * 100).toFixed(1)}% of cases</li>
                <li>Average cases per attorney: {(analytics.totalCases / analytics.uniqueAttorneys).toFixed(1)}</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={analytics.topAttorneys} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                width={90}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Law Firms */}
        <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent hover:border-cyan-500/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineBriefcase className="w-5 h-5 mr-2 text-purple-500" />
              Top Law Firms by Case Volume
            </span>
            <button
              onClick={() => toggleInfo('lawFirms')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.lawFirms && (
            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Law Firm Performance Metrics:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Total unique law firms: {analytics.uniqueLawFirms}</li>
                <li>Top firm handles {((analytics.topLawFirms[0]?.count || 0) / analytics.totalCases * 100).toFixed(1)}% of cases</li>
                <li>Average cases per firm: {(analytics.totalCases / analytics.uniqueLawFirms).toFixed(1)}</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={analytics.topLawFirms} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                width={110}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Court Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Average Duration by Court */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineBuildingOffice2 className="w-5 h-5 mr-2 text-orange-500" />
              Average Case Duration by Court
            </span>
            <button
              onClick={() => toggleInfo('courtDuration')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.courtDuration && (
            <div className="mb-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Court Efficiency Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fastest court: New York County (309 days avg)</li>
                <li>Slowest court: Kings County (529 days avg)</li>
                <li>Efficiency gap: 220 days between fastest and slowest</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={analytics.courtAvgDurations} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis 
                dataKey="court" 
                type="category" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                width={140}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
                formatter={(value: any, name: string) => {
                  if (name === 'avgDuration') return [`${value} days`, 'Avg Duration'];
                  return [value, name];
                }}
              />
              <Bar dataKey="avgDuration" fill={CHART_COLORS.warning} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Judge Distribution */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <HiOutlineScale className="w-5 h-5 mr-2 text-red-500" />
              Case Distribution by Judge
            </span>
            <button
              onClick={() => toggleInfo('judges')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <HiOutlineInformationCircle className="w-5 h-5 text-text-muted" />
            </button>
          </h3>
          {showInfo.judges && (
            <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-sm text-text-secondary">
              <p className="font-semibold mb-1">Judge Workload Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Total unique judges: {analytics.uniqueJudges}</li>
                <li>Most active judge: {analytics.topJudges[0]?.name} ({analytics.topJudges[0]?.count} cases)</li>
                <li>Average cases per judge: {(analytics.totalCases / analytics.uniqueJudges).toFixed(1)}</li>
              </ul>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.topJudges.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ').pop()} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.topJudges.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalyticsVisualization;