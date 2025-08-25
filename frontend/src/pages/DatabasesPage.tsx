import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineScale,
  HiOutlineBuildingLibrary,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineClock
} from 'react-icons/hi2';

type DatabaseTitle = 'NY Foreclosure Database';

interface DatabaseCardProps {
  title: DatabaseTitle;
  description: string;
  stats: Array<{
    icon: React.ElementType;
    label: string;
    value: string | number;
  }>;
  tags: string[];
  link: string;
}

type CriteriaType = {
  [K in DatabaseTitle]: {
    text: string;
    icon: React.ElementType;
  }
}

const DatabaseCard: React.FC<DatabaseCardProps> = ({ title, description, stats, tags, link }) => {
  const criteria: CriteriaType = {
    'NY Foreclosure Database': {
      text: `Case Type: Foreclosure Proceedings
Jurisdiction: New York State Courts
Total Cases: 563 Active & Disposed
Average Duration: 287 days
Efficiency Opportunity: 35% reduction potential
Plaintiffs: Major Banks & Lenders
Defendants: Property Owners
Court Coverage: 30+ NY Counties

Target: Legal Counsel, Law Firms specializing in foreclosure defense`,
      icon: HiOutlineScale
    }
  };

  const Icon = criteria[title].icon;

  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search Criteria Section */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Search Criteria</h4>
            <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{criteria[title].text}</div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main DatabasesPage Component
const DatabasesPage: React.FC = () => {
  const databases: DatabaseCardProps[] = [
    {
      title: 'NY Foreclosure Database',
      description: 'Comprehensive foreclosure case data with duration optimization insights',
      stats: [
        {
          icon: HiOutlineBuildingLibrary,
          label: 'Total Cases',
          value: '563'
        },
        {
          icon: HiOutlineClock,
          label: 'Avg Duration',
          value: '287 days'
        },
        {
          icon: HiOutlineChartBar,
          label: 'Efficiency',
          value: '35% faster'
        }
      ],
      tags: ['Legal Analytics', 'Foreclosure', 'Case Duration', 'NY Courts'],
      link: '/database/ny-foreclosure'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
            Legal Databases
          </h1>
          <p className="text-lg text-gray-600 dark:text-text-secondary">
            Access comprehensive legal case data and analytics for optimizing case durations
          </p>
        </div>

        {/* Database Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {databases.map((db) => (
            <DatabaseCard key={db.title} {...db} />
          ))}
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 bg-white dark:bg-background-secondary rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-4">
            About Our Legal Databases
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-text-secondary">
            <p>
              Our legal database platform provides comprehensive access to New York State foreclosure cases,
              offering powerful analytics and insights to help law firms optimize case durations and improve
              client outcomes.
            </p>
            <p>
              With detailed case information, attorney profiles, and duration analytics, legal professionals
              can identify efficiency opportunities and benchmark their performance against industry standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-background-accent/20 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-text-primary mb-2">Case Analytics</h3>
                <p className="text-sm">Visual insights into case patterns and duration trends across counties</p>
              </div>
              <div className="bg-gray-50 dark:bg-background-accent/20 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-text-primary mb-2">Attorney Profiles</h3>
                <p className="text-sm">Detailed information on legal representatives and their case histories</p>
              </div>
              <div className="bg-gray-50 dark:bg-background-accent/20 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-text-primary mb-2">Efficiency Tools</h3>
                <p className="text-sm">Identify opportunities to reduce case duration by up to 35%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabasesPage; 