import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLayout } from '../context/LayoutContext';
import PDFContentDisplay from '../components/PDFContentDisplay';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2';
import { FiMaximize2, FiCopy, FiX } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import Papa from 'papaparse';
import toast from 'react-hot-toast'; // For copy feedback

// Add type declarations for the modules
declare module 'react-syntax-highlighter';
declare module 'react-syntax-highlighter/dist/esm/styles/prism';

// Define interfaces for different file types
interface BaseFileInfo {
  name: string; // Tab name
  filePath: string; // Path relative to /public or identifier
  type: 'markdown' | 'static-content' | 'html-content' | 'csv-content'; // Added 'csv-content'
}

interface MarkdownData extends BaseFileInfo {
  type: 'markdown';
  content: string | null; // Fetched markdown content
  isLoading: boolean;
  error: string | null;
}

// Interface for the static PDF text content (kept for potential future use?)
interface StaticContentData extends BaseFileInfo {
    type: 'static-content';
    rawText: string; // Store the raw text here
}

// Interface for static HTML content
interface HTMLContentData extends BaseFileInfo {
    type: 'html-content';
    htmlContent: string; // Store the HTML string here
}

// Add CsvRow interface for the spreadsheet data
interface CsvRow {
  [key: string]: string; // Allows any string keys
}

// Add new interface for CSV data
interface CsvData extends BaseFileInfo {
  type: 'csv-content';
  data: CsvRow[];
  headers: string[];
  isLoading: boolean;
  error: string | null;
}

// Update FileConfig type to include the new CsvData interface
type FileConfig = MarkdownData | StaticContentData | HTMLContentData | CsvData;

// Raw text from the PDF (kept for reference, but not used for slide 8 anymore)
const pdfRawText = `ICTC Electronic Customer Import Data
Search Criteria
Import Products from: China, Vietnam, Mexico, Canada
Product Codes: 8534.XX.XXXX, 8529.90.5500, 8534.XX.XXXX, 8549.XX.XXXX, 8548.XX.XXXX, 8517.62.XXXX,
8532.XX.XXXX, 8471.90.XXXX
Annual Import Volume: $1 million – $10 million
Product Type: PCBA (Printed Circuit Board Assemblies), not bare boards (PCB)
Excluded Industries: Automotive, Lighting
Target Industries: Medical, Oil & Gas, Metering, Green Energy, Aerospace
Ideal Contact: Buyer, Supply Chain Manager/Director
COMPANY NAME HEADQUARTERS IMPORT COUNTRIES PRODUCT TYPES PRODUCT CODES ANNUAL IMPORT VOLUME INDUSTRIES SERVED CONTACT TITLE WEBSITE
Sanmina Corporation USA China, Mexico PCBA 8534.00.0000, 8529.90.5500,
8517.62.0000 $5-10 million Medical, Aerospace, Green
Energy
Supply Chain Director www.sanmina.com
Express Manufacturing Inc.
(EMI) USA China, Mexico PCBA 8534.00.0000, 8532.00.0000 $3-7 million Medical, Green Energy Buyer www.eminc.com
FS Technology USA China PCBA 8534.00.0000, 8548.00.0000 $1-5 million Medical Supply Chain Manager www.fs-pcba.com
Topscom PCB Assembly USA China PCBA 8534.00.0000, 8549.00.0000,
8532.00.0000 $2-6 million Oil & Gas, Metering Buyer www.topscompcbassembly.com
Murrietta Circuits USA Mexico, China PCBA 8534.00.0000, 8529.90.5500 $2-8 million Energy, Medical, Aerospace Supply Chain Director www.murrietta.com
Creative Hi-Tech USA China, Vietnam PCBA 8534.00.0000, 8548.00.0000,
8517.62.0000 $1-4 million Energy, Medical, Aerospace Supply Chain Manager www.creativehitech.com
Viasion Technology USA China PCBA 8534.00.0000, 8471.90.0000 $1-3 million Medical Buyer www.viasion.com
PCBMay USA China PCBA 8534.00.0000, 8532.00.0000 $1-4 million Metering, Green Energy Supply Chain Manager www.pcbmay.com
Premier Manufacturing USA Mexico, Canada PCBA 8534.00.0000, 8532.00.0000,
8471.90.0000 $2-5 million Aerospace, Energy Supply Chain Director www.pmscs.com
Meritek EMS USA China, Vietnam PCBA 8534.00.0000, 8549.00.0000,
8517.62.0000 $3-8 million Medical, Oil & Gas Buyer www.meritekems.com
TTM Technologies USA China, Canada PCBA 8534.00.0000, 8532.00.0000,
8517.62.0000 $5-10 million Medical, Aerospace Supply Chain Director www.ttm.com
All Flex Solutions USA Mexico, China PCBA 8534.00.0000, 8548.00.0000 $1-5 million Medical Buyer www.allflexinc.com
Logwell Technology USA China PCBA 8471.90.0000, 8534.00.0000 $1-3 million Medical, Green Energy Supply Chain Manager n/a
PCB Connect Group USA China, Vietnam PCBA 8534.00.0000, 8548.00.0000 $2-7 million Energy, Medical Supply Chain Director www.pcbconnectgroup.com
POE PCBA USA China PCBA 8534.00.0000, 8529.90.5500 $1-4 million Green Energy Buyer www.poe-pcba.com
Company Profiles
Sanmina Corporation
Global electronics manufacturing services provider specializing in complex PCB assemblies for various industries
including medical devices and aerospace applications.
Express Manufacturing Inc. (EMI)
EMS provider offering fast, reliable contract manufacturing for OEMs, specializing in precision electronics for
medical and energy sectors.
FS Technology
ISO 13485 certified company for medical PCB manufacturing and assembly with competitively priced production
services.
Topscom PCB Assembly
Specialist in energy and metering PCB assembly, with experience serving over 120 utilities and supporting AMR
technology integration.
Murrietta Circuits
Vertically integrated company offering complete turnkey PCB assembly for critical industries including energy,
space, medical and defense.
Creative Hi-Tech
Provides PCB assembly services for high temperature electronics with specialized testing capabilities for medical,
aerospace & energy industries.
Viasion Technology
Specializes in small to medium-volume PCB manufacturing and assembly, with dedicated medical device
electronics production capabilities.
PCBMay
Trusted energy meter PCB manufacturer and distributor serving clients worldwide with specialized metering
technology solutions.
Premier Manufacturing
Full-service PCB contract manufacturer located along the front range specializing in aerospace electronics and
energy control systems.
Meritek EMS
Provides customers with over 25 years of leadership in advanced PCB Assembly technology for medical and oil &
gas applications.
TTM Technologies
Medical PCB manufacturer offering medical manufacturing, medical PCB assembly, medical device PCB design and
other specialized services.
All Flex Solutions
Specializes in medical device PCB manufacturing solutions including flexible circuits, CatheterFlex PCBs, and rigid
flex circuits.
Logwell Technology
Specialized importer of PCB assemblies for medical devices and green energy applications with focus on imaging
and sensor technology.
PCB Connect Group
Long established and globally positioned supplier of Printed Circuit Boards with specialized energy and power
division.
POE PCBA
One-stop solution partner for Clean Energy equipment-related PCB manufacturing and assembly services focusing
on renewable energy applications.
ICTC Electronic Customer Import Data - Generated on April 8, 2025
Optimized for single-page PDF export
`;

// --- NEW HTML CONTENT FOR SLIDE 8 ---
const slide8HTMLContent = `
<div class="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold text-center">ICTC Electronic Customer Import Data</h1>
    </div>

    <!-- Search Criteria -->
    <div class="p-4 bg-blue-100 border-b border-gray-200">
        <h2 class="text-xl font-semibold mb-2">Search Criteria</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p><strong>Import Products from:</strong> China, Vietnam, Mexico, Canada</p>
                <p><strong>Product Codes:</strong> 8534.XX.XXXX, 8529.90.5500, 8534.XX.XXXX, 8549.XX.XXXX, 8548.XX.XXXX, 8517.62.XXXX, 8532.XX.XXXX, 8471.90.XXXX</p>
                <p><strong>Annual Import Volume:</strong> $1 million – $10 million</p>
                <p><strong>Product Type:</strong> PCBA (Printed Circuit Board Assemblies), not bare boards (PCB)</p>
            </div>
            <div>
                <p><strong>Excluded Industries:</strong> Automotive, Lighting</p>
                <p><strong>Target Industries:</strong> Medical, Oil & Gas, Metering, Green Energy, Aerospace</p>
                <p><strong>Ideal Contact:</strong> Buyer, Supply Chain Manager/Director</p>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="table-container p-4">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headquarters</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Countries</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Types</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Codes</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Import Volume</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industries Served</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Title</th>
                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                 <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Sanmina Corporation</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Mexico</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8529.90.5500, 8517.62.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$5-10 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical, Aerospace, Green Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Director</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.sanmina.com" target="_blank" rel="noopener noreferrer">www.sanmina.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Express Manufacturing Inc. (EMI)</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Mexico</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8532.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$3-7 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical, Green Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.eminc.com" target="_blank" rel="noopener noreferrer">www.eminc.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">FS Technology</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8548.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-5 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Manager</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.fs-pcba.com" target="_blank" rel="noopener noreferrer">www.fs-pcba.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Topscom PCB Assembly</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8549.00.0000, 8532.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$2-6 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Oil & Gas, Metering</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.topscompcbassembly.com" target="_blank" rel="noopener noreferrer">www.topscompcbassembly.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Murrietta Circuits</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Mexico, China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8529.90.5500</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$2-8 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Energy, Medical, Aerospace</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Director</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.murrietta.com" target="_blank" rel="noopener noreferrer">www.murrietta.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Creative Hi-Tech</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Vietnam</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8548.00.0000, 8517.62.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-4 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Energy, Medical, Aerospace</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Manager</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.creativehitech.com" target="_blank" rel="noopener noreferrer">www.creativehitech.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Viasion Technology</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8471.90.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-3 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.viasion.com" target="_blank" rel="noopener noreferrer">www.viasion.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBMay</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8532.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-4 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Metering, Green Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Manager</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.pcbmay.com" target="_blank" rel="noopener noreferrer">www.pcbmay.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Premier Manufacturing</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Mexico, Canada</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8532.00.0000, 8471.90.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$2-5 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Aerospace, Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Director</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.pmscs.com" target="_blank" rel="noopener noreferrer">www.pmscs.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Meritek EMS</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Vietnam</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8549.00.0000, 8517.62.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$3-8 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical, Oil & Gas</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.meritekems.com" target="_blank" rel="noopener noreferrer">www.meritekems.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">TTM Technologies</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Canada</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8532.00.0000, 8517.62.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$5-10 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical, Aerospace</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Director</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.ttm.com" target="_blank" rel="noopener noreferrer">www.ttm.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">All Flex Solutions</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Mexico, China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8548.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-5 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.allflexinc.com" target="_blank" rel="noopener noreferrer">www.allflexinc.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Logwell Technology</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8471.90.0000, 8534.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-3 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Medical, Green Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Manager</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">n/a</td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCB Connect Group</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China, Vietnam</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8548.00.0000</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$2-7 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Energy, Medical</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Supply Chain Director</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.pcbconnectgroup.com" target="_blank" rel="noopener noreferrer">www.pcbconnectgroup.com</a></td>
                    </tr>
                    <tr>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">POE PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">USA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">China</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">PCBA</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">8534.00.0000, 8529.90.5500</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">$1-4 million</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Green Energy</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-gray-900">Buyer</td>
                        <td class="px-3 py-2 whitespace-normal text-sm text-blue-600"><a href="http://www.poe-pcba.com" target="_blank" rel="noopener noreferrer">www.poe-pcba.com</a></td>
                    </tr>
            </tbody>
        </table>
    </div>

    <!-- Company Details -->
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Company Profiles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Sanmina Corporation</h3>
                <p class="mt-2 text-gray-700">Global electronics manufacturing services provider specializing in complex PCB assemblies for various industries including medical devices and aerospace applications.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Express Manufacturing Inc. (EMI)</h3>
                <p class="mt-2 text-gray-700">EMS provider offering fast, reliable contract manufacturing for OEMs, specializing in precision electronics for medical and energy sectors.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">FS Technology</h3>
                <p class="mt-2 text-gray-700">ISO 13485 certified company for medical PCB manufacturing and assembly with competitively priced production services.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Topscom PCB Assembly</h3>
                <p class="mt-2 text-gray-700">Specialist in energy and metering PCB assembly, with experience serving over 120 utilities and supporting AMR technology integration.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Murrietta Circuits</h3>
                <p class="mt-2 text-gray-700">Vertically integrated company offering complete turnkey PCB assembly for critical industries including energy, space, medical and defense.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Creative Hi-Tech</h3>
                <p class="mt-2 text-gray-700">Provides PCB assembly services for high temperature electronics with specialized testing capabilities for medical, aerospace & energy industries.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">Viasion Technology</h3>
                <p class="mt-2 text-gray-700">Specializes in small to medium-volume PCB manufacturing and assembly, with dedicated medical device electronics production capabilities.</p>
            </div>
            <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                <h3 class="font-bold text-lg text-blue-700">PCBMay</h3>
                <p class="mt-2 text-gray-700">Trusted energy meter PCB manufacturer and distributor serving clients worldwide with specialized metering technology solutions.</p>
            </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">Premier Manufacturing</h3>
                    <p class="mt-2 text-gray-700">Full-service PCB contract manufacturer located along the front range specializing in aerospace electronics and energy control systems.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">Meritek EMS</h3>
                    <p class="mt-2 text-gray-700">Provides customers with over 25 years of leadership in advanced PCB Assembly technology for medical and oil & gas applications.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">TTM Technologies</h3>
                    <p class="mt-2 text-gray-700">Medical PCB manufacturer offering medical manufacturing, medical PCB assembly, medical device PCB design and other specialized services.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">All Flex Solutions</h3>
                    <p class="mt-2 text-gray-700">Specializes in medical device PCB manufacturing solutions including flexible circuits, CatheterFlex PCBs, and rigid flex circuits.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">Logwell Technology</h3>
                    <p class="mt-2 text-gray-700">Specialized importer of PCB assemblies for medical devices and green energy applications with focus on imaging and sensor technology.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">PCB Connect Group</h3>
                    <p class="mt-2 text-gray-700">Long established and globally positioned supplier of Printed Circuit Boards with specialized energy and power division.</p>
                </div>
                <div class="p-4 border rounded-lg shadow hover:shadow-md bg-white">
                    <h3 class="font-bold text-lg text-blue-700">POE PCBA</h3>
                    <p class="mt-2 text-gray-700">One-stop solution partner for Clean Energy equipment-related PCB manufacturing and assembly services focusing on renewable energy applications.</p>
                </div>
            </div>
        </div>

    <!-- Footer -->
    <div class="bg-gray-100 p-4 text-center text-gray-600 text-sm border-t border-gray-200">
    </div>
</div>
`;

// Update config type to correctly handle Omit with union types
// Update the main configuration array
const FILES_CONFIG: (Omit<MarkdownData, 'content' | 'isLoading' | 'error'> | Omit<StaticContentData, never> | Omit<HTMLContentData, never> | Omit<CsvData, 'data' | 'headers' | 'isLoading' | 'error'>)[] = [
  { name: '1. Search Params', filePath: '/PCBA Products/search_parameters.md', type: 'markdown' },
  { name: '2. Import Findings', filePath: '/PCBA Products/import_data_findings.md', type: 'markdown' },
  { name: '3. HTS Analysis', filePath: '/PCBA Products/hts_code_analysis.md', type: 'markdown' },
  { name: '4. Data Validation', filePath: '/PCBA Products/data_validation_report.md', type: 'markdown' },
  { name: '5. Filtered Results', filePath: '/PCBA Products/filtered_results.md', type: 'markdown' },
  { name: '6. Contact Strategy', filePath: '/PCBA Products/contact_information_strategy.md', type: 'markdown' },
  { name: '7. Final Report', filePath: '/PCBA Products/PCBA_Import_Data_Report.md', type: 'markdown' },
  // Updated Slide 8 configuration
  {
      name: '8. Source Data (Layout)',
      filePath: 'internal-html-slide-8', // Using an identifier instead of a real path
      type: 'html-content',
      htmlContent: slide8HTMLContent // Assign the HTML string
  },
  // New tabs for the PCBA spreadsheets
  {
      name: '9. ICTC Leaniant Codes',
      filePath: '/PCBA Products/ICTC - For Alex - ICTC Electronic Customer - Leaniant Codes.csv',
      type: 'csv-content' // Add new type for CSV content
  },
  {
      name: '10. ICTC Strict Codes',
      filePath: '/PCBA Products/ICTC - For Alex - ICTC Electronic Customer - Strict Codes.csv',
      type: 'csv-content' // Add new type for CSV content
  }
];

// Add TruncatedText component for handling long text in the spreadsheet
interface TruncatedTextProps {
  text: string;
  maxWidthClass: string;
  onExpandClick: (text: string, header: string) => void;
  header: string;
  children?: React.ReactNode;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxWidthClass, onExpandClick, header, children, className = '' }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      let contentWidth = 0;
      if (textRef.current) {
          contentWidth = textRef.current.scrollWidth;
      }
      if (containerRef.current) {
        setIsTruncated(contentWidth > containerRef.current.offsetWidth);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
        checkTruncation(); 
        resizeObserver = new ResizeObserver(checkTruncation);
        resizeObserver.observe(containerRef.current);
    }
    
    checkTruncation();

    return () => {
        if (resizeObserver && containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
        }
    };
  }, [text, children]);

  return (
    <div ref={containerRef} className={`flex items-center justify-between ${maxWidthClass} ${className}`}> 
      <span ref={textRef} className="block whitespace-nowrap overflow-hidden text-ellipsis">
        {children || text}
      </span>
      {isTruncated && (
        <button 
          onClick={(e) => { 
             e.stopPropagation();
             onExpandClick(text, header); 
          }}
          className="btn btn-ghost btn-xs shrink-0 p-0 ml-1 text-blue-600 hover:text-blue-800" 
          aria-label="Expand text"
          title="View full text"
        >
          <FiMaximize2 size={14} />
        </button>
      )}
    </div>
  );
};

// Add DataTable component for displaying the CSV data
interface DataTableProps {
  dataSet: CsvData;
  itemsPerPage: number;
  onCompanyClick: (rowData: CsvRow) => void;
  onExpandTextClick: (text: string, header: string) => void;
  isDataLoadingOrAnimating: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ dataSet, itemsPerPage, onCompanyClick, onExpandTextClick, isDataLoadingOrAnimating }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { data, headers, isLoading, error } = dataSet;
  const linkHeaders = useMemo(() => new Set(['Website', 'Company Website', 'Company Domain']), []);
  
  const isUrl = useCallback((str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      return str.startsWith('http://') || str.startsWith('https://') || (str.includes('.') && !str.includes(' ') && str.length > 3);
    } catch (_) {
      return false;
    }
  }, []);
  
  const ensureProtocol = useCallback((url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        if (url.startsWith('www.')) {
            return `https://${url}`;
        }
        if (url.includes('.') && !url.includes(' ') && !url.startsWith('/')) {
             return `https://${url}`;
        }
        return url;
    }
    return url;
  }, []);

  // Reset page/selection when dataset changes
  const prevFilePath = useRef(dataSet.filePath);
  useEffect(() => {
      if (prevFilePath.current !== dataSet.filePath) {
        setCurrentPage(1);
        setSelectedRows(new Set());
        prevFilePath.current = dataSet.filePath;
      }
  }, [dataSet.filePath]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleRowSelect = (absoluteIndex: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(absoluteIndex)) {
        newSet.delete(absoluteIndex);
      } else {
        newSet.add(absoluteIndex);
      }
      return newSet;
    });
  };

  const handleSelectAllCurrentPage = (isChecked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      
      // Calculate current page's indices
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, data.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        if (isChecked) {
          newSet.add(i);
        } else {
          newSet.delete(i);
        }
      }
      
      return newSet;
    });
  };

  const copySelectedRows = () => {
    const selectedData = Array.from(selectedRows).map(index => data[index]);
    
    if (selectedData.length === 0) {
      toast.error('No rows selected to copy');
      return;
    }
    
    // Format the data as CSV, including headers
    const csvContent = [
      headers.join(','),
      ...selectedData.map(row => 
        headers.map(header => `"${(row[header] || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    navigator.clipboard.writeText(csvContent)
      .then(() => toast.success(`Copied ${selectedData.length} row${selectedData.length !== 1 ? 's' : ''} to clipboard`))
      .catch(err => toast.error('Failed to copy data: ' + err.message));
  };

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const pageData = data.slice(startIndex, endIndex);
  
  // Check if the current page is all selected
  const isCurrentPageAllSelected = pageData.length > 0 && 
    pageData.every((_, idx) => selectedRows.has(startIndex + idx));

  interface PaginationButtonData {
    key: string | number;
    pageNumber?: number;
    isCurrent?: boolean;
    isEllipsis?: boolean;
    isDisabled?: boolean;
  }

  const renderPaginationButtons = (): PaginationButtonData[] => {
    const buttons: PaginationButtonData[] = [];
    
    // Always show first page
    buttons.push({
      key: 'first',
      pageNumber: 1,
      isCurrent: currentPage === 1
    });
    
    // Logic for ellipsis and surrounding pages
    if (currentPage > 3) {
      buttons.push({ key: 'ellipsis1', isEllipsis: true });
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages (handled separately)
      buttons.push({
        key: i,
        pageNumber: i,
        isCurrent: currentPage === i
      });
    }
    
    if (currentPage < totalPages - 2) {
      buttons.push({ key: 'ellipsis2', isEllipsis: true });
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      buttons.push({
        key: 'last',
        pageNumber: totalPages,
        isCurrent: currentPage === totalPages
      });
    }
    
    return buttons;
  };

  if (isLoading || isDataLoadingOrAnimating) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-semibold">Error loading data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-2">
      {/* Table Controls Bar */}
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2 p-2 bg-gray-50 rounded-lg">
        {/* Left Group: Copy & Selection */}
        <div className="flex items-center space-x-2">
          <div className="form-control">
            <label className="cursor-pointer flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="checkbox checkbox-sm checkbox-primary" 
                checked={isCurrentPageAllSelected}
                onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Select Page</span>
            </label>
          </div>
          <button 
            onClick={copySelectedRows}
            disabled={selectedRows.size === 0}
            className="btn btn-ghost btn-sm flex items-center space-x-1 text-gray-700"
          >
            <FiCopy size={16} />
            <span>Copy {selectedRows.size > 0 ? `(${selectedRows.size})` : ''}</span>
          </button>
        </div>
        
        {/* Right Group: Pagination Info */}
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {data.length} entries
        </div>
      </div>
      
      {/* Main Table */}
      <table className="table table-compact w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-10 px-2"></th> {/* Selection checkbox column */}
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, relativeIndex) => {
            const absoluteIndex = startIndex + relativeIndex;
            const isSelected = selectedRows.has(absoluteIndex);
            
            return (
              <tr 
                key={absoluteIndex}
                onClick={() => onCompanyClick(row)}
                className={`
                  text-sm cursor-pointer hover:bg-gray-50 
                  ${isSelected ? 'bg-blue-50' : 'bg-white'} 
                `}
              >
                <td className="w-10 px-2">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleRowSelect(absoluteIndex);
                    }}
                    onClick={(e) => e.stopPropagation()} // Also prevent row click
                  />
                </td>
                {headers.map((header) => {
                  const cellValue = row[header] || '';
                  
                  // Special formatting for links/websites
                  if (linkHeaders.has(header) && isUrl(cellValue)) {
                    return (
                      <td key={header} className="px-3 py-2">
                        <TruncatedText 
                          text={cellValue} 
                          maxWidthClass="max-w-xs" 
                          onExpandClick={onExpandTextClick}
                          header={header}
                        >
                          <a 
                            href={ensureProtocol(cellValue)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()} // Don't trigger row click
                          >
                            {cellValue}
                          </a>
                        </TruncatedText>
                      </td>
                    );
                  }
                  
                  // Default cell rendering with truncation
                  return (
                    <td key={header} className="px-3 py-2">
                      <TruncatedText 
                        text={cellValue} 
                        maxWidthClass="max-w-xs" 
                        onExpandClick={onExpandTextClick}
                        header={header}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            {renderPaginationButtons().map((btn) => {
              if (btn.isEllipsis) {
                return (
                  <button key={btn.key} className="btn btn-sm btn-disabled">...</button>
                );
              }
              
              return (
                <button 
                  key={btn.key}
                  className={`btn btn-sm ${btn.isCurrent ? 'btn-active' : 'btn-outline'}`}
                  onClick={() => {
                    if (btn.pageNumber) handlePageChange(btn.pageNumber);
                  }}
                  disabled={btn.isDisabled}
                >
                  {btn.pageNumber}
                </button>
              );
            })}
            
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add LoadingOverlay for the CSV data loading
const LoadingOverlay: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6 bg-white dark:bg-background-primary">
      <div className="animate-pulse flex items-center justify-center mb-6">
        <HiOutlineSparkles className="w-12 h-12 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Loading data...</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        Please wait while we prepare your data. This may take a moment depending on the file size.
      </p>
    </div>
  );
};

const PCBAPage: React.FC = () => {
  const { setIsSidebarCollapsed, setPageTitle } = useLayout();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const navigate = useNavigate();
  const [expandedTextModal, setExpandedTextModal] = useState<{ text: string; header: string; isOpen: boolean }>({
    text: '',
    header: '',
    isOpen: false
  });

  // Initialize files state
  const [files, setFiles] = useState<FileConfig[]>(() =>
    FILES_CONFIG.map(file => {
        if (file.type === 'markdown') {
            return { ...file, content: null, isLoading: true, error: null } as MarkdownData;
        } else if (file.type === 'html-content') {
            return { ...file } as HTMLContentData;
        } else if (file.type === 'csv-content') {
            return { ...file, data: [], headers: [], isLoading: true, error: null } as CsvData;
        } else {
            return { ...file } as StaticContentData;
        }
    })
  );

  // Add this effect to set the page title
  useEffect(() => {
    setPageTitle('PCBA Data Processing');
  }, [setPageTitle]);

  // Add this function to handle navigation back
  const handleBackToFavorites = () => {
    navigate('/favorites');
  };

  // Effect to control sidebar collapse
  useEffect(() => {
    console.log('PCBAPage mounted, collapsing sidebar.');
    setIsSidebarCollapsed(true);
    return () => {
      console.log('PCBAPage unmounted, expanding sidebar.');
      setIsSidebarCollapsed(false);
    };
  }, [setIsSidebarCollapsed]);

  // Fetch markdown content - only if it's a markdown file
  const fetchMarkdownForTab = useCallback((tabIndex: number) => {
    const fileConfig = files[tabIndex];
    if (fileConfig.type !== 'markdown') return; // Don't fetch for non-markdown types

    // Avoid refetching if content exists or is already loading/loaded
    if (fileConfig.content !== null || (fileConfig.isLoading === false && fileConfig.error === null)) {
         if (fileConfig.isLoading) {
             setFiles(prev => prev.map((f, index) => index === tabIndex ? { ...f, isLoading: false } : f));
         }
        return;
    }

    // Indicate loading state immediately
    setFiles(prev => prev.map((f, index) =>
      index === tabIndex ? { ...f, isLoading: true, error: null } : f
    ));

    fetch(fileConfig.filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setFiles(prev => prev.map((f, index) =>
          index === tabIndex ? { ...f, content: text, isLoading: false, error: null } : f
        ));
      })
      .catch(error => {
        console.error("Markdown Fetch Error:", error);
        setFiles(prev => prev.map((f, index) =>
          index === tabIndex ? { ...f, isLoading: false, error: `Failed to load file: ${error.message}` } : f
        ));
      });
  }, [files]);

  // Fetch CSV content for CSV type tabs
  const fetchCsvForTab = useCallback((tabIndex: number) => {
    const fileConfig = files[tabIndex];
    if (fileConfig.type !== 'csv-content') return; // Don't fetch for non-CSV types

    // Avoid refetching if content exists or is already loading
    if (fileConfig.data.length > 0 || (fileConfig.isLoading === false && fileConfig.error === null)) {
        if (fileConfig.isLoading) {
            setFiles(prev => prev.map((f, index) => index === tabIndex ? { ...f, isLoading: false } : f));
        }
        return;
    }

    // Indicate loading state immediately
    setFiles(prev => prev.map((f, index) =>
      index === tabIndex ? { ...f, isLoading: true, error: null } : f
    ));

    fetch(fileConfig.filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        // Parse CSV using Papa Parse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const headers = results.meta.fields || [];
            setFiles(prev => prev.map((f, index) =>
              index === tabIndex ? 
                { ...f, data: results.data as CsvRow[], headers, isLoading: false, error: null } : 
                f
            ));
          },
          error: (error: any) => {
            console.error("CSV Parse Error:", error);
            setFiles(prev => prev.map((f, index) =>
              index === tabIndex ? { ...f, isLoading: false, error: `Failed to parse CSV: ${error.message}` } : f
            ));
          }
        });
      })
      .catch(error => {
        console.error("CSV Fetch Error:", error);
        setFiles(prev => prev.map((f, index) =>
          index === tabIndex ? { ...f, isLoading: false, error: `Failed to load file: ${error.message}` } : f
        ));
      });
  }, [files]);

  // Fetch data for the initial active tab
  useEffect(() => {
    const activeFile = files[activeTabIndex];
    if (activeFile.type === 'markdown') {
      fetchMarkdownForTab(activeTabIndex);
    } else if (activeFile.type === 'csv-content') {
      fetchCsvForTab(activeTabIndex);
    }
  }, [fetchMarkdownForTab, fetchCsvForTab, activeTabIndex, files]);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    const fileType = files[index].type;
    if (fileType === 'markdown') {
      fetchMarkdownForTab(index);
    } else if (fileType === 'csv-content') {
      fetchCsvForTab(index);
    }
  };

  const handleCompanyClick = (rowData: CsvRow) => {
    console.log("Company clicked:", rowData);
    // Implement company details modal if needed
  };

  const handleExpandTextClick = (text: string, header: string) => {
    setExpandedTextModal({
      text,
      header,
      isOpen: true
    });
  };

  const handleCloseTextModal = () => {
    setExpandedTextModal(prev => ({ ...prev, isOpen: false }));
  };

  // Update type guards
  const activeFile = files[activeTabIndex];
  const isMarkdown = (file: FileConfig): file is MarkdownData => file?.type === 'markdown';
  const isStaticContent = (file: FileConfig): file is StaticContentData => file?.type === 'static-content';
  const isHtmlContent = (file: FileConfig): file is HTMLContentData => file?.type === 'html-content';
  const isCsvContent = (file: FileConfig): file is CsvData => file?.type === 'csv-content';

  // Custom renderer for Markdown that properly handles HTML
  const MarkdownWithHtml: React.FC<{ content: string }> = ({ content }) => {
    // Pre-process content to fix styling for dark-themed HTML elements
    let processedContent = content;
    
    // First replace background and border classes
    processedContent = processedContent.replace(
      /bg-slate-700\/80|bg-indigo-700|text-white|border-slate-600\/30|bg-blue-800\/20|bg-blue-700\/30|text-blue-300|text-blue-300|border-blue-700\/20|font-semibold text-blue-300/g, 
      (match) => {
        // Replace dark theme classes with light theme equivalents
        const replacements: Record<string, string> = {
          'bg-slate-700/80': 'bg-gray-100',
          'bg-indigo-700': 'bg-blue-600',
          'text-white': 'text-gray-900',
          'border-slate-600/30': 'border-gray-300',
          'bg-blue-800/20': 'bg-blue-50',
          'bg-blue-700/30': 'bg-blue-100',
          'text-blue-300': 'text-blue-800',
          'border-blue-700/20': 'border-blue-200',
          'font-semibold text-blue-300': 'font-semibold text-blue-800'
        };
        return replacements[match] || match;
      }
    );
    
    // Specifically target and modify Contact Strategy text elements
    if (processedContent.includes('Contact Strategy') || processedContent.includes('Contact Information Strategy')) {
      // Replace the blue header text with black text for the "Contact Information Strategy" section
      processedContent = processedContent.replace(
        /<h3 class="([^"]*)(text-lg|text-xl|text-blue-300|text-white)([^"]*)">Contact Information Strategy<\/h3>/g,
        '<h3 class="$1$3" style="color: #000000 !important;">Contact Information Strategy</h3>'
      );
      
      // Replace the paragraph text about comprehensive strategy
      processedContent = processedContent.replace(
        /<p class="([^"]*)(text-blue-300|text-white)([^"]*)">A comprehensive strategy combining([^<]*)<\/p>/g,
        '<p class="$1$3" style="color: #000000 !important;">A comprehensive strategy combining$4</p>'
      );
      
      // Replace the targeted high-quality data sources text
      processedContent = processedContent.replace(
        /<p class="([^"]*)(text-blue-300|text-white)([^"]*)">Targeted, high-quality data sources([^<]*)<\/p>/g,
        '<p class="$1$3" style="color: #000000 !important;">Targeted, high-quality data sources$4</p>'
      );
      
      // General approach to replace all text in blue sections to black
      processedContent = processedContent.replace(
        /(<div[^>]*bg-blue[^>]*>[\s\S]*?)(<p class="[^"]*)(text-blue-300|text-white)([^"]*">)([\s\S]*?)(<\/p>)/g,
        '$1$2$4<span style="color: #000000 !important;">$5</span>$6'
      );
      
      // Apply a broader replacement for any remaining blue text
      processedContent = processedContent.replace(
        /(class="[^"]*)(text-blue-300|text-white)([^"]*")/g,
        '$1$3 style="color: #000000 !important;"'
      );
    }

    return (
      <div className="markdown-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]} // Enable raw HTML rendering
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-900" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3 mt-6 text-gray-800" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-lg font-semibold mb-2 mt-3 text-gray-800" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-gray-700" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-gray-700" {...props} />,
            li: ({node, ...props}) => <li className="mb-1 text-gray-700" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props} />,
            code: ({node, inline, className, children, ...props}: any) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={`${className ? className : "bg-gray-100"} px-1 rounded text-gray-900`} {...props}>
                  {children}
                </code>
              );
            },
            p: ({node, children, ...props}) => {
              // Check if the paragraph contains HTML-like content
              const childrenStr = children?.toString() || '';
              if (
                childrenStr.includes('<div') || 
                childrenStr.includes('<svg') || 
                childrenStr.includes('<table') ||
                childrenStr.includes('<mermaid') ||
                childrenStr.includes('<h3')
              ) {
                return <div className="text-gray-800 rendered-html" dangerouslySetInnerHTML={{ __html: childrenStr }} />;
              }
              return <p className="mb-4 text-gray-700" {...props}>{children}</p>;
            },
            table: ({node, ...props}) => <table className="min-w-full divide-y divide-gray-200 my-4 border border-gray-200" {...props} />,
            thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
            tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-200" {...props} />,
            tr: ({node, ...props}) => <tr className="hover:bg-gray-50" {...props} />,
            th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" {...props} />,
            td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-gray-700" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />,
            div: ({node, children, ...props}) => {
              // Handle special classes or data attributes
              return <div className="text-gray-700" {...props}>{children}</div>;
            },
            img: ({node, ...props}) => <img className="my-4 max-w-full h-auto rounded-lg shadow-md" {...props} />
          }}
        >
          {processedContent}
        </ReactMarkdown>

        {/* For mermaid charts that might be present in the markdown */}
        <div className="mermaid-container">
          {Array.from(processedContent.matchAll(/<div class="mermaid">([\s\S]*?)<\/div>/g)).map((match, index) => (
            <div key={index} className="mermaid-wrapper my-6 p-4 bg-gray-50 rounded-lg shadow">
              <div className="mermaid" dangerouslySetInnerHTML={{ __html: match[1] }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add enhanced styling for the report content
  React.useEffect(() => {
    // Add custom styling for the report content
    const style = document.createElement('style');
    style.innerHTML = `
      /* Keep existing glassmorphic styling in case it's needed elsewhere */
      .markdown-glassmorphic h1 {
        color: #FFFFFF;
        font-size: 2.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(to right, #3B82F6, #10B981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .markdown-glassmorphic h2 {
        color: #FFFFFF;
        font-size: 1.75rem;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-left: 0.5rem;
        border-left: 4px solid #3B82F6;
      }
      
      .markdown-glassmorphic h3 {
        color: #FFFFFF;
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      
      .markdown-glassmorphic p {
        color: #B3B3B3;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      
      .markdown-glassmorphic ul, .markdown-glassmorphic ol {
        color: #B3B3B3;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      
      .markdown-glassmorphic li {
        margin-bottom: 0.5rem;
      }
      
      .markdown-glassmorphic strong {
        color: #FFFFFF;
        font-weight: 600;
      }
      
      .markdown-glassmorphic {
        background: rgba(26, 26, 26, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        border-radius: 0.75rem;
        padding: 2rem;
        transition: all 0.3s ease;
      }
      
      .markdown-glassmorphic > section {
        background: rgba(42, 42, 42, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        transition: transform 0.3s ease;
      }
      
      .markdown-glassmorphic > section:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }
      
      /* Add styling for the standard markdown content (used for all tabs now) */
      .markdown-content h1 {
        color: #1E3A8A;
        font-size: 2.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #E5E7EB;
      }
      
      .markdown-content h2 {
        color: #2563EB;
        font-size: 1.75rem;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-left: 0.5rem;
        border-left: 4px solid #3B82F6;
      }
      
      .markdown-content h3 {
        color: #1F2937;
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      
      .markdown-content p {
        color: #4B5563;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      
      .markdown-content ul, .markdown-content ol {
        color: #4B5563;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      
      .markdown-content li {
        margin-bottom: 0.5rem;
      }
      
      .markdown-content strong {
        color: #1F2937;
        font-weight: 600;
      }
      
      .markdown-content a {
        color: #2563EB;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      
      .markdown-content a:hover {
        text-decoration: underline;
      }
      
      .markdown-content blockquote {
        background-color: #F3F4F6;
        border-left: 4px solid #3B82F6;
        padding: 1rem;
        margin: 1.5rem 0;
        color: #4B5563;
      }
      
      .markdown-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
      }
      
      .markdown-content th {
        background-color: #F3F4F6;
        font-weight: 600;
        text-align: left;
        padding: 0.75rem;
        border: 1px solid #E5E7EB;
      }
      
      .markdown-content td {
        padding: 0.75rem;
        border: 1px solid #E5E7EB;
      }
      
      .markdown-content tr:nth-child(even) {
        background-color: #F9FAFB;
      }
      
      /* Additional styles for rendered HTML content */
      .rendered-html h3 {
        color: #1F2937 !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      
      .rendered-html .text-white, .rendered-html .text-blue-300 {
        color: #1F2937 !important;
      }
      
      .rendered-html svg {
        color: white !important;
      }
      
      .rendered-html p {
        color: #4B5563 !important;
      }
      
      /* Custom styles for Contact Strategy tab */
      .rendered-html .bg-blue-800\\/20 {
        background-color: #EFF6FF !important;
        border: 1px solid #DBEAFE !important;
      }
      
      .rendered-html .bg-blue-700\\/30 {
        background-color: #DBEAFE !important;
      }
      
      /* Specific styles for Contact Strategy tab text elements */
      /* Target the "Contact Information Strategy" heading */
      .rendered-html h3.text-lg, 
      .rendered-html h3.font-semibold,
      .rendered-html h3[class*="text-"] {
        color: #000000 !important;
      }
      
      /* Target the strategy description text */
      .rendered-html div p,
      .rendered-html div p.text-blue-300,
      .rendered-html div p.text-white {
        color: #000000 !important;
      }
      
      /* Ensure all text in the contact section is black */
      .rendered-html div[class*="bg-blue"] p,
      .rendered-html div[class*="bg-blue"] .text-blue-300,
      .rendered-html div[class*="bg-blue"] .text-white {
        color: #000000 !important;
      }
      
      /* Target specific context */
      .markdown-content:has(h2:contains("Contact Strategy")) p,
      .markdown-content:has(h1:contains("Contact Strategy")) p,
      .markdown-content:has(h3:contains("Contact Information Strategy")) p {
        color: #000000 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-background-primary">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side with back button */}
          <div className="flex items-center">
            <button 
              onClick={handleBackToFavorites}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
              aria-label="Back to favorites"
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
      
      {/* Title Section */}
      <div className="bg-white px-6 pt-6 pb-4">
        <h1 className="text-3xl font-semibold text-gray-800">PCBA Data Processing</h1>
        <p className="text-gray-600 mt-2">Step-by-step walkthrough of PCBA data processing</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex-shrink-0 flex items-center px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex border-b border-gray-200 -mb-px overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={file.name}
              onClick={() => handleTabClick(index)}
              className={`px-4 py-2.5 text-sm font-medium focus:outline-none border-b-2 transition-colors duration-200 ${
                activeTabIndex === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow px-6 pb-6 pt-4">
        <div className="bg-white dark:bg-background-secondary border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden h-full">
          {/* Conditional rendering based on type */}
          {isMarkdown(activeFile) && (
            <div className="p-6 overflow-y-auto h-full">
              {activeFile.isLoading && (
                <div className="text-center py-10">
                  <span className="loading loading-dots loading-lg text-gray-500"></span>
                  <p className="mt-4 text-lg text-gray-600">Loading {activeFile.name}...</p>
                </div>
              )}
              {activeFile.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {activeFile.error}</span>
                </div>
              )}
              {activeFile.content !== null && !activeFile.isLoading && !activeFile.error && (
                <div className="pcba-content-renderer">
                  <MarkdownWithHtml content={activeFile.content} />
                </div>
              )}
              {activeFile.content === null && !activeFile.isLoading && !activeFile.error && (
                  <p className="text-gray-500">No content loaded for this step.</p>
              )}
            </div>
          )}
          {isStaticContent(activeFile) && (
              <PDFContentDisplay rawText={activeFile.rawText} />
          )}
          {isHtmlContent(activeFile) && (
              <div
                  className="p-0 overflow-y-auto h-full bg-white dark:bg-background-secondary" 
                  dangerouslySetInnerHTML={{ __html: activeFile.htmlContent }}
              />
          )}
          {isCsvContent(activeFile) && (
              <div className="overflow-y-auto h-full">
                <DataTable 
                  dataSet={activeFile}
                  itemsPerPage={25}
                  onCompanyClick={handleCompanyClick}
                  onExpandTextClick={handleExpandTextClick}
                  isDataLoadingOrAnimating={activeFile.isLoading}
                />
              </div>
          )}
          {/* Fallback if type is somehow undefined */}
          {!isMarkdown(activeFile) && !isStaticContent(activeFile) && !isHtmlContent(activeFile) && !isCsvContent(activeFile) && (
              <div className="p-6 text-center text-gray-500">Unsupported file type selected.</div>
          )}
        </div>
      </div>

      {/* Expanded Text Modal */}
      {expandedTextModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{expandedTextModal.header}</h3>
              <button 
                onClick={handleCloseTextModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="whitespace-pre-wrap text-gray-700 border p-4 rounded-lg bg-gray-50">
              {expandedTextModal.text}
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleCloseTextModal}
                className="btn btn-sm btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBAPage; 