import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import Error from './pages/Error';
import ToasterProvider from './components/ToasterProvider';
import SideNav from './components/SideNav';
import TopBar from './components/TopBar';
import LandingPage from './pages/LandingPage';
import SavedListsPage from './pages/SavedListsPage';
import DatabaseViewPage from './pages/DatabaseViewPage';
import SettingsPage from './pages/SettingsPage';
import ExportsPage from './pages/ExportsPage';
import TriggersPage from './pages/TriggersPage';
import TrashPage from './pages/TrashPage';
import ResourcesPage from './pages/ResourcesPage';
import EmailPage from './pages/EmailPage';
import OutreachTrackingPage from './pages/OutreachTrackingPage';
import AIChatPage from './pages/AIChatPage';
import FavoritesPage from './pages/FavoritesPage';
import CompanyFilterPage from './pages/CompanyFilterPage';
import CompanySearchResultsPage from './pages/CompanySearchResultsPage';
import LegalCasesPage from './pages/LegalCasesPage';
import CaseDurationAnalysisPage from './pages/CaseDurationAnalysisPage';
import CaseReviewPage from './pages/CaseReviewPage';
import AIVoiceSearch from './pages/AIVoiceSearch';
import DatabasesPage from './pages/DatabasesPage';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import './styles/legal-theme.css';

function App() {
  const AppLayout = () => {
    const { isSidebarCollapsed } = useLayout();

    return (
      <div className="flex min-h-screen w-full bg-white text-gray-800">
        <ToasterProvider />
        <ScrollRestoration />
        <SideNav />
        <div className="flex flex-col flex-grow">
          {!isSidebarCollapsed && <TopBar />}
          <main 
            className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pl-20 pt-0' : 'pl-60'}`}
           > 
            <div className={`${isSidebarCollapsed ? 'p-0' : 'p-6 md:p-10'} h-full`}> 
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { path: '/', element: <LandingPage /> },
        { path: '/saved-lists', element: <SavedListsPage /> },
        { path: '/favorites', element: <FavoritesPage /> },
        { path: '/databases', element: <DatabasesPage /> },
        { path: '/company-filter', element: <CompanyFilterPage /> },
        { path: '/company-search-results', element: <CompanySearchResultsPage /> },
        { path: '/acquisition-targets', element: <LegalCasesPage /> },
        { path: '/market-analysis', element: <CaseDurationAnalysisPage /> },
        { path: '/due-diligence', element: <CaseReviewPage /> },
        { path: '/ai-voice-search', element: <AIVoiceSearch /> },
        { path: '/database/law-database', element: <DatabaseViewPage /> },
        { path: '/database/ny-foreclosure', element: <DatabaseViewPage /> },
        { path: '/triggers', element: <TriggersPage /> },
        { path: '/exports', element: <ExportsPage /> },
        { path: '/trash', element: <TrashPage /> },
        { path: '/settings', element: <SettingsPage /> },
        { path: '/resources', element: <ResourcesPage /> },
        { path: '/email', element: <EmailPage /> },
        { path: '/outreach-tracking', element: <OutreachTrackingPage /> },
        { path: '/ai-chat', element: <AIChatPage /> },
      ],
      errorElement: <Error />,
    },
  ]);

  return (
    <LayoutProvider>
      <RouterProvider router={router} />
    </LayoutProvider>
  );
}

export default App;
