import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineMicrophone,
  HiOutlineSpeakerWave,
  HiOutlineStop,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
  HiOutlineClipboardDocumentList,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';
import VapiWidget from '../components/VapiWidget';
import VapiPopup from '../components/VapiPopup';

// Type definitions for chat messages
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

// Type for discovered resources
interface DiscoveredResource {
  id: string;
  type: 'website' | 'linkedin' | 'article';
  url: string;
  title: string;
  timestamp: Date;
}

// Country code options
const countryCodes = [
  { code: "+1", name: "US/Canada" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+91", name: "India" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
];

// Format for different country phone numbers
const getPhoneNumberPlaceholder = (countryCode: string) => {
  switch (countryCode) {
    case "+1": return "(555) 123-4567";
    case "+44": return "7700 900123";
    case "+61": return "412 345 678";
    case "+33": return "6 12 34 56 78";
    case "+49": return "1512 3456789";
    case "+91": return "99999 12345";
    case "+81": return "90-1234-5678";
    case "+86": return "131 2345 6789";
    default: return "Enter phone number";
  }
};

// Initial empty chat messages
const initialMessages: ChatMessage[] = [];

// Suggestions for user queries
const suggestedQueries = [
  "What's our conversion rate trend?",
  "Show me revenue by region",
  "Analyze customer retention rates",
  "Compare Q1 vs Q2 performance",
  "Identify top-performing products",
  "Forecast next month's sales"
];

// Type for tab names
type TabName = 'chat' | 'summary' | 'history' | 'settings';

const AIVoiceSearch = () => {
  // State hooks
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("+1");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('chat');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchActivity, setSearchActivity] = useState('Initializing search...');
  const [showCallNotification, setShowCallNotification] = useState(false);
  const [discoveredResources, setDiscoveredResources] = useState<DiscoveredResource[]>([]);
  const [showResourceFeed, setShowResourceFeed] = useState(false);
  const [summaryText, setSummaryText] = useState(`# Voice-assistant takeaway (what you told me in the call)

You're looking to buy a small, owner-run cable & wire-harness contract manufacturer in the U.S. Southeast—something modest in size but with real estate attached and an owner ready to retire.

## Quick-glance criteria

**Sector & code:** Wire/cable & harness fabrication — NAICS 33592

**States:** Florida, Alabama, Georgia

**Size:**
- Revenue $0.5 M – $2 M
- 8 – 50 employees

**Owner profile:** Principal 50+ years old, willing to stay ≤ 12 months for hand-off

**Facility:** Business owns its building (lease-back acceptable)

**Who to approach:** President / CEO

These are the filters we've identified from your conversation. We've extrapolated additional details to provide more accurate targeting parameters. Is this correct so far? Is there anything you want to add? Feel free to edit the information.`);
  const [editableSummary, setEditableSummary] = useState('');
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate the placeholder based on selected country code
  const placeholder = getPhoneNumberPlaceholder(countryCode);

  // Handle transcript updates from Vapi
  const handleTranscriptUpdate = (transcript: string) => {
    if (transcript.trim()) {
      setCurrentTranscript(prev => {
        const newTranscript = prev ? `${prev} ${transcript}` : transcript;
        return newTranscript;
      });
    }
  };

  // Handle Vapi status changes
  const handleVapiStatusChange = (isActive: boolean) => {
    if (!isActive && currentTranscript) {
      // When voice input stops, send the transcript as a message
      handleSendMessage(currentTranscript);
      setCurrentTranscript('');
      // Switch to summary tab after voice interaction
      setActiveTab('summary');
    }
  };

  // Format phone number based on country code
  const formatPhoneNumber = (value: string, country: string) => {
    // Strip all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Format based on country code
    switch (country) {
      case "+1": // US/Canada
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 6) return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
      
      case "+44": // UK
        if (numericValue.length <= 4) return numericValue;
        return `${numericValue.slice(0, 4)} ${numericValue.slice(4, 10)}`;
      
      // Add more country-specific formatting as needed
      
      default:
        // Basic formatting with spaces every 3 digits
        return numericValue.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    }
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value, countryCode);
    setPhoneNumber(formattedNumber);
  };

  // Check if form is complete
  const isFormComplete = () => {
    return fullName.trim() && companyName.trim() && phoneNumber.trim();
  };

  // Simulate sending a message
  const handleSendMessage = (text: string = '') => {
    // If we have a completed form, use that
    if (isFormComplete()) {
      const contactDetails = {
        fullName,
        company: companyName,
        phone: `${countryCode} ${phoneNumber}`
      };
      
      // Start search animation
      setIsSearching(true);
      setSearchProgress(0);
      setSearchActivity('Initializing search...');
      setDiscoveredResources([]);
      setShowResourceFeed(false);
      
      // Define the resources to be "discovered" during research
      const resourcesToDiscover = [
        {
          id: '1',
          type: 'website' as const,
          url: 'https://www.ictcusa.com/',
          title: 'ICTC USA - Global Manufacturing Solutions',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'linkedin' as const,
          url: 'https://www.linkedin.com/in/sareet-majumdar-4608577/',
          title: 'Sareet Majumdar - LinkedIn Profile',
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'article' as const,
          url: 'https://www.ictcusa.com/news',
          title: 'ICTC USA Expands Cable & Wire Harness Capabilities',
          timestamp: new Date()
        },
        {
          id: '4',
          type: 'website' as const,
          url: 'https://www.ictcusa.com/aerospace',
          title: 'ICTC USA - Aerospace Solutions',
          timestamp: new Date()
        },
        {
          id: '5',
          type: 'article' as const,
          url: 'https://www.ictcusa.com/contact',
          title: 'ICTC USA Corporate Headquarters - Brooksville, FL',
          timestamp: new Date()
        }
      ];
      
      // Simulate deep research activities with progressive updates
      const totalDuration = 15000; // 15 seconds total
      const updateInterval = 1500; // Update every 1.5 seconds
      const activities = [
        'Searching the web for company information...',
        'Analyzing company profile and industry data...',
        'Finding LinkedIn profiles of key personnel...',
        'Gathering publicly available financial records...',
        'Cross-referencing news articles and press releases...',
        'Identifying market position and competitors...',
        'Compiling industry benchmarks and trends...',
        'Preparing personalized insights based on research...',
        'Finalizing analysis and preparing to connect...'
      ];
      
      // Show resource feed after 4 seconds
      setTimeout(() => {
        setShowResourceFeed(true);
      }, 4000);
      
      // Start progress updates
      let currentStep = 0;
      const progressTimer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, (currentStep * updateInterval / totalDuration) * 100);
        setSearchProgress(newProgress);
        
        if (currentStep < activities.length) {
          setSearchActivity(activities[currentStep - 1]);
        }
        
        // Add a discovered resource every 2-3 steps
        if (currentStep % 2 === 0 && currentStep / 2 < resourcesToDiscover.length) {
          const newResource = resourcesToDiscover[currentStep / 2 - 1];
          setDiscoveredResources(prev => [...prev, {
            ...newResource,
            timestamp: new Date()
          }]);
        }
        
        if (currentStep * updateInterval >= totalDuration) {
          clearInterval(progressTimer);
          
          // End search animation and show call notification
          setIsSearching(false);
          setShowResourceFeed(false);
          setShowCallNotification(true);
          
          // Auto hide notification after 15 seconds
          setTimeout(() => {
            setShowCallNotification(false);
          }, 15000);
          
          // Format the message content
          const messageContent = `I'd like to be called. My contact information: ${contactDetails.fullName} from ${contactDetails.company}, phone: ${contactDetails.phone}`;
          
          // Add user message
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: messageContent,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, userMessage]);
          
          // Add system message about upcoming call
          const systemMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'system',
            content: `Thank you! Our AI agent will call you at ${contactDetails.phone} in approximately 30-60 seconds. Please keep your phone nearby.`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, systemMessage]);
          
          // Clear form
          setFullName('');
          setCompanyName('');
          setPhoneNumber('');
        }
      }, updateInterval);
      
      return;
    }
    
    // Handle voice transcripts
    if (text.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI thinking/processing
      setIsProcessing(true);
      
      // Simulate AI response after a delay
      setTimeout(() => {
        const responseText = `I'm processing your voice query: "${text}". This is a placeholder response. The actual AI voice assistant is now active through VAPI.`;
        
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: responseText,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1500);
    }
  };

  // Toggle voice popup - Only opens when explicitly clicked
  const toggleVoicePopup = () => {
    const wasOpen = isPopupOpen;
    setIsPopupOpen(!isPopupOpen);
    if (!isPopupOpen) {
      // Reset the current transcript when opening the popup
      setCurrentTranscript('');
    } else {
      // If we're closing the popup and had been listening, stop listening
      if (isListening) {
        setIsListening(false);
      }
      // After closing the popup, navigate to the summary tab
      setActiveTab('summary');
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (isListening) {
      // Automatically send the transcript when stopping the recording
      if (currentTranscript) {
        handleSendMessage(currentTranscript);
        setCurrentTranscript('');
      }
    } else {
      // Reset the current transcript when starting a new recording
      setCurrentTranscript('');
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages(initialMessages);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Toggle edit mode for summary
  const toggleSummaryEdit = () => {
    if (isEditingSummary) {
      // Save the edits
      setSummaryText(editableSummary);
      setIsEditingSummary(false);
    } else {
      // Enter edit mode
      setEditableSummary(summaryText);
      setIsEditingSummary(true);
      // Focus the textarea after state update and render
      setTimeout(() => {
        if (summaryTextareaRef.current) {
          summaryTextareaRef.current.focus();
        }
      }, 100);
    }
  };

  // Cancel editing summary
  const cancelSummaryEdit = () => {
    setIsEditingSummary(false);
  };

  // Confirm summary is correct
  const confirmSummary = () => {
    // Navigate to cable wire database page with the correct path
    window.location.href = '/database/cable-wire-harness';
  };

  return (
    <div className="ai-voice-search w-full p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link to="/" className="text-text-secondary hover:text-text-primary mr-3">
            <HiOutlineArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-semibold text-text-primary">AI Voice Search</h1>
        </div>
        <p className="text-base text-text-muted">Enter your contact information and we'll call you, or use the microphone for direct voice interaction.</p>
      </div>
      
      {/* Call Notification */}
      {showCallNotification && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-lg w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        >
          <div className="glass-panel bg-background-secondary/90 backdrop-blur-xl border border-white/30 shadow-2xl shadow-accent-primary/10 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-70"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent-primary/5 blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative flex items-center">
              <div className="flex-shrink-0 relative mr-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/90 to-green-600/90 shadow-lg shadow-green-500/20 flex items-center justify-center">
                  <HiOutlinePhone className="h-10 w-10 text-white" />
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping animation-delay-500"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Call Scheduled</h3>
                <p className="text-lg text-text-secondary mb-3">
                  Our AI agent will call you in approximately <span className="text-accent-primary font-semibold">30-60 seconds</span>. 
                  Please keep your phone nearby.
                </p>
                
                <div className="flex gap-3 mt-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    Preparing call
                  </span>
                  
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium">
                    <HiOutlineInformationCircle className="w-4 h-4 mr-2" />
                    Analysis complete
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCallNotification(false)}
                className="absolute top-0 right-0 p-2 text-text-muted hover:text-text-secondary"
              >
                <HiOutlineXMark className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Research Loading Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <motion.div 
            className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-8 max-w-xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-32 h-32">
                {/* Animated circular gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse"></div>
                
                {/* Loading spinner */}
                <div className="absolute inset-2 rounded-full border-4 border-white/10 border-t-accent-primary animate-spin"></div>
                
                {/* Multiple orbiting particles */}
                <div className="absolute w-full h-full">
                  <motion.div 
                    className="absolute w-4 h-4 rounded-full bg-accent-primary"
                    animate={{ 
                      x: ["0%", "100%", "0%", "-100%", "0%"],
                      y: ["0%", "100%", "0%", "-100%", "0%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ left: '50%', top: '50%', marginLeft: '-8px', marginTop: '-8px' }}
                  />
                  <motion.div 
                    className="absolute w-3 h-3 rounded-full bg-accent-secondary"
                    animate={{ 
                      x: ["0%", "-100%", "0%", "100%", "0%"],
                      y: ["0%", "-100%", "0%", "100%", "0%"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ left: '50%', top: '50%', marginLeft: '-6px', marginTop: '-6px' }}
                  />
                  <motion.div 
                    className="absolute w-2 h-2 rounded-full bg-white"
                    animate={{ 
                      x: ["0%", "50%", "0%", "-50%", "0%"],
                      y: ["0%", "-50%", "0%", "50%", "0%"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ left: '50%', top: '50%', marginLeft: '-4px', marginTop: '-4px' }}
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-text-primary text-center mb-4">Researching Company Information</h2>
            <p className="text-center text-text-secondary mb-6">{searchActivity}</p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-background-accent rounded-full overflow-hidden mb-5">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-accent-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${searchProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Real-time resource discovery feed */}
            {showResourceFeed && (
              <div className="mt-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">Discovered Resources</h3>
                  <span className="text-xs text-text-muted">Live feed</span>
                </div>
                
                <div className="bg-background-accent/30 backdrop-blur-sm border border-white/5 rounded-lg p-2 max-h-[180px] overflow-y-auto">
                  <AnimatePresence>
                    {discoveredResources.map((resource) => (
                      <motion.div
                        key={resource.id}
                        className="p-2.5 mb-1.5 rounded-md bg-background-accent/40 border border-white/5 flex items-center"
                        initial={{ opacity: 0, y: 15, height: 0, padding: 0, margin: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto', padding: '0.625rem', marginBottom: '0.375rem' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-1.5 mr-3 rounded-md bg-background-accent/80 flex-shrink-0">
                          {resource.type === 'website' && (
                            <HiOutlineGlobeAlt className="w-5 h-5 text-blue-400" />
                          )}
                          {resource.type === 'linkedin' && (
                            <HiOutlineUser className="w-5 h-5 text-blue-400" />
                          )}
                          {resource.type === 'article' && (
                            <HiOutlineDocumentText className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{resource.title}</p>
                          <p className="text-xs text-text-muted truncate">{resource.url}</p>
                        </div>
                        <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                          {resource.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            <p className="text-center text-sm text-text-muted">This may take a few moments as we gather information</p>
          </motion.div>
        </div>
      )}
      
      {/* Voice Assistant Popup */}
      <VapiPopup 
        isOpen={isPopupOpen} 
        onClose={toggleVoicePopup} 
        isListening={isListening} 
        startSpeaking={toggleListening}
      />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area - Takes up 3/4 of the screen on large displays */}
        <div className="lg:col-span-3">
          <div className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 240px)' }}>
            {/* Tabs */}
            <div className="flex border-b border-white/10 px-4">
              <button 
                className={`py-4 px-6 font-medium text-sm flex items-center ${activeTab === 'chat' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('chat')}
              >
                <HiOutlineChatBubbleBottomCenterText className="w-4 h-4 mr-2" />
                Chat
              </button>
              <button 
                className={`py-4 px-6 font-medium text-sm flex items-center ${activeTab === 'summary' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('summary')}
              >
                <HiOutlineDocumentText className="w-4 h-4 mr-2" />
                Summary
              </button>
              <button 
                className={`py-4 px-6 font-medium text-sm flex items-center ${activeTab === 'history' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('history')}
              >
                <HiOutlineClipboardDocumentList className="w-4 h-4 mr-2" />
                History
              </button>
              <button 
                className={`py-4 px-6 font-medium text-sm flex items-center ${activeTab === 'settings' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('settings')}
              >
                <HiOutlineCog className="w-4 h-4 mr-2" />
                Settings
              </button>
              
              {/* Voice button in tab bar */}
              <div className="ml-auto flex items-center pr-4">
                <button 
                  onClick={toggleVoicePopup}
                  className="p-3 rounded-full bg-accent-primary hover:bg-accent-primary/90 text-white flex items-center gap-2"
                  title="Voice Search"
                >
                  <HiOutlineMicrophone className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Voice Search</span>
                </button>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'chat' && (
              <div className="flex-grow overflow-y-auto p-0 space-y-4 flex flex-col justify-center items-center relative">
                {/* Fixed microphone button positioned in the center of the screen */}
                {messages.length === 0 && (
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                    >
                      <div 
                        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                        style={{
                          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0) 70%)",
                          borderRadius: "50%"
                        }}
                      >
                        <button
                          onClick={toggleVoicePopup}
                          className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500"
                          style={{
                            background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #2563eb 100%)",
                            boxShadow: "0 0 100px 10px rgba(59, 130, 246, 0.4), 0 20px 60px -10px rgba(37, 99, 235, 0.6)"
                          }}
                        >
                          <HiOutlineMicrophone className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 text-white opacity-90" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {messages.length > 0 ? (
                  <div className="w-full p-6 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div 
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.type === 'user' 
                              ? 'bg-accent-primary/80 text-white'
                              : message.type === 'system'
                                ? 'bg-background-accent/50 text-text-secondary border border-white/5'
                                : 'bg-background-accent/50 text-text-primary border border-white/5'
                          }`}
                        >
                          {message.content}
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Empty placeholder div for when there are no messages - the fixed button handles display
                  <div className="w-full h-full" />
                )}
                
                {isProcessing && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-background-accent/50 text-text-primary border border-white/5 rounded-2xl px-4 py-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse delay-300"></div>
                        <span className="text-text-secondary ml-1">Processing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Summary Tab Content */}
            {activeTab === 'summary' && (
              <div className="flex-grow overflow-y-auto">
                <div className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-text-primary">Conversation Summary</h2>
                    {!isEditingSummary ? (
                      <button 
                        onClick={toggleSummaryEdit}
                        className="flex items-center gap-1 text-sm font-medium text-accent-primary hover:text-accent-primary/80 py-1 px-3 rounded-lg border border-accent-primary/30 hover:border-accent-primary/50 transition-colors"
                      >
                        <HiOutlinePencil className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={cancelSummaryEdit}
                          className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 py-1 px-3 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors"
                        >
                          <HiOutlineXMark className="w-4 h-4" /> Cancel
                        </button>
                        <button 
                          onClick={toggleSummaryEdit}
                          className="flex items-center gap-1 text-sm font-medium text-green-500 hover:text-green-600 py-1 px-3 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-colors"
                        >
                          <HiOutlineCheck className="w-4 h-4" /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditingSummary ? (
                    <textarea
                      ref={summaryTextareaRef}
                      value={editableSummary}
                      onChange={(e) => setEditableSummary(e.target.value)}
                      className="w-full h-[calc(100vh-320px)] p-4 bg-background-accent/20 backdrop-blur-sm border border-white/10 rounded-xl text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      style={{ 
                        resize: "none",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap"
                      }}
                    />
                  ) : (
                    <>
                      <div className="prose prose-invert max-w-none p-6 glass-panel bg-background-secondary/50 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 rounded-xl mb-6">
                        <div dangerouslySetInnerHTML={{ 
                          __html: summaryText
                            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-text-primary">$1</h1>')
                            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6 text-text-primary">$1</h2>')
                            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-4 text-text-primary">$1</h3>')
                            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-text-primary">$1</strong>')
                            .replace(/- (.*$)/gim, '<li class="ml-6 mb-1 text-text-secondary list-disc">$1</li>')
                            .replace(/\n\n/gim, '<br/><br/>')
                        }} />
                      </div>
                      
                      {/* Confirmation prompt */}
                      <motion.div 
                        className="mb-6 p-5 glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 rounded-xl flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-accent-primary/20 mr-4">
                            <HiOutlineQuestionMarkCircle className="w-6 h-6 text-accent-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-text-primary">Is this summary correct?</h3>
                            <p className="text-sm text-text-secondary mt-1">You can edit the summary to add or correct information.</p>
                          </div>
                        </div>
                        <button 
                          onClick={confirmSummary}
                          className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
                        >
                          <HiOutlineCheck className="w-5 h-5" />
                          Confirm
                        </button>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="flex-grow overflow-y-auto p-6 flex justify-center items-center">
                <div className="text-center text-text-secondary">
                  <HiOutlineClipboardDocumentList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Chat history will appear here</p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="flex-grow overflow-y-auto p-6 flex justify-center items-center">
                <div className="text-center text-text-secondary">
                  <HiOutlineCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Voice assistant settings will appear here</p>
                </div>
              </div>
            )}
            
            {/* Form Input Area - Only show in Chat tab */}
            {activeTab === 'chat' && (
              <div className="border-t border-white/10 p-4">
                {/* Full Name Input */}
                <div className="flex items-center bg-background-accent/30 text-text-primary border border-white/10 rounded-lg overflow-hidden mb-3">
                  <div className="pl-3 pr-2">
                    <HiOutlineUser className="w-5 h-5 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="flex-grow bg-transparent px-2 py-3 focus:outline-none"
                  />
                </div>
                
                {/* Company Name Input */}
                <div className="flex items-center bg-background-accent/30 text-text-primary border border-white/10 rounded-lg overflow-hidden mb-3">
                  <div className="pl-3 pr-2">
                    <HiOutlineBuildingOffice2 className="w-5 h-5 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                    className="flex-grow bg-transparent px-2 py-3 focus:outline-none"
                  />
                </div>
                
                {/* Phone Number and Controls */}
                <div className="flex items-center gap-2">
                  {/* Country code selector */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-background-accent/30 text-text-primary border border-white/10 rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Phone input */}
                  <div className="flex-grow flex items-center bg-background-accent/30 text-text-primary border border-white/10 rounded-lg overflow-hidden">
                    <div className="pl-3 pr-2">
                      <HiOutlinePhone className="w-5 h-5 text-text-secondary" />
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      onKeyPress={handleKeyPress}
                      placeholder={`Phone Number (${placeholder})`}
                      className="flex-grow bg-transparent px-2 py-3 focus:outline-none"
                    />
                  </div>
                  
                  {/* Send button */}
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!isFormComplete()}
                    className="p-3 rounded-full bg-accent-primary hover:bg-accent-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <HiOutlinePhone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - 1/4 of the screen on large displays */}
        <div className="lg:col-span-1 space-y-6">
          {/* Help Panel */}
          <motion.div 
            className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-medium text-text-primary flex items-center mb-4">
              <HiOutlineQuestionMarkCircle className="w-5 h-5 mr-2 text-accent-primary" />
              How It Works
            </h2>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mr-2">1</div>
                <span>Fill out the contact form or click the microphone for direct voice interaction</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mr-2">2</div>
                <span>We'll call you back at your provided number to connect you with our AI assistant</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mr-2">3</div>
                <span>Ask questions and get instant insights from your data</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Suggested Queries */}
          <motion.div 
            className="glass-panel bg-background-secondary/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 rounded-xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-lg font-medium text-text-primary flex items-center mb-4">
              <HiOutlineSpeakerWave className="w-5 h-5 mr-2 text-accent-secondary" />
              Try Asking
            </h2>
            <div className="space-y-2">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(query)}
                  className="w-full text-left p-2 rounded text-sm hover:bg-background-accent/50 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="flex-1 py-2 px-4 rounded-lg bg-background-accent/50 text-text-secondary hover:text-text-primary border border-white/10 text-sm font-medium transition-colors duration-200"
            >
              Clear Chat
            </button>
            <button
              className="flex-1 py-2 px-4 rounded-lg bg-background-accent/50 text-text-secondary hover:text-text-primary border border-white/10 text-sm font-medium transition-colors duration-200"
            >
              Export Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceSearch; 