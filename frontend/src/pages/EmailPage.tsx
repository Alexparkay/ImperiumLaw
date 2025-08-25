import React, { useState, useEffect } from 'react';
import { 
    HiOutlineEnvelope, 
    HiOutlineUser, 
    HiOutlinePaperAirplane, 
    HiOutlinePencil, 
    HiOutlineClock,
    HiOutlineDocumentDuplicate,
    HiOutlineMagnifyingGlass,
    HiOutlineCircleStack,
    HiOutlineSparkles,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineEye,
    HiOutlineChartBar,
    HiOutlineBuildingOffice2,
    HiOutlineCalendar,
    HiOutlineCog,
    HiOutlineUserGroup,
    HiOutlinePhone,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineBolt,
    HiOutlineAcademicCap,
    HiOutlineBeaker,
    HiOutlineCheckCircle,
    HiOutlineArrowTrendingUp,
    HiOutlineCpuChip,
    HiOutlineInboxArrowDown
} from 'react-icons/hi2';

// --- Data Interfaces --- 
interface SourceNote { type: 'LinkedIn' | 'Website' | 'Article' | 'Court Record' | 'Other'; detail: string; url?: string; }
interface Contact { id: string; name: string; title: string; company: string; email: string; database: 'Law Database' | 'Financial DB' | 'Corporate DB'; linkedinUrl?: string; websiteUrl?: string; sourceNotes?: SourceNote[]; selected?: boolean; }
interface SentEmail { id: string; recipient: string; subject: string; sentDate: string; }
interface FollowUpStrategy { day: number; angle: string; subject: string; emailPreview: string; }

interface AdditionalContact {
    name: string;
    title: string;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
    relationship: string;
}

interface FollowUpSettings {
    initialDelay: number;
    subsequentDelay: number;
    maxFollowUps: number;
    followUpTone: 'professional' | 'casual' | 'urgent';
    preferredChannel: 'email' | 'linkedin' | 'mixed';
}

interface AIAgentMetrics {
    emailsScanned: number;
    repliesProcessed: number;
    averageResponseTime: number;
    followUpsGenerated: number;
    replyRate: number;
    engagementScore: number;
}

interface ToneProfile {
    id: string;
    name: string;
    role: string;
    toneCharacteristics: string[];
    samplePhrases: string[];
    successRate: number;
}

// --- Sample Data --- 
const sampleContacts: Contact[] = [
    { 
        id: 'c1', 
        name: 'Jim Chosy', 
        title: 'General Counsel & Senior Executive Vice President', 
        company: 'U.S. Bank', 
        email: 'jim.chosy@usbank.com', 
        database: 'Law Database', 
        linkedinUrl: 'https://www.zoominfo.com/p/James-Chosy/77802154', 
        websiteUrl: 'https://usbank.com', 
        sourceNotes: [
            { 
                type: 'Court Record', 
                detail: 'Recent foreclosure case (U.S. BANK TRUST v. STUART B. BIRNS) in Nassau County took 10 months and 7 days to resolve.', 
                url: 'https://courts.state.ny.us/foreclosure-cases'
            },
            { 
                type: 'LinkedIn', 
                detail: 'Senior Executive VP and General Counsel at U.S. Bank since 2013, strong commitment to diversity and inclusion in legal profession.',
                url: 'https://www.zoominfo.com/p/James-Chosy/77802154'
            },
            { 
                type: 'Article', 
                detail: 'Recognized for leadership in legal operations efficiency and received "Lead by Example" award from National Association of Women Lawyers.',
                url: 'https://legal-news.example/chosy-diversity-award'
            }
        ],
        selected: true
    },
    { 
        id: 'c2', 
        name: 'Laura Long', 
        title: 'General Counsel', 
        company: 'PNC Financial Services Group', 
        email: 'laura.long@pnc.com', 
        database: 'Law Database', 
        linkedinUrl: 'https://www.pnc.com/en/about-pnc/company-profile/leadership-team/laura-l-long.html', 
        websiteUrl: 'https://pnc.com', 
        sourceNotes: [
            { 
                type: 'Court Record', 
                detail: 'Foreclosure case (PNC Bank v. Oldknow) in Nassau County took 1 year, 3 months, and 25 days to resolve.', 
                url: 'https://courts.state.ny.us/case-lookup'
            },
            { 
                type: 'LinkedIn', 
                detail: 'General Counsel at PNC since September 2024, previously Deputy General Counsel of M&A. Harvard Law School J.D.',
                url: 'https://linkedin.com/in/laurallong'
            }
        ],
        selected: false
    },
    { 
        id: 'c3', 
        name: 'Brian Yoshida', 
        title: 'Chief Legal Officer', 
        company: 'Santander US', 
        email: 'brian.yoshida@santanderus.com', 
        database: 'Law Database', 
        linkedinUrl: 'https://www.santanderus.com/team_member/brian-yoshida/', 
        websiteUrl: 'https://santanderus.com', 
        sourceNotes: [
            { 
                type: 'Court Record', 
                detail: 'Residential foreclosure case (SANTANDER BANK v. DEGRAFF) in Richmond County took 10 months and 8 days.', 
                url: 'https://courts.state.ny.us'
            },
            { 
                type: 'Website', 
                detail: 'Chief Legal Officer managing all legal operations with expertise in regulatory relations and corporate governance.',
                url: 'https://santanderus.com/leadership'
            }
        ],
        selected: false
    }
];

// --- Follow-up Strategy Data ---
const followUpStrategies: FollowUpStrategy[] = [
    {
        day: 3,
        angle: "Case Duration Analysis",
        subject: "Quick Question About Your Recent Foreclosure Timeline",
        emailPreview: "Hi {firstName},\n\nI wanted to follow up on my previous email about case duration optimization. I noticed your recent foreclosure matter took significantly longer than the industry benchmark.\n\nOur specialized approach has helped lenders like PNC and U.S. Bank reduce similar case durations by 35-50%. Would you be interested in a brief 15-minute call to explore how we could help streamline your foreclosure process?"
    },
    {
        day: 7,
        angle: "Efficiency Metrics",
        subject: "35% Faster Foreclosure Resolution - Proven Results for {Company}",
        emailPreview: "Hi {firstName},\n\nI've analyzed foreclosure timelines for financial institutions similar to yours, and the data is compelling. While your recent cases averaged 10+ months, our clients typically resolve comparable matters in 5-6 months.\n\nThis translates to significant cost savings and improved portfolio performance. Could we schedule a brief call this week to discuss how we achieve these efficiency gains while maintaining full compliance?"
    },
    {
        day: 14,
        angle: "Success Stories",
        subject: "How Wells Fargo Reduced Foreclosure Duration by 45%",
        emailPreview: "Hi {firstName},\n\nI'm reaching out one final time to share a relevant success story. We recently helped a major lender reduce their average foreclosure duration from 287 days to 157 days through our specialized legal support services.\n\nGiven your role overseeing legal operations at {Company}, I believe you'd find value in learning about our approach. If improving case efficiency is still a priority, I'd be happy to share the specific strategies that delivered these results."
    }
];

// Add additional contacts data
const additionalContacts: AdditionalContact[] = [
    {
        name: "Michael DeBois",
        title: "Chief Counsel - Global Corporate Trust Services",
        relationship: "Legal Operations Lead, Foreclosure Specialist",
        email: "michael.debois@usbank.com",
        linkedinUrl: "https://linkedin.com/in/michael-debois-6664539"
    },
    {
        name: "LeAllen Frost",
        title: "EVP & Deputy General Counsel - Head of Litigation",
        relationship: "Litigation Lead, Mortgage Industry Expert",
        email: "leallen.frost@pennymac.com",
        phone: "+1 (555) 234-5678"
    },
    {
        name: "Laura O'Hara",
        title: "Chief Legal Officer",
        relationship: "Senior Legal Executive, Risk Management Focus",
        email: "laura.ohara@mtb.com",
        linkedinUrl: "https://linkedin.com/in/laura-o-hara-18bb67a3"
    }
];

// --- Template Function --- 
const generateHyperPersonalizedEmail = (contact: Contact | null, angle: string): { subject: string; body: string } => {
    if (!contact) return { subject: '', body: '' };
    const firstName = contact.name.split(' ')[0];
    let subject = `Reduce Foreclosure Case Duration by 35% - ${contact.company}`;
    let intro = `Hi ${firstName},`;
    let personalization = `Given your extensive leadership in legal operations at ${contact.company}, I wanted to reach out regarding your recent residential foreclosure cases.`; // Default
    let reason = `Our analysis shows we could help resolve similar foreclosure matters 35% faster through our specialized legal support services, while maintaining full compliance and quality standards.`;
    let closing = `Would you be open to a brief 15-minute discussion about how we can help reduce foreclosure case durations and improve portfolio performance?\n\nBest regards,\n\n[Your Name]\n[Your Title]\nImperium Law`; // Use \n for newlines
    let personalizationSourceFound = false;

    // Angle-based adjustments
    if (angle === 'Recent Court Records' && contact.sourceNotes?.some(n => n.type === 'Court Record')) {
        const note = contact.sourceNotes.find(n => n.type === 'Court Record');
        if (note) {
            subject = `Accelerate Foreclosure Resolution Times at ${contact.company}`;
            personalization = `I noticed your ${note.detail} Having worked with numerous lenders on similar matters, we understand the impact extended case cycles have on operational efficiency.`;
            reason = `We've helped financial institutions like yours reduce foreclosure case durations by 35-50% through our specialized legal support services, typically resolving matters in 5-6 months instead of 10+.`;
            personalizationSourceFound = true;
        }
    } else if (angle === 'Leadership & Operations' && contact.sourceNotes?.some(n => n.type === 'LinkedIn')) {
        const note = contact.sourceNotes.find(n => n.type === 'LinkedIn');
        if (note) {
            subject = `Streamline Foreclosure Processes at ${contact.company}`;
            personalization = `Your role as ${contact.title} positions you perfectly to drive operational improvements in foreclosure case management. ${note.detail}`;
            reason = `We specialize in helping legal teams at financial institutions implement strategies that reduce foreclosure timelines while maintaining full regulatory compliance.`;
            personalizationSourceFound = true;
        }
    } else if (angle === 'Industry Expertise' && contact.sourceNotes?.some(n => n.type === 'Website')) {
        const note = contact.sourceNotes.find(n => n.type === 'Website');
        if (note) {
            subject = `Optimize Your Foreclosure Process - ${contact.company}`;
            personalization = `I reviewed your profile and noticed that ${note.detail} This expertise makes you the ideal person to evaluate our foreclosure acceleration services.`;
            reason = `Our proven approach has helped lenders reduce average foreclosure resolution times from 287 days to under 157 days, significantly improving portfolio performance.`;
            personalizationSourceFound = true;
        }
    }

    if (!personalizationSourceFound) {
        subject = `Reduce Foreclosure Duration by 35% - ${contact.company}`;
        personalization = `As a senior legal executive at ${contact.company}, you understand the challenges of lengthy foreclosure proceedings and their impact on portfolio performance.`;
        reason = `We're helping financial institutions optimize their foreclosure processes, and our analysis shows significant efficiency opportunities for lenders like ${contact.company}.`;
    }

    const body = `${intro}\n\n${personalization}\n\n${reason}\n\n${closing}`;
    return { subject, body };
};

// --- Component --- 
const EmailPage: React.FC = () => {
    const [allContacts] = useState<Contact[]>(sampleContacts);
    const [selectedContactId, setSelectedContactId] = useState<string>(sampleContacts[0].id);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDatabase, setSelectedDatabase] = useState<string>('All');
    const [selectedAngle, setSelectedAngle] = useState<string>('Recent Court Records');
    const [activeFollowUpIndex, setActiveFollowUpIndex] = useState<number>(0);
    const [showAIMonitor, setShowAIMonitor] = useState(true);
    const [selectedToneProfile, setSelectedToneProfile] = useState<string>('professional');
    
    // AI Agent Metrics State
    const [aiMetrics] = useState<AIAgentMetrics>({
        emailsScanned: 15234,
        repliesProcessed: 892,
        averageResponseTime: 47,
        followUpsGenerated: 3421,
        replyRate: 39.1,
        engagementScore: 87
    });

    const selectedContact = allContacts.find(c => c.id === selectedContactId);

    useEffect(() => {
        const contactToUse = allContacts.find(c => c.id === selectedContactId);
        if (contactToUse) {
            const { subject: generatedSubject, body: generatedBody } = generateHyperPersonalizedEmail(contactToUse, selectedAngle);
            setSubject(generatedSubject);
            setBody(generatedBody);
        } else {
            setSubject('');
            setBody('');
        }
    }, [selectedContactId, selectedAngle, allContacts]);

    const handleSelectContact = (id: string) => {
        setSelectedContactId(prevId => prevId === id ? id : id);
        if (selectedContactId !== id) {
            setSelectedAngle('Recent Court Records');
        }
    };

    const filteredContacts = allContacts.filter(c => 
        (selectedDatabase === 'All' || c.database === selectedDatabase) &&
        (searchTerm === '' || 
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const databaseOptions = ['All', ...Array.from(new Set(allContacts.map(c => c.database)))];
    const angleOptions = ['Recent Court Records', 'Leadership & Operations', 'Industry Expertise', 'General Inquiry'];
    
    // Tone Profiles for AI Training
    const toneProfiles: ToneProfile[] = [
        {
            id: 'professional',
            name: 'Sarah Chen',
            role: 'Senior Partner',
            toneCharacteristics: ['Formal', 'Data-driven', 'Authoritative', 'Solution-focused'],
            samplePhrases: ['Based on our analysis...', 'The data indicates...', 'I recommend...'],
            successRate: 42.3
        },
        {
            id: 'consultative',
            name: 'Michael Rodriguez',
            role: 'Business Development Lead',
            toneCharacteristics: ['Collaborative', 'Question-based', 'Empathetic', 'Value-focused'],
            samplePhrases: ['I understand that...', 'Have you considered...', 'Many firms like yours...'],
            successRate: 38.7
        },
        {
            id: 'executive',
            name: 'James Thompson',
            role: 'Managing Partner',
            toneCharacteristics: ['Direct', 'Strategic', 'Results-oriented', 'Time-conscious'],
            samplePhrases: ['Quick question...', 'Bottom line...', 'Let\'s discuss how...'],
            successRate: 35.2
        }
    ];

    return (
        <div className="p-6 md:p-8 bg-background-primary min-h-full text-text-primary">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">AI-Powered Legal Outreach Platform</h1>
                <p className="text-text-secondary text-lg">391% higher reply rate with AI agents responding in under 60 seconds</p>
                
                {/* Key Metrics Bar */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-lg p-4 border border-green-500/20 bg-green-500/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Reply Rate</p>
                                <p className="text-2xl font-bold text-green-400">391% Higher</p>
                            </div>
                            <HiOutlineArrowTrendingUp className="w-8 h-8 text-green-400/50" />
                        </div>
                    </div>
                    <div className="glass-panel rounded-lg p-4 border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Avg Response Time</p>
                                <p className="text-2xl font-bold text-blue-400">47 seconds</p>
                            </div>
                            <HiOutlineBolt className="w-8 h-8 text-blue-400/50" />
                        </div>
                    </div>
                    <div className="glass-panel rounded-lg p-4 border border-purple-500/20 bg-purple-500/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Emails Monitored</p>
                                <p className="text-2xl font-bold text-purple-400">15,234</p>
                            </div>
                            <HiOutlineInboxArrowDown className="w-8 h-8 text-purple-400/50" />
                        </div>
                    </div>
                    <div className="glass-panel rounded-lg p-4 border border-orange-500/20 bg-orange-500/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">AI Engagement Score</p>
                                <p className="text-2xl font-bold text-orange-400">87/100</p>
                            </div>
                            <HiOutlineCpuChip className="w-8 h-8 text-orange-400/50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Target Profile Card */}
                    <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                    {selectedContact?.name.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                                    <h2 className="text-xl font-semibold text-text-primary">{selectedContact?.name}</h2>
                                    <p className="text-text-secondary">{selectedContact?.title}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <HiOutlineBuildingOffice2 className="w-4 h-4" />
                                    <span>{selectedContact?.company}</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <HiOutlineEnvelope className="w-4 h-4" />
                                    <span>{selectedContact?.email}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Research Sources */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-text-muted mb-4 flex items-center">
                                <HiOutlineSparkles className="w-4 h-4 mr-2 text-accent-secondary"/> 
                                Research Insights
                            </h3>
                            <div className="space-y-4">
                                {selectedContact?.sourceNotes?.map((note, index) => (
                                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                                                {note.type}
                                            </span>
                                            {note.url && (
                                                <a href={note.url} target="_blank" rel="noopener noreferrer" 
                                                   className="text-accent-primary hover:text-accent-primary/80 ml-auto">
                                                    <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-secondary">{note.detail}</p>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>

                    {/* Additional Contacts Widget */}
                    <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="text-lg font-semibold flex items-center">
                                <HiOutlineUserGroup className="w-5 h-5 mr-2 text-accent-secondary"/>
                                Additional Key Contacts
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {additionalContacts.map((contact, index) => (
                                <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-text-primary">{contact.name}</h4>
                                            <p className="text-sm text-text-secondary">{contact.title}</p>
                                            <p className="text-xs text-text-muted mt-1">{contact.relationship}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {contact.email && (
                                                <button className="p-1.5 rounded-full hover:bg-accent-primary/20 text-accent-primary">
                                                    <HiOutlineEnvelope className="w-4 h-4"/>
                                                </button>
                                            )}
                                            {contact.phone && (
                                                <button className="p-1.5 rounded-full hover:bg-accent-primary/20 text-accent-primary">
                                                    <HiOutlinePhone className="w-4 h-4"/>
                                                </button>
                                            )}
                                            {contact.linkedinUrl && (
                                                <a href={contact.linkedinUrl} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   className="p-1.5 rounded-full hover:bg-accent-primary/20 text-accent-primary">
                                                    <HiOutlineGlobeAlt className="w-4 h-4"/>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>

                    {/* AI Agent Monitor */}
                    <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                            <h3 className="text-lg font-semibold flex items-center justify-between">
                                <span className="flex items-center">
                                    <HiOutlineCpuChip className="w-5 h-5 mr-2 text-accent-primary animate-pulse"/>
                                    AI Agent Monitor
                                </span>
                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">ACTIVE</span>
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Inbox Scanning</span>
                                <span className="text-sm text-green-400">● Real-time</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Auto-Response</span>
                                <span className="text-sm text-blue-400">&lt; 60 seconds</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Follow-ups Today</span>
                                <span className="text-sm font-bold text-text-primary">47</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Conversations Active</span>
                                <span className="text-sm font-bold text-text-primary">124</span>
                            </div>
                            <div className="pt-2">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse" style={{width: '87%'}}></div>
                                </div>
                                <p className="text-xs text-text-muted mt-1">AI Performance: 87%</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Follow-up Settings Panel */}
                    <div className="glass-panel rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="text-lg font-semibold flex items-center">
                                <HiOutlineCog className="w-5 h-5 mr-2 text-accent-warning"/>
                                AI Follow-up Settings
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Initial Follow-up Delay (days)
                                </label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="14"
                                    defaultValue="3"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                                />
                </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Days Between Follow-ups
                                </label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="14"
                                    defaultValue="4"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                                />
                            </div>
                                 <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Maximum Follow-ups
                                </label>
                                     <input 
                                    type="number"
                                    min="1"
                                    max="5"
                                    defaultValue="3"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                                     />
                                 </div>
                                 <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Follow-up Tone
                                </label>
                                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70">
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Preferred Channel
                                </label>
                                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70">
                                    <option value="email">Email Only</option>
                                    <option value="linkedin">LinkedIn Only</option>
                                    <option value="mixed">Mixed Channels</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button className="w-full px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary rounded-lg font-medium transition-colors">
                                    Apply Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Email Composer */}
                    <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-lg shadow-black/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center">
                                <HiOutlinePencil className="w-6 h-6 mr-2 text-accent-warning" /> 
                                Compose Outreach
                            </h2>
                            <select 
                                value={selectedAngle}
                                onChange={(e) => setSelectedAngle(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                            >
                                {angleOptions.map(angle => (
                                    <option key={angle} value={angle}>{angle}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Email Form */}
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Subject</label>
                                     <input 
                                        type="text" 
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                                     />
                                 </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Message</label>
                                     <textarea 
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                    rows={12}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/70"
                                />
                                 </div>
                            <div className="flex justify-end">
                                     <button 
                                        type="submit" 
                                    className="px-6 py-2 bg-accent-primary hover:bg-accent-primary/90 rounded-lg text-white font-semibold flex items-center gap-2"
                                     >
                                    <HiOutlinePaperAirplane className="w-4 h-4" />
                                    Send Email
                                     </button>
                                 </div>
                             </form>
                     </div>

                    {/* Multi-Touch Follow-up Strategy */}
                    <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-lg shadow-black/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center">
                                <HiOutlineClock className="w-6 h-6 mr-2 text-accent-secondary" />
                                Multi-Touch Follow-up Strategy
                            </h2>
                            <div className="flex items-center gap-2">
                                <HiOutlineShieldCheck className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-green-400">AI-Optimized</span>
                            </div>
                        </div>
                        
                        {/* Strategy Table */}
                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Day</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Channel</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Strategy</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Success Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm">Day 0</td>
                                        <td className="py-3 px-4 text-sm">Email</td>
                                        <td className="py-3 px-4 text-sm">Initial personalized outreach</td>
                                        <td className="py-3 px-4 text-sm text-green-400">12%</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm">Day 2</td>
                                        <td className="py-3 px-4 text-sm">Email</td>
                                        <td className="py-3 px-4 text-sm">Value-add follow-up</td>
                                        <td className="py-3 px-4 text-sm text-green-400">18%</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm">Day 7</td>
                                        <td className="py-3 px-4 text-sm">LinkedIn</td>
                                        <td className="py-3 px-4 text-sm">Connection + message</td>
                                        <td className="py-3 px-4 text-sm text-blue-400">24%</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm">Day 14</td>
                                        <td className="py-3 px-4 text-sm">Email</td>
                                        <td className="py-3 px-4 text-sm">Case study share</td>
                                        <td className="py-3 px-4 text-sm text-orange-400">15%</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm">Day 30</td>
                                        <td className="py-3 px-4 text-sm">Email</td>
                                        <td className="py-3 px-4 text-sm">Nurture campaign</td>
                                        <td className="py-3 px-4 text-sm text-purple-400">8%</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <p className="text-sm text-blue-400"><strong>Combined Success Rate: 39.1%</strong> (391% higher than industry average)</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {followUpStrategies.map((strategy, index) => (
                                <div key={index} 
                                     className={`relative p-6 rounded-lg border ${activeFollowUpIndex === index ? 'bg-accent-primary/10 border-accent-primary/30' : 'bg-white/5 border-white/10'}`}
                                     onClick={() => setActiveFollowUpIndex(index)}
                                >
                                    <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center text-white text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <HiOutlineCalendar className="w-4 h-4 text-accent-primary" />
                                            <span className="text-sm font-medium text-text-secondary">Day {strategy.day}</span>
                                        </div>
                                        <h3 className="text-lg font-medium text-text-primary mb-2">{strategy.angle}</h3>
                                        <p className="text-sm text-text-secondary mb-3">Subject: {strategy.subject}</p>
                                        <div className="bg-black/20 rounded-lg p-4 text-sm text-text-secondary">
                                            <pre className="whitespace-pre-wrap font-sans">{strategy.emailPreview}</pre>
                                        </div>
                                    </div>
                            </div>
                                  ))}
                               </div>
                     </div>
                     
                    {/* AI Tone Training Section */}
                    <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-lg shadow-black/20">
                        <h2 className="text-xl font-semibold flex items-center mb-6">
                            <HiOutlineAcademicCap className="w-6 h-6 mr-2 text-accent-warning" />
                            AI Tone Training Profiles
                        </h2>
                        <div className="space-y-4">
                            {toneProfiles.map((profile) => (
                                <div key={profile.id} 
                                     className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                         selectedToneProfile === profile.id 
                                             ? 'bg-accent-primary/10 border-accent-primary/30' 
                                             : 'bg-white/5 border-white/10 hover:bg-white/10'
                                     }`}
                                     onClick={() => setSelectedToneProfile(profile.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
                                                    {profile.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-text-primary">{profile.name}</h4>
                                                    <p className="text-sm text-text-muted">{profile.role}</p>
                                                </div>
                                            </div>
                                            <div className="ml-13">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {profile.toneCharacteristics.map((char, idx) => (
                                                        <span key={idx} className="text-xs px-2 py-1 bg-white/10 rounded-full text-text-secondary">
                                                            {char}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-text-muted italic">"{profile.samplePhrases[0]}"</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-green-400">{profile.successRate}%</p>
                                            <p className="text-xs text-text-muted">Success Rate</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <HiOutlineBeaker className="w-5 h-5 text-purple-400" />
                                <p className="text-sm font-semibold text-purple-400">AI Learning Mode Active</p>
                            </div>
                            <p className="text-xs text-text-secondary">
                                The AI continuously learns from successful interactions and adapts tone based on recipient engagement patterns.
                            </p>
                        </div>
                    </div>
                    
                    {/* Business Impact Section */}
                    <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-lg shadow-black/20">
                        <h2 className="text-xl font-semibold flex items-center mb-6">
                            <HiOutlineChartBar className="w-6 h-6 mr-2 text-green-500" />
                            Business Impact Metrics
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-text-muted mb-1">Pipeline Generated</p>
                                <p className="text-2xl font-bold text-green-400">$3.2M</p>
                                <p className="text-xs text-text-secondary mt-1">Last 90 days</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-text-muted mb-1">Meetings Booked</p>
                                <p className="text-2xl font-bold text-blue-400">142</p>
                                <p className="text-xs text-text-secondary mt-1">28% conversion</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-text-muted mb-1">Time Saved</p>
                                <p className="text-2xl font-bold text-purple-400">847 hrs</p>
                                <p className="text-xs text-text-secondary mt-1">Automated outreach</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-text-muted mb-1">Cost per Lead</p>
                                <p className="text-2xl font-bold text-orange-400">$12.40</p>
                                <p className="text-xs text-text-secondary mt-1">73% reduction</p>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-green-400">ROI on AI Implementation</p>
                                    <p className="text-xs text-text-secondary">Based on 6-month performance data</p>
                                </div>
                                <p className="text-3xl font-bold text-green-400">1,247%</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default EmailPage; 