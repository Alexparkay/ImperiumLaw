import React, { useEffect } from 'react';
import TopDealsBox from '../components/topDealsBox/TopDealsBox';
import ChartBox from '../components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import QuickStartMenu from '../components/features/QuickStartMenu';
import {
    HiOutlineUsers,
    HiOutlineArchiveBox,
    HiOutlinePresentationChartLine,
    HiOutlineCurrencyDollar,
    HiOutlineMap,
    HiOutlineChartPie,
    HiOutlineChartBar,
    HiOutlineClipboardDocumentList,
    HiOutlineCubeTransparent,
    HiOutlineBuildingOffice2,
    HiOutlineTag,
    HiOutlineDocumentChartBar,
    HiOutlineClipboard,
    HiOutlineMicrophone,
    HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import {
    fetchTotalProducts,
    fetchTotalProfit,
    fetchTotalRatio,
    fetchTotalRevenue,
    fetchTotalRevenueByProducts,
    fetchTotalSource,
    fetchTotalUsers,
    fetchTotalVisit,
} from '../api/ApiCollection';

// Helper to choose icon based on title/type
const getChartIcon = (title: string) => {
    if (title.includes('Users')) return HiOutlineUsers;
    if (title.includes('Products')) return HiOutlineArchiveBox;
    if (title.includes('Ratio')) return HiOutlinePresentationChartLine;
    if (title.includes('Revenue') && !title.includes('Products')) return HiOutlineCurrencyDollar;
    if (title.includes('Source')) return HiOutlineMap;
    if (title.includes('Visit')) return HiOutlineChartBar;
    if (title.includes('Profit')) return HiOutlineCurrencyDollar;
    if (title.includes('Revenue by Products')) return HiOutlineClipboardDocumentList;
    return HiOutlineChartBar; // Default
};

const Home = () => {
    // API Queries
    const queryGetTotalUsers = useQuery({ queryKey: ['totalusers'], queryFn: fetchTotalUsers });
    const queryGetTotalProducts = useQuery({ queryKey: ['totalproducts'], queryFn: fetchTotalProducts });
    const queryGetTotalRatio = useQuery({ queryKey: ['totalratio'], queryFn: fetchTotalRatio });
    const queryGetTotalRevenue = useQuery({ queryKey: ['totalrevenue'], queryFn: fetchTotalRevenue });
    const queryGetTotalSource = useQuery({ queryKey: ['totalsource'], queryFn: fetchTotalSource });
    const queryGetTotalRevenueByProducts = useQuery({ queryKey: ['totalrevenue-by-products'], queryFn: fetchTotalRevenueByProducts });
    const queryGetTotalVisit = useQuery({ queryKey: ['totalvisit'], queryFn: fetchTotalVisit });
    const queryGetTotalProfit = useQuery({ queryKey: ['totalprofit'], queryFn: fetchTotalProfit });

    // Log when the component renders
    useEffect(() => {
        console.log("Home component rendered");
    }, []);

    // Suggested AI Interactions items
    const suggestedInteractions = [
        { icon: HiOutlineBuildingOffice2, text: 'Filter Companies' },
        { icon: HiOutlineTag, text: 'Acquisition Targets' },
        { icon: HiOutlineDocumentChartBar, text: 'Market Analysis' },
        { icon: HiOutlineClipboard, text: 'Due Diligence' },
        { icon: HiOutlineMicrophone, text: 'AI Voice Search' },
        { icon: HiOutlineChatBubbleLeftRight, text: 'AI Search' }
    ];

    return (
        <div className="home w-full p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-text-primary mb-1">AI Search & Dashboard</h1>
                <p className="text-base text-text-muted">Engage with the AI or explore your data overview.</p>
            </div>

            {/* QuickStart Section */}
            <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-lg shadow-black/20 mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-5">Quick Actions</h2>
                <QuickStartMenu />
            </div>

            {/* Suggested AI Interactions Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-5">Suggested AI Interactions</h2>
                <div className="grid grid-cols-3 gap-6">
                    {suggestedInteractions.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => console.log(`${item.text} clicked`)}
                            className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center border border-white/10 shadow-lg shadow-black/20 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 min-h-[120px]"
                        >
                            <item.icon className="w-8 h-8 mb-3 text-accent-secondary" />
                            <span className="text-base font-medium text-text-secondary">{item.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,_auto)]">
                {/* Top Deals Box */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20 col-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-3 flex flex-col">
                    <TopDealsBox />
                </div>

                {/* Stats Chart Boxes */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'line'}
                        IconBox={getChartIcon('Total Users')}
                        title="Total Users"
                        {...queryGetTotalUsers.data}
                        isLoading={queryGetTotalUsers.isLoading}
                        isSuccess={queryGetTotalUsers.isSuccess}
                    />
                </div>
                
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'line'}
                        IconBox={getChartIcon('Total Products')}
                        title="Total Products"
                        {...queryGetTotalProducts.data}
                        isLoading={queryGetTotalProducts.isLoading}
                        isSuccess={queryGetTotalProducts.isSuccess}
                    />
                </div>
                
                {/* Leads by Source - Pie Chart */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20 lg:row-span-2">
                    <ChartBox
                        chartType={'pie'}
                        IconBox={getChartIcon('Leads by Source')}
                        title="Leads by Source"
                        {...queryGetTotalSource.data}
                        isLoading={queryGetTotalSource.isLoading}
                        isSuccess={queryGetTotalSource.isSuccess}
                    />
                </div>

                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'line'}
                        IconBox={getChartIcon('Total Ratio')}
                        title="Conversion Ratio"
                        {...queryGetTotalRatio.data}
                        isLoading={queryGetTotalRatio.isLoading}
                        isSuccess={queryGetTotalRatio.isSuccess}
                    />
                </div>
                
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'line'}
                        IconBox={getChartIcon('Total Revenue')}
                        title="Total Revenue"
                        {...queryGetTotalRevenue.data}
                        isLoading={queryGetTotalRevenue.isLoading}
                        isSuccess={queryGetTotalRevenue.isSuccess}
                    />
                </div>
               
                {/* Revenue by Products - Area Chart */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20 col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2">
                    <ChartBox
                        chartType={'area'}
                        IconBox={getChartIcon('Revenue by Products')}
                        title="Revenue by Products"
                        {...queryGetTotalRevenueByProducts.data}
                        isLoading={queryGetTotalRevenueByProducts.isLoading}
                        isSuccess={queryGetTotalRevenueByProducts.isSuccess}
                    />
                </div>
                
                {/* Total Visit - Bar Chart */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'bar'}
                        IconBox={getChartIcon('Total Visit')}
                        title="Total Visits"
                        {...queryGetTotalVisit.data}
                        isLoading={queryGetTotalVisit.isLoading}
                        isSuccess={queryGetTotalVisit.isSuccess}
                    />
                </div>
                
                {/* Total Profit - Bar Chart */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-lg shadow-black/20">
                    <ChartBox
                        chartType={'bar'}
                        IconBox={getChartIcon('Total Profit')}
                        title="Total Profit"
                        {...queryGetTotalProfit.data}
                        isLoading={queryGetTotalProfit.isLoading}
                        isSuccess={queryGetTotalProfit.isSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
