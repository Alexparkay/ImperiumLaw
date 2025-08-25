import React from 'react';
import {
  MdOutlineBusinessCenter,
  MdOutlineGroupAdd,
  MdOutlineEditNote,
  MdOutlineQueryStats,
  MdOutlineFileUpload,
  MdOutlineQuestionAnswer,
  MdOutlineDescription,
} from 'react-icons/md'; // Example icons, adjust as needed

interface QuickStartItem {
  icon: React.ElementType;
  text: string;
  onClick?: () => void; // Optional onClick handler
}

// Placeholder function for chat bot toggle
const handleOpenChatBot = () => {
  console.log('Open Chat Bot clicked');
  // Add logic to toggle chat bot visibility here (e.g., update state/context)
};

const quickStartItems: QuickStartItem[] = [
  { icon: MdOutlineBusinessCenter, text: 'Find & enrich companies' },
  { icon: MdOutlineGroupAdd, text: 'Find potential buyers' },
  { icon: MdOutlineEditNote, text: 'Draft NDA with AI' },
  { icon: MdOutlineQueryStats, text: 'Analyze financials' },
  { icon: MdOutlineFileUpload, text: 'Import CRM data' },
  { icon: MdOutlineQuestionAnswer, text: 'Chat with Broker Bot', onClick: handleOpenChatBot },
  { icon: MdOutlineDescription, text: 'Use a deal template' },
];

const QuickStartMenu: React.FC = () => {
  return (
    <div className="mb-8"> {/* Section margin */}
      <h2 className="text-xl font-semibold text-text-primary mb-4">Quick start</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"> {/* Responsive grid */}
        {quickStartItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="glass-panel flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left p-4 rounded-xl border border-white/10 shadow-lg shadow-black/20 hover:scale-105 hover:shadow-xl hover:shadow-accent-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            aria-label={item.text}
          >
            <item.icon className="text-accent-primary text-3xl mb-2 sm:mb-0 sm:mr-3" />
            <span className="text-sm font-medium text-text-secondary">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickStartMenu; 