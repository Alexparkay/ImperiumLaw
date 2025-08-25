import pandas as pd
import os

# Create directory for output
os.makedirs('output', exist_ok=True)

# Create main spreadsheet file
excel_file = 'output/PCBA_Import_Data.xlsx'
writer = pd.ExcelWriter(excel_file, engine='openpyxl')

# Define the structure for each sheet

# 1. Overview Sheet
overview_data = {
    'Category': [
        'Research Focus', 
        'Product Type', 
        'Import Countries', 
        'Annual Import Volume Range', 
        'Target Industries', 
        'Excluded Industries', 
        'Ideal Contact Roles',
        'Primary HTS Codes',
        'Data Sources Used'
    ],
    'Details': [
        'PCBA Import Data Research', 
        'Printed Circuit Board Assemblies (PCBAs), not bare boards (PCBs)',
        'China, Vietnam, Mexico, Canada',
        '$1 million – $10 million',
        'Medical, Oil & Gas, Metering, Green Energy, Aerospace',
        'Automotive, Lighting',
        'Buyer, Supply Chain Manager/Director',
        '8534.XX.XXXX, 8529.90.5500, 8549.XX.XXXX, 8548.XX.XXXX, 8517.62.XXXX, 8532.XX.XXXX, 8471.90.XXXX',
        'Descartes Datamyne, USITC Harmonized Tariff Schedule, International Trade Administration, ImportGenius'
    ]
}
overview_df = pd.DataFrame(overview_data)
overview_df.to_excel(writer, sheet_name='Overview', index=False)

# 2. HTS Codes Sheet
hts_data = {
    'HTS Code': [
        '8534.00.00.20', 
        '8534.00.00.40', 
        '8534.00.00.50', 
        '8534.00.00.70', 
        '8534.00.00.80', 
        '8534.00.00.85', 
        '8534.00.00.95',
        '8529.90.5500',
        '8517.62.00.10',
        '8517.62.00.20',
        '8517.62.00.90',
        '8532.10.00.00',
        '8532.21.00.20',
        '8532.21.00.40',
        '8532.21.00.50',
        '8532.21.00.80',
        '8532.22.00',
        '8548.00.00.00',
        '8549.11',
        '8471.90.00.00'
    ],
    'Description': [
        'Printed Circuits - With 3 or more layers of conducting materials',
        'Printed Circuits - Other',
        'Printed Circuits - Having a base wholly of impregnated paper',
        'Printed Circuits - Other',
        'Printed Circuits - Flexible type',
        'Printed Circuits - Other, having a ceramic base',
        'Printed Circuits - Other',
        'Flat panel screen assemblies for various display apparatus',
        'Modems used with data processing machines',
        'Switching and routing apparatus',
        'Other machines for reception, conversion and transmission',
        'Fixed capacitors for 50/60 Hz circuits',
        'Tantalum capacitors - Metal case',
        'Tantalum capacitors - Dipped',
        'Tantalum capacitors - Designed for surface mounting (SMD)',
        'Tantalum capacitors - Other',
        'Aluminum electrolytic capacitors',
        'Electrical parts of machinery or apparatus, not specified elsewhere',
        'Electrical and electronic waste and scrap',
        'Other units of automatic data processing machines'
    ],
    'Relevance to PCBAs': [
        'Primary HTS code for PCBAs with multiple layers',
        'Primary HTS code for simpler PCBAs',
        'PCBAs with paper-based substrate',
        'Other types of PCBAs',
        'Flexible PCBAs',
        'PCBAs with ceramic substrate',
        'Other PCBA types',
        'PCBAs for display technologies',
        'PCBAs for modem applications',
        'PCBAs for networking equipment',
        'PCBAs for other telecommunications equipment',
        'PCBAs with specific capacitor types',
        'PCBAs with tantalum capacitors in metal cases',
        'PCBAs with dipped tantalum capacitors',
        'PCBAs with surface-mount tantalum capacitors',
        'PCBAs with other tantalum capacitors',
        'PCBAs with aluminum electrolytic capacitors',
        'PCBAs classified as electrical parts',
        'PCBAs being imported for recycling/refurbishment',
        'PCBAs for data processing equipment'
    ]
}
hts_df = pd.DataFrame(hts_data)
hts_df.to_excel(writer, sheet_name='HTS Codes', index=False)

# 3. Top Importers Sheet
importers_data = {
    'Company Name': [
        'Continental Automotive Systems Inc',
        'Robert Bosch Corporation',
        'Samsung Electronics America Inc',
        'Panasonic Corporation',
        'Sumitronics Usa Inc',
        'Other US Importers (3134 total)'
    ],
    'Location': [
        'Arizona',
        'Texas',
        'California',
        'Texas',
        'California',
        'Various US locations'
    ],
    'HTS Codes Used': [
        '8534.XX.XXXX',
        '8534.XX.XXXX',
        '8534.XX.XXXX, 8529.90.5500',
        '8534.XX.XXXX, 8517.62.XXXX',
        '8534.XX.XXXX',
        'Various'
    ],
    'Potential Industry': [
        'Automotive (excluded from target)',
        'Multiple industries including Oil & Gas',
        'Multiple industries including Medical',
        'Multiple industries including Medical, Green Energy',
        'Multiple industries',
        'Various'
    ],
    'Notes': [
        'Major importer but primarily automotive sector',
        'Diversified technology company with presence in target industries',
        'Electronics manufacturer with healthcare division',
        'Diversified electronics with medical and energy divisions',
        'Electronics manufacturing services provider',
        'According to Descartes Datamyne, 3139 US importers used HTS 8534 in the last 12 months'
    ]
}
importers_df = pd.DataFrame(importers_data)
importers_df.to_excel(writer, sheet_name='Top Importers', index=False)

# 4. Top Suppliers Sheet
suppliers_data = {
    'Company Name': [
        'Suntan Technology Company Limited',
        'Wang Shuangjian',
        'Chin Poon Industrial Co Ltd',
        'Meiko Elec HK Co Ltd',
        'HT Circuits Ltd',
        'Other Suppliers (2856 total)'
    ],
    'Country': [
        'China',
        'China',
        'Taiwan',
        'Hong Kong/China',
        'China',
        'Various'
    ],
    'HTS Codes Used': [
        '8534.XX.XXXX',
        '8534.XX.XXXX',
        '8534.XX.XXXX',
        '8534.XX.XXXX',
        '8534.XX.XXXX',
        'Various'
    ],
    'Notes': [
        'Major supplier of electronic components including PCBAs',
        'Individual supplier or trading company',
        'PCB manufacturer with PCBA capabilities',
        'PCB and PCBA manufacturer',
        'Circuit board manufacturer',
        'According to Descartes Datamyne, 2861 suppliers to the US used HTS 8534 in the last 12 months'
    ]
}
suppliers_df = pd.DataFrame(suppliers_data)
suppliers_df.to_excel(writer, sheet_name='Top Suppliers', index=False)

# 5. Import by Country Sheet
country_data = {
    'Country': [
        'China',
        'Taiwan',
        'Japan',
        'Canada',
        'Korea, South',
        'Vietnam',
        'Mexico',
        'Other Countries'
    ],
    'Import Rank': [1, 2, 3, 4, 5, 'Not in top 5', 'Not in top 5', '-'],
    'Export Rank': [4, 'Not in top 5', 5, 3, 'Not in top 5', 'Not in top 5', 1, '-'],
    'Target Country': ['Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No'],
    'Notes': [
        'Primary source of PCBA imports',
        'Major electronics manufacturing hub',
        'High-tech electronics manufacturing',
        'Target country with significant trade',
        'Advanced electronics manufacturing',
        'Growing electronics manufacturing base',
        'Major destination for US exports',
        'Various other countries with smaller import/export volumes'
    ]
}
country_df = pd.DataFrame(country_data)
country_df.to_excel(writer, sheet_name='Import by Country', index=False)

# 6. Industry Applications Sheet
industry_data = {
    'Target Industry': [
        'Medical',
        'Medical',
        'Medical',
        'Oil & Gas',
        'Oil & Gas',
        'Oil & Gas',
        'Metering',
        'Metering',
        'Metering',
        'Green Energy',
        'Green Energy',
        'Green Energy',
        'Aerospace',
        'Aerospace',
        'Aerospace'
    ],
    'Application': [
        'Diagnostic imaging displays',
        'Patient monitoring systems',
        'Medical device control systems',
        'Field monitoring equipment',
        'Control systems for extraction equipment',
        'Sensing and measurement devices',
        'Smart meters',
        'Utility monitoring systems',
        'Precision measurement devices',
        'Solar inverter control systems',
        'Wind turbine monitoring',
        'Energy storage management',
        'Navigation systems',
        'Flight control systems',
        'Communication equipment'
    ],
    'Relevant HTS Codes': [
        '8529.90.5500',
        '8517.62.XXXX',
        '8534.XX.XXXX',
        '8517.62.XXXX',
        '8534.XX.XXXX',
        '8532.XX.XXXX',
        '8517.62.XXXX',
        '8534.XX.XXXX',
        '8532.XX.XXXX',
        '8534.XX.XXXX',
        '8517.62.XXXX',
        '8532.XX.XXXX',
        '8517.62.XXXX',
        '8534.XX.XXXX',
        '8517.62.XXXX'
    ],
    'Notes': [
        'Used in medical imaging equipment',
        'Used in vital signs monitors and medical telemetry',
        'Used in various medical devices and equipment',
        'Used in remote monitoring systems for oil fields',
        'Used in drilling and extraction equipment',
        'Used in precision measurement for oil & gas operations',
        'Used in advanced utility metering systems',
        'Used in grid monitoring and management',
        'Used in flow measurement and other precision applications',
        'Used in solar power conversion systems',
        'Used in wind turbine control and monitoring',
        'Used in battery management systems',
        'Used in aircraft and spacecraft navigation',
        'Used in aircraft control systems',
        'Used in aerospace communication systems'
    ]
}
industry_df = pd.DataFrame(industry_data)
industry_df.to_excel(writer, sheet_name='Industry Applications', index=False)

# 7. Data Limitations Sheet
limitations_data = {
    'Limitation Category': [
        'Volume-Specific Filtering',
        'Industry Classification',
        'Contact Information',
        'Data Recency',
        'Company Size Information'
    ],
    'Description': [
        'Cannot filter by specific import volume ranges ($1M-$10M) without premium database access',
        'HTS codes do not distinguish between industries (e.g., medical vs. automotive)',
        'Contact information for specific roles (Buyers, Supply Chain Managers) not available in public data',
        'Most recent complete data available is from 2020 in public sources',
        'Company size and annual revenue information limited in public data'
    ],
    'Recommendation': [
        'Purchase premium access to import/export databases like Descartes Datamyne or ImportGenius',
        'Use data enrichment services to add industry classifications to import data',
        'Use specialized B2B contact databases like ZoomInfo or D&B Hoovers',
        'Request custom data extract with most recent data from premium providers',
        'Combine import data with company information from business databases'
    ]
}
limitations_df = pd.DataFrame(limitations_data)
limitations_df.to_excel(writer, sheet_name='Data Limitations', index=False)

# 8. Recommendations Sheet
recommendations_data = {
    'Recommendation Category': [
        'Data Sources',
        'Data Sources',
        'Data Sources',
        'Contact Acquisition',
        'Contact Acquisition',
        'Contact Acquisition',
        'Industry Filtering',
        'Volume Filtering'
    ],
    'Recommendation': [
        'Purchase premium access to Descartes Datamyne',
        'Purchase premium access to ImportGenius',
        'Purchase premium access to Panjiva (S&P Global)',
        'Use ZoomInfo for targeted contact information',
        'Use LinkedIn Sales Navigator for role-specific contacts',
        'Contact industry associations in target sectors',
        'Use data enrichment services to add industry classifications',
        'Request custom data extract with volume filters from premium providers'
    ],
    'Details': [
        'Full subscription provides detailed company profiles and some contact information',
        'Premium access includes contact details for importers',
        'Offers comprehensive company profiles with contact information',
        'Specializes in B2B contact information including procurement roles',
        'Allows targeted searches for specific job titles and companies',
        'Industry associations often maintain member directories with contacts',
        'Third-party services can enrich import data with industry classifications',
        'Custom data requests can filter by specific import volume ranges'
    ]
}
recommendations_df = pd.DataFrame(recommendations_data)
recommendations_df.to_excel(writer, sheet_name='Recommendations', index=False)

# Save the Excel file
writer.close()

print(f"PCBA Import Data spreadsheet created successfully at {os.path.abspath(excel_file)}")
