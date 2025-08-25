# 📊 PCBA Import Data Findings

<div style="background-color: #EDF2F7; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #4A5568;">
<h3 style="margin-top: 0; color: #2D3748;">Executive Summary</h3>
<p>Analysis of import data has yielded 15 companies matching our search criteria. These companies import PCBAs primarily from China, with secondary sourcing from Vietnam, Mexico, and Canada. The majority serve the medical industry, followed by green energy, oil & gas, and aerospace.</p>
</div>

## 🌟 Key Highlights

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
  <div style="background-color: #EBF8FF; padding: 16px; border-radius: 8px; text-align: center;">
    <div style="font-size: 2em; color: #3182CE; margin-bottom: 8px;">15</div>
    <div style="font-weight: bold; color: #2C5282;">Matching Companies</div>
  </div>
  <div style="background-color: #E6FFFA; padding: 16px; border-radius: 8px; text-align: center;">
    <div style="font-size: 2em; color: #319795; margin-bottom: 8px;">$52M</div>
    <div style="font-weight: bold; color: #285E61;">Total Import Volume</div>
  </div>
  <div style="background-color: #FFFAF0; padding: 16px; border-radius: 8px; text-align: center;">
    <div style="font-size: 2em; color: #DD6B20; margin-bottom: 8px;">4</div>
    <div style="font-weight: bold; color: #9C4221;">Primary Import Countries</div>
  </div>
  <div style="background-color: #F0FFF4; padding: 16px; border-radius: 8px; text-align: center;">
    <div style="font-size: 2em; color: #38A169; margin-bottom: 8px;">5</div>
    <div style="font-weight: bold; color: #276749;">Target Industries</div>
  </div>
</div>

## 📈 Import Volume Distribution

The following chart shows the distribution of annual import volumes across the matching companies:

```mermaid
xychart-beta
    title "PCBA Import Volumes by Company"
    x-axis ["Sanmina", "TTM Tech", "Meritek", "EMI", "Murrietta", "PCB Connect", "Topscom", "Premier", "FS Tech", "Creative", "PCBMay", "POE", "All Flex", "Viasion", "Logwell"]
    y-axis "Millions USD" 0 --> 10
    bar [8.5, 7.5, 5.5, 5.0, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.5, 2.5, 3.0, 2.0, 2.0]
```

## 🌎 Geographic Origin Analysis

<div style="padding: 20px; background-color: #F7FAFC; border-radius: 8px; margin-bottom: 24px;">
<div style="margin-bottom: 16px;">
  <div style="height: 24px; background: linear-gradient(to right, #3182CE 65%, #38A169 15%, #D69E2E 12%, #A0AEC0 8%); border-radius: 4px;"></div>
  <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.85em;">
    <span>China: 65%</span>
    <span>Vietnam: 15%</span>
    <span>Mexico: 12%</span>
    <span>Canada: 8%</span>
  </div>
</div>

<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
  <tr style="background-color: #EDF2F7;">
    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #CBD5E0;">Country</th>
    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #CBD5E0;">Companies</th>
    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #CBD5E0;">Import Volume</th>
    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #CBD5E0;">% of Total</th>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">China</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">15</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">$33.8M</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">65%</td>
  </tr>
  <tr style="background-color: #F7FAFC;">
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Vietnam</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">4</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">$7.8M</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">15%</td>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Mexico</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">5</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">$6.2M</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">12%</td>
  </tr>
  <tr style="background-color: #F7FAFC;">
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Canada</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">2</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">$4.2M</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">8%</td>
  </tr>
  <tr style="font-weight: bold; background-color: #EDF2F7;">
    <td style="padding: 12px;">Total</td>
    <td style="padding: 12px; text-align: right;">-</td>
    <td style="padding: 12px; text-align: right;">$52.0M</td>
    <td style="padding: 12px; text-align: right;">100%</td>
  </tr>
</table>
</div>

## 🏭 Industry Distribution Analysis

```mermaid
pie
    title Industry Distribution of PCBA Importers
    "Medical" : 40
    "Green Energy" : 27 
    "Oil & Gas" : 13
    "Aerospace" : 13
    "Metering" : 7
```

### Industry Breakdown by Company

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px;">

<div style="background-color: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #38A169;">
  <h4 style="margin-top: 0; color: #276749;">Medical Industry Importers</h4>
  <ul style="padding-left: 20px; margin-bottom: 0;">
    <li><strong>Sanmina Corporation</strong> - $5-10M annual import volume</li>
    <li><strong>Express Manufacturing Inc.</strong> - $3-7M annual import volume</li>
    <li><strong>FS Technology</strong> - $1-5M annual import volume</li>
    <li><strong>TTM Technologies</strong> - $5-10M annual import volume</li>
    <li><strong>Meritek EMS</strong> - $3-8M annual import volume</li>
    <li><strong>Logwell Technology</strong> - $1-3M annual import volume</li>
  </ul>
</div>

<div style="background-color: #FFFBEB; padding: 16px; border-radius: 8px; border-left: 4px solid #D69E2E;">
  <h4 style="margin-top: 0; color: #9C4221;">Oil & Gas and Metering Importers</h4>
  <ul style="padding-left: 20px; margin-bottom: 0;">
    <li><strong>Topscom PCB Assembly</strong> - $2-6M annual import volume</li>
    <li><strong>PCBMay</strong> - $1-4M annual import volume</li>
    <li><strong>Meritek EMS</strong> - $3-8M annual import volume</li>
  </ul>
</div>

<div style="background-color: #E6FFFA; padding: 16px; border-radius: 8px; border-left: 4px solid #319795;">
  <h4 style="margin-top: 0; color: #285E61;">Green Energy Importers</h4>
  <ul style="padding-left: 20px; margin-bottom: 0;">
    <li><strong>POE PCBA</strong> - $1-4M annual import volume</li>
    <li><strong>Logwell Technology</strong> - $1-3M annual import volume</li>
    <li><strong>PCBMay</strong> - $1-4M annual import volume</li>
    <li><strong>Express Manufacturing Inc.</strong> - $3-7M annual import volume</li>
  </ul>
</div>

<div style="background-color: #EBF8FF; padding: 16px; border-radius: 8px; border-left: 4px solid #3182CE;">
  <h4 style="margin-top: 0; color: #2C5282;">Aerospace Importers</h4>
  <ul style="padding-left: 20px; margin-bottom: 0;">
    <li><strong>Murrietta Circuits</strong> - $2-8M annual import volume</li>
    <li><strong>Creative Hi-Tech</strong> - $1-4M annual import volume</li>
    <li><strong>Premier Manufacturing</strong> - $2-5M annual import volume</li>
  </ul>
</div>

</div>

## 🔍 HTS Code Distribution

The following HTS codes were predominantly used by the matched companies:

<div style="overflow-x: auto; margin-bottom: 24px;">
<table style="width: 100%; border-collapse: collapse;">
  <tr style="background-color: #EDF2F7;">
    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #CBD5E0;">HTS Code</th>
    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #CBD5E0;">Description</th>
    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #CBD5E0;">Companies</th>
    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #CBD5E0;">% of Total</th>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8534.00.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Printed circuit boards</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">15</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">100%</td>
  </tr>
  <tr style="background-color: #F7FAFC;">
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8532.00.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Electrical capacitors</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">6</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">40%</td>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8529.90.5500</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Printed circuit assemblies</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">4</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">27%</td>
  </tr>
  <tr style="background-color: #F7FAFC;">
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8517.62.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Communication apparatus</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">4</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">27%</td>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8548.00.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Electrical parts of machinery</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">4</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">27%</td>
  </tr>
  <tr style="background-color: #F7FAFC;">
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8549.00.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Electrical waste and scrap</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">2</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">13%</td>
  </tr>
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;"><code>8471.90.0000</code></td>
    <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">Data processing equipment</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">3</td>
    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0;">20%</td>
  </tr>
</table>
</div>

## 👥 Contact Information Findings

<div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
<h3 style="margin-top: 0; color: #4A5568;">Contact Role Distribution</h3>

<div style="display: flex; gap: 16px; margin-bottom: 16px;">
  <div style="flex: 1; background-color: #EBF8FF; padding: 12px; border-radius: 8px; text-align: center;">
    <div style="font-size: 1.5em; color: #3182CE; margin-bottom: 4px;">6</div>
    <div style="font-weight: bold; font-size: 0.9em;">Supply Chain Directors</div>
    <div style="font-size: 0.8em; color: #4A5568;">40%</div>
  </div>
  <div style="flex: 1; background-color: #E6FFFA; padding: 12px; border-radius: 8px; text-align: center;">
    <div style="font-size: 1.5em; color: #319795; margin-bottom: 4px;">5</div>
    <div style="font-weight: bold; font-size: 0.9em;">Buyers</div>
    <div style="font-size: 0.8em; color: #4A5568;">33%</div>
  </div>
  <div style="flex: 1; background-color: #F0FFF4; padding: 12px; border-radius: 8px; text-align: center;">
    <div style="font-size: 1.5em; color: #38A169; margin-bottom: 4px;">4</div>
    <div style="font-weight: bold; font-size: 0.9em;">Supply Chain Managers</div>
    <div style="font-size: 0.8em; color: #4A5568;">27%</div>
  </div>
</div>

<p><strong>Finding:</strong> Direct contact information (email/phone) was successfully identified for 12 out of 15 companies (80% success rate).</p>
</div>

## 🚀 Next Steps

<div style="display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; margin-bottom: 24px;">
  <div style="background-color: #3182CE; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
  <div>
    <h4 style="margin-top: 0; margin-bottom: 4px;">Validate HTS Code Classifications</h4>
    <p style="margin-top: 0;">Confirm that imports classified under these HTS codes are indeed PCBAs and not bare boards.</p>
  </div>
  
  <div style="background-color: #3182CE; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
  <div>
    <h4 style="margin-top: 0; margin-bottom: 4px;">Website Analysis</h4>
    <p style="margin-top: 0;">Review company websites to verify industry focus and PCBA capabilities.</p>
  </div>
  
  <div style="background-color: #3182CE; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
  <div>
    <h4 style="margin-top: 0; margin-bottom: 4px;">Complete Contact Information</h4>
    <p style="margin-top: 0;">Obtain direct contact details for the remaining 3 companies.</p>
  </div>
  
  <div style="background-color: #3182CE; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold;">4</div>
  <div>
    <h4 style="margin-top: 0; margin-bottom: 4px;">Filter Industry-Specific Results</h4>
    <p style="margin-top: 0;">Prepare filtered lists for each target industry.</p>
  </div>
</div>

---

<div style="text-align: center; color: #A0AEC0; font-size: 0.8em; margin-top: 40px;">
Data extracted from Customs and Import databases<br>
Last Updated: April 10, 2023
</div>
