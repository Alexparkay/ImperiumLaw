import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; // Import for auto-resizing textarea
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlinePaperAirplane, // Send icon
  HiOutlineHome,          // Home breadcrumb icon
  HiOutlineMagnifyingGlass, // Search icon
  HiOutlineCodeBracket, // Python icon
  HiOutlineDocumentText, // Read icon
  HiOutlineComputerDesktop, // Webpage icon
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineScale,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheck,
  HiOutlineBeaker,
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineChevronDown
} from 'react-icons/hi2';
import { fetchAIResponse } from '../services/api'; // Import the API service
import { useLayout } from '../context/LayoutContext';
import { motion } from 'framer-motion';

// Types
interface BaseMessage {
  id: number;
  timestamp: number;
}

interface UserMessage extends BaseMessage {
  sender: 'user';
  text: string;
}

interface SystemMessage extends BaseMessage {
  sender: 'system';
  text: string;
}

interface ErrorMessage extends BaseMessage {
  sender: 'error';
  text: string;
}

// Specific types for simulation steps
interface SimulationStepBase extends BaseMessage {
  sender: 'simulation';
  stepType: 'acknowledgement' | 'tool_search' | 'tool_python' | 'tool_read' | 'tool_webpage' | 'summary' | 'loading' | 'custom_info';
  status?: 'pending' | 'running' | 'complete' | 'error';
}

interface AcknowledgementStep extends SimulationStepBase {
  stepType: 'acknowledgement';
  text: string;
}

interface LoadingStep extends SimulationStepBase {
  stepType: 'loading';
}

interface SearchMetadata {
  type: 'init' | 'database' | 'analysis' | 'pattern' | 'summary';
  query?: string;
  results?: any[];
}

interface SearchStep extends SimulationStepBase {
  stepType: 'tool_search';
  query: string;
  text: string;
  metadata?: SearchMetadata;
}

interface PythonStep extends SimulationStepBase {
  stepType: 'tool_python';
  filename?: string;
  details: string;
}

interface ReadStep extends SimulationStepBase {
  stepType: 'tool_read';
  target: string;
}

interface WebpageStep extends SimulationStepBase {
  stepType: 'tool_webpage';
  pageName: string;
}

interface SummaryStep extends SimulationStepBase {
  stepType: 'summary';
  text: string;
}

// Custom Info Message Type
interface CustomInfoMessageStep extends SimulationStepBase {
  stepType: 'custom_info';
  title: string;
  content: string;
  htmlLink: string;
  htmlLinkText: string;
}

// Union type for all possible messages/steps
type ConversationItem = UserMessage | SystemMessage | ErrorMessage | AcknowledgementStep | SearchStep | PythonStep | ReadStep | WebpageStep | SummaryStep | LoadingStep | CustomInfoMessageStep;

type InteractionPhase = 'initial' | 'confirming' | 'processing' | 'done';

// --- Step View Components --- 

// Generic Tool Step Wrapper
const ToolStepWrapper: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2">
    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
      <div className="flex items-center space-x-1.5">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
    </div>
    <div className="pl-5 text-sm text-gray-800">
        {children}
    </div>
  </div>
);

const TerminalSearchAnimation = () => (
  <motion.div 
    className="h-24 overflow-hidden rounded-lg bg-background-primary/70 border border-white/5 p-3 font-mono text-xs"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div className="space-y-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center text-emerald-500"
      >
        <span className="text-text-secondary mr-2">$</span>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="overflow-hidden whitespace-nowrap"
        >
          initialize_search --source=global_database --depth=comprehensive
        </motion.span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-blue-400 pl-4"
      >
        {">> Connecting to secure database clusters..."}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
        className="text-purple-400 pl-4"
      >
        {">> Initializing search parameters..."}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="text-amber-400 pl-4"
      >
        {">> Beginning comprehensive data scan..."}
      </motion.div>
    </motion.div>
  </motion.div>
);

const DatabaseSearchAnimation = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-text-primary">Database Query</span>
      <motion.span 
        className="text-xs text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Running
      </motion.span>
    </div>
    
    <div className="grid grid-cols-4 gap-3">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="h-12 rounded bg-background-primary/60 border border-white/5 flex items-center justify-center"
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-4 h-4 rounded-sm border border-accent-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
          />
        </motion.div>
      ))}
    </div>
    
    <div className="flex space-x-2 mt-2">
      <div className="flex-1 h-1 bg-background-primary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-primary/50 via-accent-primary to-accent-primary/50"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
      <motion.span 
        className="text-xs text-text-secondary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        84%
      </motion.span>
    </div>
  </div>
);

const DataAnalysisAnimation = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="mr-2"
        >
          <svg className="w-4 h-4 text-accent-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.div>
        <span className="text-xs font-medium text-text-primary">Data Analysis</span>
      </div>
    </div>
    
    <div className="h-32 p-2 rounded-lg bg-background-primary/60 border border-white/5 relative overflow-hidden">
      <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded bg-accent-primary/10 border border-accent-primary/20"
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              backgroundColor: ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.1)"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <div className="text-xs font-medium text-accent-primary bg-background-primary/80 px-3 py-1.5 rounded-full">
          Processing Financial Data
        </div>
      </motion.div>
    </div>
  </div>
);

const PatternMatchingAnimation = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-text-primary">Pattern Recognition</span>
    </div>
    
    <div className="h-36 rounded-lg bg-background-primary/70 border border-white/5 relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M0,50 Q25,10 50,50 T100,50 T150,50 T200,50"
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.path
          d="M0,70 Q25,30 50,70 T100,70 T150,70 T200,70"
          fill="none"
          stroke="rgba(16, 185, 129, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.path
          d="M0,30 Q25,90 50,30 T100,30 T150,30 T200,30"
          fill="none"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.6, repeat: Infinity, repeatType: "loop" }}
        />
        
        {[25, 75, 125, 175].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy="50"
            r="3"
            fill="rgba(59, 130, 246, 0.8)"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </svg>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-text-secondary">
        <span>Financial Metrics</span>
        <span>Market Growth</span>
        <span>Revenue</span>
      </div>
    </div>
  </div>
);

// Update ResultSummaryAnimation with enhanced progress bar
const ResultSummaryAnimation = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-text-primary">Results Processing</span>
      <motion.div
        className="px-2 py-0.5 rounded-full bg-accent-secondary/20 text-accent-secondary text-xs"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Finalizing
      </motion.div>
    </div>
    
    {/* Progress Bar Animation */}
    <div className="space-y-1.5 mb-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-text-secondary">Processing</span>
        <motion.span 
          className="text-xs font-medium text-accent-primary"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          96%
        </motion.span>
      </div>
      <div className="h-2 bg-background-primary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-full"
          initial={{ width: "80%" }}
          animate={{ width: ["80%", "95%", "97%", "98%", "99%"] }}
          transition={{ 
            duration: 3, 
            times: [0, 0.3, 0.6, 0.8, 1],
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="grid grid-cols-5 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 rounded-full ${i < 4 ? "bg-accent-primary/50" : "bg-background-primary"}`}
          />
        ))}
      </div>
    </div>
    
    <div className="h-24 rounded-lg bg-background-primary/70 border border-white/5 relative p-3">
      <div className="flex space-x-2 h-full">
        {[30, 45, 60, 80, 50, 70, 90, 65].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-accent-primary/20 rounded-t-sm relative overflow-hidden"
            style={{ height: `${height}%` }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-accent-primary opacity-50"
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
            />
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="absolute top-1/2 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="px-3 py-1 bg-background-secondary/80 backdrop-blur-sm rounded-full text-xs text-text-secondary">
          Top Matches Identified
        </div>
      </motion.div>
    </div>
  </div>
);

// Ensure that each search gets a unique animation type by updating DynamicSearchStep
const DynamicSearchStep = ({ step }: { step: SearchStep }) => {
  // Use step.id to determine a consistent but different animation type for each step
  const typeIndex = (typeof step.id === 'number' ? step.id : Date.now()) % 5;
  const searchTypes = ['init', 'database', 'analysis', 'pattern', 'summary'] as const;
  const searchType = step.metadata?.type || searchTypes[typeIndex];
  
  let searchAnimation;
  switch (searchType) {
    case 'init':
      searchAnimation = <TerminalSearchAnimation />;
      break;
    case 'database':
      searchAnimation = <DatabaseSearchAnimation />;
      break;
    case 'analysis':
      searchAnimation = <DataAnalysisAnimation />;
      break;
    case 'pattern':
      searchAnimation = <PatternMatchingAnimation />;
      break;
    case 'summary':
      searchAnimation = <ResultSummaryAnimation />;
      break;
    default:
      searchAnimation = <TerminalSearchAnimation />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl"
    >
      <div className="p-6 rounded-xl bg-background-secondary/70 border border-white/10 shadow-lg shadow-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-accent-primary"
          >
            <HiOutlineMagnifyingGlass className="w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <div className="text-sm font-medium text-text-primary">Advanced Search</div>
            <div className="text-xs text-text-secondary mt-1">{step.query || step.text}</div>
          </div>
        </div>
        
        {searchAnimation}
      </div>
    </motion.div>
  );
};

const PythonStepView: React.FC<{ step: PythonStep }> = ({ step }) => (
    <ToolStepWrapper icon={HiOutlineCodeBracket} title="Generate and Execute Python Code">
         <p className="text-xs text-gray-600 mb-1">{step.details}</p>
         {step.filename && (
             <div className="mt-2 p-2 border border-gray-200 rounded bg-white text-xs">
                 <p className="font-medium text-gray-700">Code Output:</p>
                 <pre className="text-gray-500 whitespace-pre-wrap">Spreadsheet created: {step.filename}</pre>
             </div>
         )}
    </ToolStepWrapper>
);

const ReadStepView: React.FC<{ step: ReadStep }> = ({ step }) => (
    <ToolStepWrapper icon={HiOutlineDocumentText} title="Read">
        <p className="text-xs text-gray-600">Target: <span className="font-medium">{step.target}</span></p>
    </ToolStepWrapper>
);

const WebpageStepView: React.FC<{ step: WebpageStep }> = ({ step }) => (
    <ToolStepWrapper icon={HiOutlineComputerDesktop} title="Create Web Page">
         <p className="text-xs text-gray-600">Page Name: <span className="font-medium">{step.pageName}</span></p>
    </ToolStepWrapper>
);

// Component for the Custom Info Message
const CustomInfoMessageView: React.FC<{ step: CustomInfoMessageStep }> = ({ step }) => {
    // Split content into paragraphs for rendering
    const paragraphs = step.content.split('\\n\\n'); 

    return (
        <div className="p-4 rounded-lg bg-background-secondary text-text-primary border border-white/10 shadow-lg shadow-black/20 max-w-3xl glass-panel my-2">
            <h4 className="text-lg font-semibold mb-3 text-text-primary">{step.title}</h4>
            {paragraphs.map((para, index) => {
                // Basic check for list items or specific keywords to apply formatting
                const lines = para.split('\\n');
                if (lines.length > 1 && lines[0].match(/Summary$|Overview$/i)) { // Render lists under specific headings
                     return (
                         <div key={index} className="mb-3">
                             <h5 className="font-semibold text-text-secondary mb-1.5">{lines[0]}</h5>
                             <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-text-secondary">
                                 {lines.slice(1).map((line, lineIndex) => (
                                    <li key={lineIndex}>{line.replace(/^- /, '')}</li> // Remove leading dashes if present
                                 ))}
                             </ul>
                         </div>
                     );
                } else if (lines.length > 1 && lines[0].includes(':')) { // Simple check for key: value pairs or definitions
                     return (
                         <div key={index} className="mb-3">
                            <h5 className="font-semibold text-text-secondary mb-1.5">{lines[0]}</h5>
                             <p className="text-sm text-text-secondary whitespace-pre-wrap">{lines.slice(1).join('\\n')}</p>
                         </div>
                     )
                }
                // Default paragraph rendering
                return <p key={index} className="text-base text-text-secondary mb-3 whitespace-pre-wrap">{para}</p>;
            })}
            {/* Links & Button */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-3 text-sm">
                 {/* Existing Link to HTML Table View */}
                 <Link
                    to="/database/pcba-process" 
                    className="text-accent-primary hover:underline font-medium block" 
                >
                    {step.htmlLinkText}
                 </Link>
                 
                 {/* Button Link */}
                 <Link 
                    to="/database/pcba-process"
                    className="btn btn-primary btn-sm normal-case font-medium" // DaisyUI primary button style
                 >
                    Explore in more detail the behind the scenes of this process and see the final database. Click here
                 </Link>
            </div>
        </div>
    );
};

const AIChatPage = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionPhase, setInteractionPhase] = useState<InteractionPhase>('initial');
  const [confirmedQuery, setConfirmedQuery] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useLayout();

  // Template prompts
  const templatePrompts = [
    {
      title: "Network & Security Installers",
      prompt: `Find companies matching:
- Industry: Network, Security, A/V Installation
- Employee count: 1-10 employees
- Location: No closer than 50 miles to major cities (population 100,000+)
- Target roles: Network Integrator, Networking Engineer, Systems Engineer, Security Integrator, Surveillance, Low-Voltage Technician, Data Cabling Technician, Cable Installation Technician`,
      icon: HiOutlineComputerDesktop
    },
    {
      title: "Financial Services Acquisition",
      prompt: `Find potential acquisition targets:
- Industry: Financial Services, FinTech
- Revenue: $10M - $50M
- Location: North America, Europe
- Specialization: Payment Processing, Digital Banking, Wealth Management
- Technology Stack: Modern, Cloud-based
- Growth Rate: 20%+ YoY`,
      icon: HiOutlineCurrencyDollar
    },
    {
      title: "Healthcare Software Companies",
      prompt: `Find healthcare technology companies:
- Industry: Healthcare Software, Medical Technology
- Employee count: 50-200
- Location: United States
- Specialization: EHR, Practice Management, Telemedicine
- Target Market: Hospitals, Clinics, Private Practices
- Technology: Cloud-based, AI/ML capabilities`,
      icon: HiOutlineBeaker
    },
    {
      title: "E-commerce Logistics",
      prompt: `Find logistics companies:
- Industry: E-commerce Logistics, Last-mile Delivery
- Revenue: $20M - $100M
- Location: North America
- Services: Warehousing, Fulfillment, Delivery
- Technology: Real-time Tracking, Automation
- Client Base: E-commerce, Retail`,
      icon: HiOutlineTruck
    }
  ];

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        // Use smooth scrolling for a better experience
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Scroll when conversation changes
    scrollToBottom();
    
    // Also set a slight delay to ensure any animations/expansions have completed
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [conversation]);

  // Add initial greeting message
  useEffect(() => {
      setConversation([
          {
              id: Date.now(),
              sender: 'system',
              text: `Hello! I can help you find companies matching specific criteria. 

Please provide details like:
- Product types & codes (e.g., HTS codes)
- Import/Export countries
- Target/Excluded industries
- Annual revenue/import volume
- Ideal contact roles

The more detail you provide, the better the results. What are you looking for today?`,
              timestamp: Date.now()
          }
      ]);
  }, []); // Run only once on mount

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

  // Function to handle template selection
  const handleTemplateSelect = (prompt: string) => {
    setInputQuery(prompt);
    setShowTemplates(false);
  };

  // --- Interaction Logic --- 

  // Step 1: Get confirmation questions based on initial query
  const getConfirmationQuestions = async (initialQuery: string) => {
    setIsLoading(true);
    setInteractionPhase('processing'); // Show loading while getting questions

    const confirmationPrompt = `
      A user wants to find companies based on the following criteria:
      """
      ${initialQuery}
      """
      Ask 1 or 2 brief clarification questions to ensure all necessary details are captured before proceeding with the company search. 
      Focus on potentially ambiguous or missing details (e.g., specific regions, confirmation of codes, date ranges if applicable).
      Respond *only* with the questions, formatted clearly.
    `;

    const questions = await fetchAIResponse(confirmationPrompt);
    setIsLoading(false);

    let messageId = Date.now();
    if (questions && !questions.startsWith('Error:')) {
      setConversation(prev => [
        ...prev,
        { id: messageId, sender: 'system', text: questions, timestamp: Date.now() }
      ]);
      setInteractionPhase('confirming'); // Move to confirmation phase
      setConfirmedQuery(initialQuery); // Store initial query temporarily
    } else {
      setConversation(prev => [
        ...prev,
        { id: messageId, sender: 'error', text: questions || 'Error getting clarification questions.', timestamp: Date.now() }
      ]);
      setInteractionPhase('initial'); // Reset on error
    }
  };

  // Update Simulation Log Function
  const getSimulationLog = async (finalQuery: string) => {
    console.log("Triggering simulation for query:", finalQuery);
    setIsLoading(true); // Block input
    setInteractionPhase('processing');

    // Add an immediate acknowledgement message
    const ackId = Date.now();
    setConversation(prev => [
      ...prev,
      { 
          id: ackId,
          sender: 'simulation',
          stepType: 'acknowledgement',
          text: "Okay, processing the confirmed criteria...",
          timestamp: Date.now(),
          status: 'complete'
      }
    ]);

    const simulationPrompt = `
      User query: "${finalQuery}"

      Based on the user query, generate a JSON array representing the detailed simulation steps an AI research agent would take. 
      The JSON array should contain objects, each with:
      - 'id': A unique number for the step.
      - 'stepType': One of 'tool_search', 'tool_python', 'tool_read', 'tool_webpage', 'summary'.
      - 'details': A short description of the action or data.
      - Include specific details relevant to the type: 
          - For 'tool_search': Add a 'query' field with realistic search keywords based on the user query.
          - For 'tool_python': Add a 'filename' (e.g., 'company_data_YYYY-MM-DD.xlsx') and 'details' mentioning # of companies.
          - For 'tool_read': Add a 'target' field (e.g., 'Python code', 'spreadsheet').
          - For 'tool_webpage': Add a 'pageName' field (e.g., 'company_report_summary').
          - For 'summary': Use 'details' for the summary text.
      
      Generate a sequence of at least 5 'tool_search' steps with varied queries, followed by 'tool_python', optionally 'tool_read'/'tool_webpage', and ending with a 'summary' step.
      Output *only* the valid JSON array string. Do not include any other text before or after the JSON array.

      Example JSON object format:
      { "id": 1, "stepType": "tool_search", "query": "PCBA suppliers medical aerospace", "details": "Searching for relevant suppliers..." }
    `;

    const rawResponse = await fetchAIResponse(simulationPrompt);
    
    let simulationSteps: Omit<ConversationItem, 'sender' | 'timestamp' | 'status'>[] = []; // Array to hold parsed steps

    if (rawResponse && !rawResponse.startsWith('Error:')) {
        try {
            // Attempt to parse the JSON array string
            simulationSteps = JSON.parse(rawResponse.trim()); 
            if (!Array.isArray(simulationSteps)) throw new Error("Response was not a JSON array.");
            console.log("Parsed simulation steps:", simulationSteps);
        } catch (error) {
            console.error("Failed to parse simulation JSON:", error);
            simulationSteps = []; // Reset if parsing failed
            setConversation(prev => [
              ...prev,
              { 
                  id: Date.now(), 
                  sender: 'error', 
                  text: `Error: Could not understand the simulation sequence. Response: ${rawResponse}`,
                  timestamp: Date.now() 
              }
            ]);
        }
    } else {
       setConversation(prev => [
         ...prev,
         { 
             id: Date.now(), 
             sender: 'error', 
             text: rawResponse || 'Failed to generate simulation steps.',
             timestamp: Date.now() 
         }
       ]);
    }

    // --- Sequential Display Logic --- 
    if (simulationSteps.length > 0) {
        let currentStepIndex = 0;
        const displayInterval = 1500; // Delay between showing steps (ms)

        const showNextStep = () => {
            if (currentStepIndex < simulationSteps.length) {
                const stepData = simulationSteps[currentStepIndex];
                const stepId = Date.now() + currentStepIndex; // Ensure unique ID
                
                // Add step as 'simulation' type
                setConversation(prev => [
                    ...prev,
                    { 
                        ...stepData, // Spread the parsed step data (id, stepType, details, etc.)
                        id: stepId, 
                        sender: 'simulation',
                        timestamp: Date.now(),
                        status: 'complete' // Mark as complete immediately for now
                    } as ConversationItem // Assert type
                ]);

                currentStepIndex++;
                setTimeout(showNextStep, displayInterval);
            } else {
                // All steps displayed, now add the custom ICTC message
                setIsLoading(false);
                setInteractionPhase('done');

                // Define the custom message content
                const ictcMessage: CustomInfoMessageStep = {
                    id: Date.now() + currentStepIndex + 1, // Ensure unique ID
                    sender: 'simulation', 
                    stepType: 'custom_info',
                    timestamp: Date.now(),
                    title: "ICTC Electronic Customer Import Data",
                    content: `I've compiled a comprehensive list of companies that match your specific requirements for PCBA (Printed Circuit Board Assembly) importers. The data is presented in two formats:\n\nSpreadsheet: A detailed Excel file with all the matching companies and their information.\nHTML Table: A visually formatted table that can be easily viewed and exported as PDF.\n\nSearch Criteria Summary\nImport Products from: China, Vietnam, Mexico, Canada\nProduct Codes: 8534.XX.XXXX, 8529.90.5500, 8534.XX.XXXX, 8549.XX.XXXX, 8548.XX.XXXX, 8517.62.XXXX, 8532.XX.XXXX, 8471.90.XXXX\nAnnual Import Volume: $1 million – $10 million\nProduct Type: PCBA (Printed Circuit Board Assemblies), not bare boards (PCB)\nExcluded Industries: Automotive, Lighting\nTarget Industries: Medical, Oil & Gas, Metering, Green Energy, Aerospace\nIdeal Contact: Buyer, Supply Chain Manager/Director\n\nMatching Companies Overview\nThe search yielded 15 companies that match your criteria. Here's a summary of the key importers:\n\nMedical Industry Importers\n- Sanmina Corporation - Imports from China, Mexico; Annual volume $5-10M; Medical, Aerospace, Green Energy\n- Express Manufacturing Inc. (EMI) - Imports from China, Mexico; Annual volume $3-7M; Medical, Green Energy\n- FS Technology - Imports from China; Annual volume $1-5M; Medical\n- TTM Technologies - Imports from China, Canada; Annual volume $5-10M; Medical, Aerospace\n\nOil & Gas and Metering Importers\n- Topscom PCB Assembly - Imports from China; Annual volume $2-6M; Oil & Gas, Metering\n- PCBMay - Imports from China; Annual volume $1-4M; Metering, Green Energy\n- Meritek EMS - Imports from China, Vietnam; Annual volume $3-8M; Medical, Oil & Gas\n\nGreen Energy Importers\n- POE PCBA - Imports from China; Annual volume $1-4M; Green Energy\n- Logwell Technology - Imports from China; Annual volume $1-3M; Medical, Green Energy\n\nAerospace Importers\n- Murrietta Circuits - Imports from Mexico, China; Annual volume $2-8M; Energy, Medical, Aerospace\n- Creative Hi-Tech - Imports from China, Vietnam; Annual volume $1-4M; Energy, Medical, Aerospace\n- Premier Manufacturing - Imports from Mexico, Canada; Annual volume $2-5M; Aerospace, Energy\n\nFull Data Access\nYou can access the complete dataset in the following formats:`, 
                    htmlLink: "/database/pcba-process",
                    htmlLinkText: "HTML Table (with PDF export option): View HTML Table",
                };

                setConversation(prev => [...prev, ictcMessage]);
            }
        };

        // Start displaying steps
        setTimeout(showNextStep, displayInterval);
    } else {
        // If no steps were parsed or generated
        setIsLoading(false);
        setInteractionPhase('initial'); // Or 'error'? Reset to allow new input.
    }
  };

  // Handle message sending based on interaction phase
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedQuery = inputQuery.trim();
    if (!trimmedQuery || isLoading) return;

    const newUserMessage: UserMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedQuery,
      timestamp: Date.now()
    };
    setConversation(prev => [...prev, newUserMessage]);
    setInputQuery('');

    if (interactionPhase === 'initial') {
      getConfirmationQuestions(trimmedQuery);
    } else if (interactionPhase === 'confirming' && confirmedQuery) {
      // Combine initial query and confirmation answer (simple concatenation for now)
      const fullQuery = `Initial Criteria: ${confirmedQuery}\nConfirmation/Details: ${trimmedQuery}`;
      getSimulationLog(fullQuery);
    } else if (interactionPhase === 'done') {
        // Allow new searches after one is done
        setInteractionPhase('initial');
        setConfirmedQuery(null);
        getConfirmationQuestions(trimmedQuery); 
    }
  };

  return (
    <div className="h-full flex flex-col">
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

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Professional Banner */}
        {showTemplates && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Company Search</h1>
                <p className="text-base text-gray-600 max-w-3xl mx-auto">
                  Get precise company matches using our AI search. Structure your prompts clearly to get the best results.
                </p>
              </div>

              {/* Tips Section - Moved to top */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
                <h3 className="text-base font-medium text-gray-900 mb-3">Tips for Better Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Be Specific</h4>
                        <p className="text-xs text-gray-600">Include specific criteria like industry, size, location, and financial metrics.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Use Clear Structure</h4>
                        <p className="text-xs text-gray-600">Organize your criteria in a clear, bullet-point format for better analysis.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Include Context</h4>
                        <p className="text-xs text-gray-600">Provide relevant context about your search goals and preferences.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Ask for Analysis</h4>
                        <p className="text-xs text-gray-600">Request specific analysis or comparisons to get more detailed insights.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Templates Section */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-900 mb-3">Template Prompts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {templatePrompts.map((template, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(template.prompt)}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <template.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{template.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 text-left">
                        {template.prompt.split('\n')[0]}...
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((item) => {
            let content = null;
            let alignmentClass = 'justify-start';
            let bubbleClass = 'bg-background-secondary/80 text-text-primary border border-white/10 shadow-lg shadow-black/20 max-w-2xl backdrop-blur-sm';
            let showBubble = true;

            if (item.sender === 'user') {
                alignmentClass = 'justify-end';
                bubbleClass = 'bg-[#0084ff] text-white max-w-xl shadow-lg';
                content = (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        {item.text.split('\n').map((line, index) => (
                            <p key={index} className="text-base text-white font-normal whitespace-pre-wrap">{line}</p>
                        ))}
                    </motion.div>
                );
            } else if (item.sender === 'system') {
                content = (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        {item.text.split('\n\n').map((paragraph, index) => (
                            <div key={index} className="space-y-2">
                                {paragraph.split('\n').map((line, lineIndex) => (
                                    <p key={lineIndex} className="text-sm text-text-secondary leading-relaxed">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                );
            } else if (item.sender === 'error') {
                bubbleClass = 'bg-red-500/10 text-red-400 border border-red-500/20 max-w-2xl backdrop-blur-sm';
                content = (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        {item.text.split('\n').map((line, index) => (
                            <p key={index} className="text-sm leading-relaxed">{line}</p>
                        ))}
                    </motion.div>
                );
            } else if (item.sender === 'simulation' && item.stepType === 'tool_search') {
                showBubble = false;
                content = <DynamicSearchStep step={item as SearchStep} />;
            } else if (item.sender === 'simulation') {
                showBubble = false; 
                switch (item.stepType) {
                    case 'acknowledgement':
                        showBubble = true;
                        content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-sm text-text-secondary">{item.text}</p>
                            </motion.div>
                        );
                        break;
                    case 'tool_python':
                        content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PythonStepView step={item} />
                            </motion.div>
                        );
                        break;
                    case 'tool_read':
                        content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ReadStepView step={item} />
                            </motion.div>
                        );
                        break;
                     case 'tool_webpage':
                        content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WebpageStepView step={item} />
                            </motion.div>
                        );
                        break;
                    case 'summary':
                        showBubble = true;
                        bubbleClass = 'bg-background-secondary text-text-primary border border-white/10 shadow-lg shadow-black/20 max-w-3xl';
                         content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-lg font-semibold mb-3 text-text-primary">Research Summary</h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{item.text}</p>
                             </div>
                            </motion.div>
                         );
                        break;
                    case 'custom_info':
                        content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomInfoMessageView step={item} />
                            </motion.div>
                        );
                        break;
                    case 'loading':
                         content = (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center py-2 pl-1"
                            >
                                <span className="loading loading-spinner loading-xs text-accent-primary mr-2"></span>
                                <span className="text-xs text-text-secondary italic">Processing...</span>
                            </motion.div>
                         );
                         break;
                    default:
                        content = null;
                }
            }

            return (
                <motion.div
                    key={item.id}
                    className={`flex ${alignmentClass} w-full mb-4`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                {showBubble ? (
                        <div className={`p-4 rounded-xl ${bubbleClass}`}>
                        {content}
                    </div>
                 ) : (
                        <div className="w-full flex justify-start">
                            <div className="w-full max-w-3xl">
                             {content}
                         </div>
                     </div>
                 )}
                </motion.div>
            );
          })}
          {/* Loading indicator during initial confirmation fetch */}
          {isLoading && interactionPhase === 'processing' && conversation.length > 0 && conversation[conversation.length - 1].sender === 'user' && (
            <div className="flex justify-start pl-2 pt-4">
                <div className="p-3 rounded-lg bg-gray-100">
                    <span className="loading loading-dots loading-sm text-gray-400"></span>
                </div>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-white/10 bg-background-primary/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); 
                  handleSendMessage(); 
                }
              }}
                placeholder="Type your message here..."
                className="w-full p-4 pr-12 rounded-xl bg-background-secondary/50 border border-white/10 text-text-primary placeholder-text-secondary/50 focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50 resize-none backdrop-blur-sm shadow-lg shadow-black/20"
                rows={3}
            />
            <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputQuery.trim()}
                className={`absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200 ${
                  isLoading || !inputQuery.trim()
                    ? 'text-text-secondary/50'
                    : 'text-accent-primary hover:bg-accent-primary/10'
                }`}
            >
              <HiOutlinePaperAirplane className="w-5 h-5" />
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
