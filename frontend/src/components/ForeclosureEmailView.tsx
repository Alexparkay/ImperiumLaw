import React, { useState, useMemo } from 'react';
import { 
  HiOutlineEnvelope, 
  HiOutlineEye, 
  HiOutlinePaperAirplane,
  HiOutlineDocumentDuplicate,
  HiOutlineMagnifyingGlass as HiOutlineSearch,
  HiOutlineFunnel as HiOutlineFilter,
  HiOutlineChevronRight,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

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

interface ForeclosureEmailViewProps {
  dataSet: DataSet;
  isLoading: boolean;
}

const ForeclosureEmailView: React.FC<ForeclosureEmailViewProps> = ({ dataSet, isLoading }) => {
  const [selectedEmail, setSelectedEmail] = useState<CsvRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'hasEmail' | 'noEmail'>('hasEmail');

  // Process emails from the data
  const emailData = useMemo(() => {
    if (!dataSet.data || dataSet.data.length === 0) return [];
    
    return dataSet.data
      .map((row, index) => ({
        id: String(index),
        email: row['Foreclosure Outreach Email'] || '',
        recipientName: row['Foreclosure Legal Contact'] || 'N/A',
        caseTitle: row['Title'] || 'N/A',
        docket: row['Docket'] || 'N/A',
        court: row['Court'] || 'N/A',
        attorney: row['Attorney Name'] || 'N/A',
        lawFirm: row['Law Firm'] || 'N/A',
        partyName: row['Party Name'] || 'N/A',
        firstName: row['First Name'] || '',
        lastName: row['Last Name'] || '',
        jobTitle: row['Job Title'] || '',
        originalRow: row
      }))
      .filter(item => {
        // Apply filter
        if (filterBy === 'hasEmail' && !item.email) return false;
        if (filterBy === 'noEmail' && item.email) return false;
        
        // Apply search
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          return (
            item.email.toLowerCase().includes(search) ||
            item.recipientName.toLowerCase().includes(search) ||
            item.caseTitle.toLowerCase().includes(search) ||
            item.attorney.toLowerCase().includes(search) ||
            item.lawFirm.toLowerCase().includes(search)
          );
        }
        
        return true;
      });
  }, [dataSet.data, filterBy, searchTerm]);

  const statsData = useMemo(() => {
    const total = dataSet.data?.length || 0;
    const withEmail = dataSet.data?.filter(row => row['Foreclosure Outreach Email'])?.length || 0;
    const uniqueRecipients = new Set(dataSet.data?.map(row => row['Foreclosure Legal Contact']).filter(Boolean)).size;
    
    return {
      total,
      withEmail,
      withoutEmail: total - withEmail,
      uniqueRecipients
    };
  }, [dataSet.data]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard!');
  };

  const handleCopyAll = () => {
    const emails = emailData
      .filter(item => item.email)
      .map(item => item.email)
      .join('\n\n---\n\n');
    
    navigator.clipboard.writeText(emails);
    toast.success(`${emailData.filter(item => item.email).length} emails copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="flex flex-col items-center">
          <span className="loading loading-ball loading-lg text-accent-primary mb-4"></span>
          <p className="text-text-muted">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text-primary flex items-center">
          <HiOutlineEnvelope className="w-8 h-8 mr-3 text-accent-primary" />
          Foreclosure Outreach Emails
        </h2>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary/20 transition-colors duration-200"
        >
          <HiOutlineDocumentDuplicate className="w-4 h-4" />
          Copy All Emails
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <p className="text-text-muted text-sm">Total Cases</p>
          <p className="text-2xl font-bold text-text-primary">{statsData.total}</p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <p className="text-text-muted text-sm">With Email Templates</p>
          <p className="text-2xl font-bold text-green-400">{statsData.withEmail}</p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <p className="text-text-muted text-sm">Without Emails</p>
          <p className="text-2xl font-bold text-orange-400">{statsData.withoutEmail}</p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <p className="text-text-muted text-sm">Unique Recipients</p>
          <p className="text-2xl font-bold text-blue-400">{statsData.uniqueRecipients}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search emails, recipients, or cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterBy('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterBy === 'all' 
                ? 'bg-accent-primary text-white' 
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            All Cases
          </button>
          <button
            onClick={() => setFilterBy('hasEmail')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterBy === 'hasEmail' 
                ? 'bg-accent-primary text-white' 
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            With Emails
          </button>
          <button
            onClick={() => setFilterBy('noEmail')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterBy === 'noEmail' 
                ? 'bg-accent-primary text-white' 
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            Without Emails
          </button>
        </div>
      </div>

      {/* Email List and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email List */}
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-semibold text-text-primary">Email Templates ({emailData.length})</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {emailData.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                No emails found matching your criteria.
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {emailData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                      selectedEmail?.id === item.id ? 'bg-accent-primary/10' : ''
                    }`}
                    onClick={() => setSelectedEmail(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">
                          {item.recipientName || 'No Recipient'}
                        </h4>
                        <p className="text-sm text-text-secondary mt-1">
                          {item.caseTitle.length > 50 
                            ? item.caseTitle.substring(0, 50) + '...' 
                            : item.caseTitle}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <span>{item.attorney}</span>
                          <span>•</span>
                          <span>{item.docket}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.email ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                            Has Email
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                            No Email
                          </span>
                        )}
                        <HiOutlineChevronRight className="w-4 h-4 text-text-muted" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <HiOutlineEye className="w-5 h-5 mr-2" />
              Email Preview
            </h3>
          </div>
          <div className="p-6">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Email Metadata */}
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Recipient:</span>
                    <span className="text-sm text-text-primary font-medium">
                      {selectedEmail.firstName} {selectedEmail.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Title:</span>
                    <span className="text-sm text-text-primary">{selectedEmail.jobTitle || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Law Firm:</span>
                    <span className="text-sm text-text-primary">{selectedEmail.lawFirm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Case:</span>
                    <span className="text-sm text-text-primary">{selectedEmail.docket}</span>
                  </div>
                </div>

                {/* Email Content */}
                {selectedEmail.email ? (
                  <>
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-semibold text-text-primary mb-3">Email Content:</h4>
                      <div className="bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap text-sm text-text-secondary leading-relaxed">
                        {selectedEmail.email}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleCopyEmail(selectedEmail.email)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                      >
                        <HiOutlineDocumentDuplicate className="w-4 h-4" />
                        Copy Email
                      </button>
                      <button
                        onClick={() => {
                          const subject = encodeURIComponent(`Re: ${selectedEmail.caseTitle}`);
                          const body = encodeURIComponent(selectedEmail.email);
                          window.location.href = `mailto:?subject=${subject}&body=${body}`;
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <HiOutlinePaperAirplane className="w-4 h-4" />
                        Send Email
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <HiOutlineInformationCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No email template available for this case.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                <HiOutlineEnvelope className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Select an email from the list to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeclosureEmailView;