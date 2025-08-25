import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyticsData {
  top_attorneys: Record<string, number>;
  top_law_firms: Record<string, number>;
  judge_distribution: Record<string, number>;
  court_duration_avg: Record<string, {
    average_days: number;
    case_count: number;
    min_days: number;
    max_days: number;
  }>;
  filing_patterns: Record<string, number>;
  party_types: Record<string, number>;
  case_status: Record<string, number>;
  nature_of_suit: Record<string, number>;
  total_cases: number;
  unique_attorneys: number;
  unique_law_firms: number;
  unique_judges: number;
  analysis_date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#D084D0', '#FFB6C1'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/Law Database/analytics_summary.json');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error loading analytics data</div>
      </div>
    );
  }

  // Transform data for charts
  const attorneyData = Object.entries(data.top_attorneys)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 10);

  const lawFirmData = Object.entries(data.top_law_firms)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 10);

  const judgeData = Object.entries(data.judge_distribution)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 10);

  const courtDurationData = Object.entries(data.court_duration_avg)
    .map(([court, stats]) => ({
      court: court.replace('New York State, ', '').replace(' County, Supreme Court', ''),
      averageDays: stats.average_days,
      caseCount: stats.case_count,
      minDays: stats.min_days,
      maxDays: stats.max_days
    }))
    .slice(0, 8);

  const dayOfWeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    .map(day => ({
      day: day.substring(0, 3),
      count: data.filing_patterns[day] || 0
    }));

  const partyTypeData = Object.entries(data.party_types)
    .map(([type, count]) => ({ name: type, value: count }));

  const natureOfSuitData = Object.entries(data.nature_of_suit)
    .map(([type, count]) => ({ name: type.replace('Real Property - Mortgage Foreclosure - ', ''), value: count }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Foreclosure Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-2">
          Data analyzed on {new Date(data.analysis_date).toLocaleDateString()} | 
          Total cases: {data.total_cases.toLocaleString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_cases.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Attorneys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.unique_attorneys}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Law Firms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.unique_law_firms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Judges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.unique_judges}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attorneys" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="attorneys">Attorneys</TabsTrigger>
          <TabsTrigger value="firms">Law Firms</TabsTrigger>
          <TabsTrigger value="judges">Judges</TabsTrigger>
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="attorneys">
          <Card>
            <CardHeader>
              <CardTitle>Top Attorneys by Case Count</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attorneyData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firms">
          <Card>
            <CardHeader>
              <CardTitle>Top Law Firms by Case Count</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={lawFirmData} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="judges">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Judge Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={judgeData} layout="horizontal" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Judges</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {judgeData.map((judge, index) => (
                      <div key={judge.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{index + 1}. {judge.name}</span>
                        <span className="text-sm font-semibold text-gray-600">{judge.count} cases</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="duration">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Case Duration by Court (Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={courtDurationData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="court" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-semibold">{data.court}</p>
                              <p className="text-sm">Average: {data.averageDays} days</p>
                              <p className="text-sm">Cases: {data.caseCount}</p>
                              <p className="text-sm">Range: {data.minDays} - {data.maxDays} days</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="averageDays" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Filing by Day of Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Case Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={natureOfSuitData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {natureOfSuitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}