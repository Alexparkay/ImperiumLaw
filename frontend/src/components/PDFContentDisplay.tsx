import React from 'react';

interface SearchCriteria {
  importFrom?: string;
  productCodes?: string;
  importVolume?: string;
  productType?: string;
  excludedIndustries?: string;
  targetIndustries?: string;
  idealContact?: string;
}

interface TableRow {
  companyName: string;
  headquarters: string;
  importCountries: string;
  productTypes: string;
  productCodes: string;
  annualImportVolume: string;
  industriesServed: string;
  contactTitle: string;
  website: string;
}

interface CompanyProfile {
  name: string;
  description: string;
}

interface ParsedData {
  searchCriteria: SearchCriteria;
  tableRows: TableRow[];
  profiles: CompanyProfile[];
}

// Basic parsing function (This will likely need refinement based on exact text nuances)
const parsePdfText = (text: string): ParsedData => {
  const lines = text.trim().split('\n');
  const data: ParsedData = {
    searchCriteria: {},
    tableRows: [],
    profiles: [],
  };

  let section = 'start'; // 'start', 'criteria', 'table-header', 'table-body', 'profiles-header', 'profiles-body', 'footer'
  let profileBuffer = { name: '', description: '' };

  const criteriaKeywords = [
      "Import Products from:",
      "Product Codes:",
      "Annual Import Volume:",
      "Product Type:",
      "Excluded Industries:",
      "Target Industries:",
      "Ideal Contact:"
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    if (line.includes('Search Criteria')) {
      section = 'criteria';
      continue;
    }
    if (line.includes('COMPANY NAME') && line.includes('HEADQUARTERS')) {
       section = 'table-body'; // Skip header row itself for data parsing
       continue;
    }
     if (line.includes('Company Profiles')) {
        section = 'profiles-header'; // Switch section
        continue;
     }
     if (line.includes('ICTC Electronic Customer Import Data - Generated')) {
         section = 'footer';
         continue;
     }


    switch (section) {
       case 'criteria':
            let matchedCriteria = false;
            for (const keyword of criteriaKeywords) {
                 if (line.startsWith(keyword)) {
                    const value = line.substring(keyword.length).trim();
                     if (keyword === "Import Products from:") data.searchCriteria.importFrom = value;
                     else if (keyword === "Product Codes:") data.searchCriteria.productCodes = value + (lines[i+1]?.trim().match(/^\d{4}/) ? '\n' + lines[++i].trim() : ''); // Check if next line continues codes
                     else if (keyword === "Annual Import Volume:") data.searchCriteria.importVolume = value;
                     else if (keyword === "Product Type:") data.searchCriteria.productType = value;
                     else if (keyword === "Excluded Industries:") data.searchCriteria.excludedIndustries = value;
                     else if (keyword === "Target Industries:") data.searchCriteria.targetIndustries = value;
                     else if (keyword === "Ideal Contact:") data.searchCriteria.idealContact = value;
                     matchedCriteria = true;
                     break;
                 }
             }
             // If it's in criteria section but not a keyword line, maybe append to previous line (e.g. product codes wrap)
             // This simple parser doesn't handle that well yet.
             break;


      case 'table-body':
        // Heuristic: Assume table rows are structured somewhat consistently
        // This needs a MUCH more robust parser for real-world data.
        // Trying a very naive split based on assumed columns. This WILL break easily.
        const parts = line.split(/\s{2,}/); // Split on 2+ spaces - highly unreliable
        if (parts.length >= 8) { // Expect at least 8 fields based on header
             // Extremely rough column assignment
             data.tableRows.push({
                 companyName: parts[0],
                 headquarters: parts[1] || 'USA', // Default guess
                 importCountries: parts[2] || '',
                 productTypes: parts[3] || 'PCBA', // Default guess
                 productCodes: parts[4] || '',
                 annualImportVolume: parts[5] || '',
                 industriesServed: parts[6] || '',
                 contactTitle: parts[7] || '',
                 website: parts[parts.length - 1].startsWith('www.') ? parts[parts.length - 1] : '', // Guess website is last
             });
        } else if (line.includes('.com') || line.includes('.net') || line.includes('n/a')) {
             // Maybe it's a continuation line or just the website/n/a? Ignore for now.
        } else if (data.tableRows.length > 0 && !criteriaKeywords.some(k => line.startsWith(k)) && !line.includes('Company Profiles')) {
            // If it looks like it might be a continuation of product codes or industries
            const lastRow = data.tableRows[data.tableRows.length - 1];
             if (lastRow && line.match(/^\d{4}\./)) { // Looks like product codes
                 lastRow.productCodes += `\n${line}`;
             } else if (lastRow && lastRow.industriesServed && !lastRow.industriesServed.endsWith(',')) {
                 // maybe industries wrap? Very weak guess.
                 // lastRow.industriesServed += ` ${line}`;
             }
        }
        break;

      case 'profiles-header':
          section = 'profiles-body'; // Move to parsing profiles after header
          // Fallthrough intended if first profile starts on same line
      case 'profiles-body':
          // Heuristic: Company name is likely a shorter line, description follows.
          // This is also very brittle.
          const nextLine = lines[i+1]?.trim();

          // If the line seems short and the next line is longer, assume Name + Description
          if (line.length < 50 && nextLine && nextLine.length > 10 && !nextLine.includes('Generated on')) {
                data.profiles.push({ name: line, description: nextLine });
                i++; // Skip the next line as it was consumed as description
          } else if (line.length < 50 && !nextLine) {
               // Maybe a name with no description provided?
               data.profiles.push({ name: line, description: '' });
          }
          // Otherwise, likely part of a multi-line description or noise - ignore for now.
          break;
       case 'footer':
            // Ignore footer lines for now
            break;
    }
  }

    // Simple cleanup attempt for table parsing issues
    data.tableRows = data.tableRows.filter(row => row.companyName && row.headquarters && row.companyName !== row.headquarters);
    // Attempt to fix common parsing errors like merging company name/HQ
     data.tableRows.forEach(row => {
         if (row.companyName.endsWith("USA")) {
            row.headquarters = "USA";
            row.companyName = row.companyName.replace("USA", "").trim();
         }
         // Add more cleanup rules as needed
     });


  return data;
};


const PDFContentDisplay: React.FC<{ rawText: string }> = ({ rawText }) => {
  const { searchCriteria, tableRows, profiles } = parsePdfText(rawText);

  // Helper to render text or placeholder
   const renderText = (text: string | undefined) => text || <span className="text-gray-400 italic">N/A</span>;

   // Helper to render multiline text (like product codes)
    const renderMultilineText = (text: string | undefined) => {
        if (!text) return renderText(text);
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };


  return (
    <div className="p-6 bg-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-6 text-center">
        <h1 className="text-2xl font-bold">ICTC Electronic Customer Import Data</h1>
      </div>

      {/* Search Criteria */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Search Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
           <div><strong className="font-medium text-gray-600">Import Products from:</strong> {renderText(searchCriteria.importFrom)}</div>
           <div><strong className="font-medium text-gray-600">Excluded Industries:</strong> {renderText(searchCriteria.excludedIndustries)}</div>
           <div className="md:col-span-2"><strong className="font-medium text-gray-600">Product Codes:</strong> {renderMultilineText(searchCriteria.productCodes)}</div>
           <div><strong className="font-medium text-gray-600">Target Industries:</strong> {renderText(searchCriteria.targetIndustries)}</div>
           <div><strong className="font-medium text-gray-600">Annual Import Volume:</strong> {renderText(searchCriteria.importVolume)}</div>
           <div><strong className="font-medium text-gray-600">Ideal Contact:</strong> {renderText(searchCriteria.idealContact)}</div>
           <div className="md:col-span-2"><strong className="font-medium text-gray-600">Product Type:</strong> {renderText(searchCriteria.productType)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Countries</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Types</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Codes</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Import Vol</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industries Served</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{renderText(row.companyName)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{renderText(row.headquarters)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{renderText(row.importCountries)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{renderText(row.productTypes)}</td>
                <td className="px-4 py-2 text-gray-600 min-w-[150px]">{renderMultilineText(row.productCodes)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{renderText(row.annualImportVolume)}</td>
                <td className="px-4 py-2 text-gray-600 min-w-[150px]">{renderText(row.industriesServed)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{renderText(row.contactTitle)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-blue-600 hover:underline">
                    {row.website ? <a href={`http://${row.website}`} target="_blank" rel="noopener noreferrer">{row.website}</a> : renderText(undefined)}
                </td>
              </tr>
            ))}
             {tableRows.length === 0 && (
                <tr><td colSpan={9} className="text-center py-4 text-gray-500">Could not parse table data.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Company Profiles */}
      <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Company Profiles</h2>
          {profiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.map((profile, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                          <h3 className="text-base font-semibold text-blue-700 mb-1">{renderText(profile.name)}</h3>
                          <p className="text-sm text-gray-600">{renderText(profile.description)}</p>
                      </div>
                  ))}
              </div>
          ) : (
               <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500">Could not parse profile data.</div>
          )}
      </div>

       {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-4">
            ICTC Electronic Customer Import Data - Generated on April 8, 2025<br />
            Optimized for single-page PDF export (Replicated Layout)
        </div>

    </div>
  );
};

export default PDFContentDisplay; 