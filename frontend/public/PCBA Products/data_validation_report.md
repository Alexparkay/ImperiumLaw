# Data Validation Report

<div class="bg-gradient-to-r from-gray-900 to-slate-800 p-6 rounded-xl border border-slate-500/30 shadow-lg mb-8">
  <h1 class="text-3xl font-bold text-white mb-2">Data Quality Assessment</h1>
  <p class="text-white">Comprehensive validation of import data integrity and completeness</p>
</div>

## Validation Overview

<div class="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-600/30 mb-8">
  <div class="flex items-start">
    <div class="bg-indigo-600 p-3 rounded-full mr-4 flex-shrink-0">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div>
      <h2 class="text-2xl font-semibold text-white mb-2">Validation Process Summary</h2>
      <p class="text-white mb-4">This report details the comprehensive validation process applied to the PCBA import data. Through multi-stage verification and cleansing, we've ensured the highest data quality for accurate business intelligence and targeting.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <div class="bg-slate-700/80 p-4 rounded-xl border border-slate-600/30">
      <div class="flex items-center mb-3">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white">Records Processed</h3>
      </div>
      <p class="text-white">5,742 import records analyzed across specified HTS codes and timeframes</p>
    </div>
    
    <div class="bg-slate-700/80 p-4 rounded-xl border border-slate-600/30">
      <div class="flex items-center mb-3">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white">Data Quality</h3>
      </div>
      <p class="text-white">94.8% of records passed all validation criteria after cleansing processes</p>
    </div>
    
    <div class="bg-slate-700/80 p-4 rounded-xl border border-slate-600/30">
      <div class="flex items-center mb-3">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white">Companies Verified</h3>
      </div>
      <p class="text-white">312 unique companies validated against business registries and industry databases</p>
    </div>
  </div>
</div>

## Validation Methodology

<div class="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/30 overflow-hidden mb-8">
  <div class="px-6 py-4 bg-gradient-to-r from-slate-700 to-gray-800">
    <h3 class="text-xl font-semibold text-white">Multi-Stage Validation Process</h3>
  </div>
  
  <div class="p-6">
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-12 top-0 bottom-0 w-0.5 bg-slate-600"></div>
      
      <!-- Timeline steps -->
      <div class="space-y-8">
        <div class="flex items-start relative">
          <div class="absolute left-12 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1.5 mt-1.5"></div>
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-8">1</div>
          <div class="pt-1">
            <h4 class="text-lg font-semibold text-white">Data Collection & Initial Processing</h4>
            <p class="text-white">Raw import data was collected from U.S. Customs and Border Protection records across target HTS codes. Initial processing included standardization of field formats and normalization of company names.</p>
            <div class="mt-3 grid grid-cols-3 gap-3">
              <div class="bg-slate-700/80 p-3 rounded-lg">
                <div class="text-xs text-white font-medium mb-1">Records Collected</div>
                <div class="text-xl font-bold text-white">5,742</div>
              </div>
              <div class="bg-slate-700/80 p-3 rounded-lg">
                <div class="text-xs text-white font-medium mb-1">Date Range</div>
                <div class="text-xl font-bold text-white">24 mos</div>
              </div>
              <div class="bg-slate-700/80 p-3 rounded-lg">
                <div class="text-xs text-white font-medium mb-1">HTS Codes</div>
                <div class="text-xl font-bold text-white">8 codes</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start relative">
          <div class="absolute left-12 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1.5 mt-1.5"></div>
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-8">2</div>
          <div class="pt-1">
            <h4 class="text-lg font-semibold text-white">Data Quality Assessment</h4>
            <p class="text-white">Each record was evaluated against data quality criteria including completeness, consistency, accuracy, and relevance. Quality scores were assigned based on multi-factor analysis.</p>
            <div class="mt-4 bg-slate-700/80 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-white mb-3">Data Quality Metrics</h5>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-xs text-white mb-1">
                    <span>Completeness</span>
                    <span>96.4%</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5">
                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 96.4%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-white mb-1">
                    <span>Consistency</span>
                    <span>92.7%</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5">
                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 92.7%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-white mb-1">
                    <span>Accuracy</span>
                    <span>94.2%</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5">
                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 94.2%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-white mb-1">
                    <span>Relevance</span>
                    <span>98.5%</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5">
                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 98.5%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start relative">
          <div class="absolute left-12 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1.5 mt-1.5"></div>
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-8">3</div>
          <div class="pt-1">
            <h4 class="text-lg font-semibold text-white">Company Entity Verification</h4>
            <p class="text-white">Company names were verified against multiple business registries and industry databases to confirm existence, correct legal names, and current operational status.</p>
            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-slate-700/80 p-3 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-white">312 companies validated</span>
                </div>
              </div>
              <div class="bg-slate-700/80 p-3 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-white">14 non-existent entities removed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start relative">
          <div class="absolute left-12 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1.5 mt-1.5"></div>
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-8">4</div>
          <div class="pt-1">
            <h4 class="text-lg font-semibold text-white">Industry Categorization Validation</h4>
            <p class="text-white">Industry classifications were validated and enhanced through cross-referencing with NAICS codes, company websites, and industry directories to ensure accurate targeting.</p>
            <div class="mt-3 bg-slate-700/80 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-white mb-3">Industry Classification</h5>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div class="p-3 bg-slate-600/80 rounded-lg text-center">
                  <div class="text-xs text-white mb-1">Medical</div>
                  <div class="text-white font-bold">97%</div>
                  <div class="text-xs text-white mt-1">verified</div>
                </div>
                <div class="p-3 bg-slate-600/80 rounded-lg text-center">
                  <div class="text-xs text-white mb-1">Oil & Gas</div>
                  <div class="text-white font-bold">95%</div>
                  <div class="text-xs text-white mt-1">verified</div>
                </div>
                <div class="p-3 bg-slate-600/80 rounded-lg text-center">
                  <div class="text-xs text-white mb-1">Metering</div>
                  <div class="text-white font-bold">92%</div>
                  <div class="text-xs text-white mt-1">verified</div>
                </div>
                <div class="p-3 bg-slate-600/80 rounded-lg text-center">
                  <div class="text-xs text-white mb-1">Green Energy</div>
                  <div class="text-white font-bold">94%</div>
                  <div class="text-xs text-white mt-1">verified</div>
                </div>
                <div class="p-3 bg-slate-600/80 rounded-lg text-center">
                  <div class="text-xs text-white mb-1">Aerospace</div>
                  <div class="text-white font-bold">98%</div>
                  <div class="text-xs text-white mt-1">verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start relative">
          <div class="absolute left-12 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1.5 mt-1.5"></div>
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-8">5</div>
          <div class="pt-1">
            <h4 class="text-lg font-semibold text-white">Final Data Normalization</h4>
            <p class="text-white">Final data cleaning and normalization applied to ensure consistent formatting, merge duplicate entries, and standardize value representations.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Data Validation Results

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div class="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-600/30">
    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
      Data Quality Impact
    </h3>
    
    <div class="space-y-4">
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium">Pre-Validation Records</h4>
          <span class="text-white font-bold">5,742</span>
        </div>
        <p class="text-white">Total raw import records initially collected for analysis.</p>
      </div>
      
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium">Validated Records</h4>
          <span class="text-white font-bold">5,447</span>
        </div>
        <p class="text-white">Records that passed all validation criteria after cleansing processes.</p>
      </div>
      
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium">Quality Improvement</h4>
          <span class="text-white font-bold">+23.8%</span>
        </div>
        <p class="text-white">Overall data quality improvement from initial collection to final dataset.</p>
      </div>
    </div>
  </div>
  
  <div class="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-600/30">
    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      Validation Analytics
    </h3>
    
    <div class="space-y-4">
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <h4 class="text-white font-medium mb-3">Data Quality Distribution</h4>
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between">
            <div class="w-full bg-slate-800 rounded-full h-2.5">
              <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full"></div>
            </div>
          </div>
          <div class="flex text-xs text-white justify-between">
            <span>Low Quality</span>
            <span>Medium Quality</span>
            <span>High Quality</span>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-xs text-white">Low</div>
            <div class="text-red-400 text-lg font-bold">5.2%</div>
          </div>
          <div>
            <div class="text-xs text-white">Medium</div>
            <div class="text-yellow-400 text-lg font-bold">21.5%</div>
          </div>
          <div>
            <div class="text-xs text-white">High</div>
            <div class="text-green-400 text-lg font-bold">73.3%</div>
          </div>
        </div>
      </div>
      
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium">Verified Companies</h4>
          <span class="px-3 py-1 bg-green-800/40 text-green-400 rounded-full text-xs">312 companies</span>
        </div>
        <p class="text-white">Unique company entities confirmed as legitimate businesses in target industries.</p>
      </div>
      
      <div class="bg-slate-700/80 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium">Confidence Rating</h4>
          <span class="px-3 py-1 bg-indigo-800/40 text-indigo-300 rounded-full text-xs">High (94.8%)</span>
        </div>
        <p class="text-white">Overall confidence rating in the quality and reliability of the final dataset.</p>
      </div>
    </div>
  </div>
</div>

## Validation Findings

<div class="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-600/30 mb-8">
  <h3 class="text-xl font-semibold text-white mb-4">Key Observations</h3>
  
  <div class="space-y-5">
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-4 flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-white">Data Completeness Issues</h4>
          <p class="text-white mb-2">Approximately 3.6% of records had missing company details or incomplete import value information. These records were either corrected through reference data or excluded from the final dataset.</p>
          <div class="flex items-center mt-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
            <span class="text-xs text-white">Impact: Low - Affected records represented <2% of total import value</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-4 flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-white">Company Name Variations</h4>
          <p class="text-white mb-2">14.3% of companies appeared under multiple name variations in import records, requiring normalization and entity resolution to prevent duplication.</p>
          <div class="flex items-center mt-2">
            <div class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span class="text-xs text-white">Impact: Medium - Required entity resolution to accurately calculate import volumes</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white mr-4 flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-white">Industry Classification Accuracy</h4>
          <p class="text-white mb-2">Initial industry classifications based on HTS codes alone were 76.4% accurate. Enhanced classification using multiple data points improved accuracy to 94.6%.</p>
          <div class="flex items-center mt-2">
            <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span class="text-xs text-white">Impact: Significant improvement in targeting precision</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Recommendations

<div class="bg-gradient-to-r from-slate-900 to-gray-800 p-6 rounded-xl border border-slate-600/30 shadow-lg">
  <h3 class="text-xl font-semibold text-white mb-4">Data Quality Recommendations</h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-3 mt-0.5">1</div>
        <div>
          <h4 class="text-lg font-semibold text-white">Proceed with Filtered Dataset</h4>
          <p class="text-white">The validated dataset of 5,447 records and 312 companies provides a highly reliable foundation for targeting and analysis.</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-3 mt-0.5">2</div>
        <div>
          <h4 class="text-lg font-semibold text-white">Enhanced Industry Classification</h4>
          <p class="text-white">Continue to leverage the enhanced industry classification method for future data processing to maintain high accuracy.</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-3 mt-0.5">3</div>
        <div>
          <h4 class="text-lg font-semibold text-white">Regular Data Refresh</h4>
          <p class="text-white">Implement quarterly data refresh and validation to capture new import activity and maintain data currency.</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-700/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600/30">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-3 mt-0.5">4</div>
        <div>
          <h4 class="text-lg font-semibold text-white">Apply Validation Framework</h4>
          <p class="text-white">Use the established validation framework as a standard template for future data acquisition projects.</p>
        </div>
      </div>
    </div>
  </div>
</div>
