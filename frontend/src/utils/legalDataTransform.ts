// Legal data transformation utilities

export interface LegalCaseRow {
  [key: string]: string | number | undefined;
}

// Column mapping from CSV to display columns
export const legalColumnMapping: { [csvColumn: string]: string } = {
  'Docket': 'Docket #',
  'Title': 'Case Name',
  'Court': 'Court',
  'Nature of Suit / Type': 'Case Type',
  'Date - Case first started': 'Filing Date',
  'Case Duration (Days)': 'Duration (Days)',
  'Party Name': 'Parties',
  'Party Type': 'Party Type',
  'Attorney Name': 'Attorney',
  'Law Firm': 'Law Firm',
  'Judge': 'Judge',
  'Status': 'Status',
  'Last Updated - When Court Case Finished': 'Last Updated',
  'Original loan amount': 'Original Loan',
  'Outstanding debt at filing (principal)': 'Outstanding Debt',
  'Debt ratio (Outstanding ÷ Original)': 'Debt Ratio',
  'First Name': 'Contact First Name',
  'Last Name': 'Contact Last Name',
  'Job Title': 'Contact Title',
  'Linkedin Url': 'LinkedIn',
  'All Relevant Documents associated with Case': 'Documentation'
};

// Transform CSV data to legal case format
export function transformLegalData(csvData: LegalCaseRow[]): LegalCaseRow[] {
  return csvData.map(row => {
    // Create transformed row with mapped column names
    const transformedRow: LegalCaseRow = {};
    
    // Map original columns to new names
    Object.entries(legalColumnMapping).forEach(([csvKey, displayKey]) => {
      if (row[csvKey] !== undefined) {
        transformedRow[displayKey] = row[csvKey];
      }
    });
    
    // Add calculated fields
    const timeTook = parseInt(String(row['Case Duration (Days)'] || 0));
    const timeProposed = Math.floor(timeTook * 0.6); // Propose 40% faster resolution
    
    // Calculate efficiency
    if (timeTook > 0 && timeProposed > 0) {
      transformedRow['Efficiency %'] = Math.round(((timeTook - timeProposed) / timeTook) * 100);
      transformedRow['Savings (Days)'] = timeTook - timeProposed;
      transformedRow['Our Timeline'] = timeProposed;
    } else {
      transformedRow['Efficiency %'] = 0;
      transformedRow['Savings (Days)'] = 0;
      transformedRow['Our Timeline'] = 0;
    }
    
    // Use the status from CSV if available, otherwise determine based on duration
    if (!transformedRow['Status']) {
      if (timeTook > 365) {
        transformedRow['Status'] = 'Extended';
      } else if (timeTook > 180) {
        transformedRow['Status'] = 'Standard';
      } else {
        transformedRow['Status'] = 'Expedited';
      }
    }
    
    // Format filing date
    if (row['Date - Case first started']) {
      try {
        const date = new Date(row['Date - Case first started']);
        transformedRow['Filing Date'] = date.toLocaleDateString('en-US');
      } catch (e) {
        transformedRow['Filing Date'] = row['Date - Case first started'];
      }
    }
    
    // Format loan amounts
    if (row['Original loan amount']) {
      const amount = parseFloat(String(row['Original loan amount']).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(amount)) {
        transformedRow['Original Loan'] = `$${amount.toLocaleString()}`;
      }
    }
    
    if (row['Outstanding debt at filing (principal)']) {
      const amount = parseFloat(String(row['Outstanding debt at filing (principal)']).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(amount)) {
        transformedRow['Outstanding Debt'] = `$${amount.toLocaleString()}`;
      }
    }
    
    // Format debt ratio as percentage
    if (row['Debt ratio (Outstanding ÷ Original)']) {
      const ratio = parseFloat(String(row['Debt ratio (Outstanding ÷ Original)']));
      if (!isNaN(ratio)) {
        transformedRow['Debt Ratio'] = `${(ratio * 100).toFixed(1)}%`;
      }
    }
    
    return transformedRow;
  });
}

// Get legal case headers in the correct order
export function getLegalHeaders(): string[] {
  return [
    'Docket #',
    'Case Name',
    'Court',
    'Case Type',
    'Filing Date',
    'Last Updated',
    'Duration (Days)',
    'Our Timeline',
    'Efficiency %',
    'Savings (Days)',
    'Status',
    'Judge',
    'Parties',
    'Party Type',
    'Attorney',
    'Law Firm',
    'Original Loan',
    'Outstanding Debt',
    'Debt Ratio',
    'Contact First Name',
    'Contact Last Name',
    'Contact Title',
    'LinkedIn',
    'Documentation'
  ];
}

// Format duration for display
export function formatDuration(days: number | string): string {
  const numDays = typeof days === 'string' ? parseInt(days) : days;
  if (isNaN(numDays)) return 'N/A';
  
  if (numDays < 30) {
    return `${numDays} days`;
  } else if (numDays < 365) {
    const months = Math.floor(numDays / 30);
    const remainingDays = numDays % 30;
    return remainingDays > 0 ? `${months}m ${remainingDays}d` : `${months} months`;
  } else {
    const years = Math.floor(numDays / 365);
    const remainingDays = numDays % 365;
    const months = Math.floor(remainingDays / 30);
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  }
}

// Get status color class
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'Expedited':
      return 'text-green-600 bg-green-50';
    case 'Standard':
      return 'text-blue-600 bg-blue-50';
    case 'Extended':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Get efficiency color class
export function getEfficiencyColorClass(efficiency: number): string {
  if (efficiency >= 30) {
    return 'text-green-600';
  } else if (efficiency >= 15) {
    return 'text-blue-600';
  } else if (efficiency > 0) {
    return 'text-orange-600';
  } else {
    return 'text-gray-600';
  }
}