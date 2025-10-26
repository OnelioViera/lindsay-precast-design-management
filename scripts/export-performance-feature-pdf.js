const fs = require('fs');
const path = require('path');

/**
 * Script to export Performance Feature documentation as PDF
 * Run with: node scripts/export-performance-feature-pdf.js
 */

async function exportPerformanceFeaturePDF() {
  try {
    console.log('🔄 Preparing to generate PDF...\n');

    // Read all documentation files
    const docFiles = [
      'README_PERFORMANCE_FEATURE.md',
      'PERFORMANCE_FEATURE_PREVIEW.md',
      'PERFORMANCE_FEATURE.md',
      'PERFORMANCE_IMPLEMENTATION_SUMMARY.md',
      'REVIEW_PERFORMANCE_FEATURE.md',
      'FEATURE_DELIVERY_SUMMARY.md'
    ];

    let combinedContent = '';

    // Combine all documentation
    for (const file of docFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        combinedContent += content + '\n\n---\n\n';
        console.log(`✅ Loaded: ${file}`);
      } else {
        console.warn(`⚠️  Missing: ${file}`);
      }
    }

    // Create HTML version for PDF conversion
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Feature Documentation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            page-break-after: avoid;
        }
        
        h2 {
            color: #764ba2;
            margin-top: 30px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #667eea;
            page-break-after: avoid;
        }
        
        h4, h5, h6 {
            color: #555;
            page-break-after: avoid;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #667eea;
            color: white;
        }
        
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #c7254e;
        }
        
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #667eea;
        }
        
        pre code {
            color: #333;
            background-color: transparent;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            padding-left: 20px;
            margin-left: 0;
            color: #666;
            font-style: italic;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header-date {
            color: #888;
            font-size: 14px;
        }
        
        .toc {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .toc ul {
            list-style-type: none;
            padding-left: 0;
        }
        
        .toc li {
            margin: 5px 0;
            padding-left: 20px;
        }
        
        .toc a {
            color: #667eea;
            text-decoration: none;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #888;
            font-size: 12px;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        ul, ol {
            margin: 15px 0;
        }
        
        li {
            margin: 8px 0;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin: 2px;
        }
        
        .status-complete {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-warning {
            background-color: #fff3cd;
            color: #856404;
        }
        
        @media print {
            body {
                background-color: white;
            }
            
            .container {
                box-shadow: none;
                padding: 0;
            }
            
            h1, h2, h3 {
                color: #333;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Project Performance Tracking Feature</h1>
            <h2 style="color: #764ba2; margin-top: 10px;">Complete Documentation</h2>
            <p class="header-date">Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p><span class="status-badge status-complete">✅ PRODUCTION READY</span></p>
        </div>

        <div class="toc">
            <h3>📋 Table of Contents</h3>
            <ul>
                <li><a href="#quick-start">Quick Start Guide</a></li>
                <li><a href="#preview">Visual Preview</a></li>
                <li><a href="#technical">Technical Details</a></li>
                <li><a href="#implementation">Implementation Summary</a></li>
                <li><a href="#review">Review & Testing Guide</a></li>
                <li><a href="#delivery">Complete Delivery Summary</a></li>
            </ul>
        </div>

        <div id="quick-start">
            <h2>📚 Documentation Included</h2>
            <p>This PDF contains 6 comprehensive documentation files covering:</p>
            <ul>
                <li>📖 Quick start guide and feature overview</li>
                <li>👀 Visual design mockups and previews</li>
                <li>🔧 Complete technical specifications</li>
                <li>✅ Implementation and integration details</li>
                <li>🧪 Testing procedures and QA checklist</li>
                <li>📋 Complete delivery summary</li>
            </ul>
        </div>

        <hr style="border: none; border-top: 2px solid #ddd; margin: 30px 0;">

        <div>${combinedContent}</div>

        <div class="footer">
            <p>Performance Tracking Feature Documentation</p>
            <p>Lindsay Precast Design Management System</p>
            <p>Generated: ${new Date().toISOString()}</p>
            <p style="margin-top: 20px; font-size: 11px;">
                This documentation is automatically generated and is part of the feature delivery package.
                For the latest version, refer to the markdown files in the project root.
            </p>
        </div>
    </div>
</body>
</html>
    `;

    // Save HTML version
    const htmlPath = path.join(__dirname, '..', 'performance-feature-documentation.html');
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`\n✅ HTML version saved: performance-feature-documentation.html`);

    // Save markdown combination
    const mdPath = path.join(__dirname, '..', 'PERFORMANCE_FEATURE_COMPLETE.md');
    fs.writeFileSync(mdPath, combinedContent);
    console.log(`✅ Markdown version saved: PERFORMANCE_FEATURE_COMPLETE.md`);

    // Create instructions file
    const instructionsPath = path.join(__dirname, '..', 'PDF_EXPORT_INSTRUCTIONS.md');
    const instructions = `# How to Convert to PDF

Since this project doesn't have a dedicated PDF generation library configured, here are several ways to convert the documentation to PDF:

## Option 1: Browser Print to PDF (Easiest) ⭐
1. Open: \`performance-feature-documentation.html\` in your web browser
2. Press: \`Ctrl+P\` (Windows) or \`Cmd+P\` (Mac)
3. Click: "Save as PDF"
4. Choose location and click "Save"

This preserves formatting, colors, and styling perfectly!

## Option 2: Command Line Tools

### Using Pandoc (Recommended for Markdown)
\`\`\`bash
# Install pandoc if needed
# Then run:
pandoc PERFORMANCE_FEATURE_COMPLETE.md -o performance-feature-documentation.pdf
\`\`\`

### Using wkhtmltopdf
\`\`\`bash
wkhtmltopdf performance-feature-documentation.html performance-feature-documentation.pdf
\`\`\`

### Using chromium/puppeteer
\`\`\`bash
npm install -g puppeteer
npx puppeteer print performance-feature-documentation.html performance-feature-documentation.pdf
\`\`\`

## Option 3: Online Tools
- **Markdown to PDF**: https://markdowntopdf.com/
- **HTML to PDF**: https://convertio.co/html-pdf/
- **Print Friendly**: https://www.printfriendly.com/

Upload the HTML or Markdown file and download as PDF.

## Option 4: Add PDF Generation to Project

If you want PDF generation built into your app, install jsPDF:

\`\`\`bash
npm install jspdf html2canvas
\`\`\`

Then use it in your app to generate PDFs programmatically.

---

## Files Generated

- **performance-feature-documentation.html** - Beautiful formatted HTML for printing/conversion
- **PERFORMANCE_FEATURE_COMPLETE.md** - Combined markdown file
- **This file** - Instructions for PDF conversion

---

**Recommended**: Use Option 1 (Browser Print to PDF) for best quality with no additional tools needed!
`;
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`✅ Instructions saved: PDF_EXPORT_INSTRUCTIONS.md`);

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║          📊 DOCUMENTATION EXPORT COMPLETE ✅                   ║
╚════════════════════════════════════════════════════════════════╝

📁 FILES CREATED:
  • performance-feature-documentation.html
  • PERFORMANCE_FEATURE_COMPLETE.md
  • PDF_EXPORT_INSTRUCTIONS.md

🔄 TO CONVERT TO PDF:

  OPTION 1 (EASIEST) - Browser Print:
  1. Open: performance-feature-documentation.html in your browser
  2. Press: Ctrl+P (Windows) or Cmd+P (Mac)
  3. Click: Save as PDF
  
  OPTION 2 - Command line:
  • Using pandoc: pandoc PERFORMANCE_FEATURE_COMPLETE.md -o output.pdf
  • Using wkhtmltopdf: wkhtmltopdf performance-feature-documentation.html output.pdf

  OPTION 3 - Online tools:
  • Upload HTML file to any online PDF converter
  
  See PDF_EXPORT_INSTRUCTIONS.md for more details!

📋 INCLUDED IN PDF:
  ✅ Quick Start Guide
  ✅ Visual Design Preview
  ✅ Technical Documentation
  ✅ Implementation Details
  ✅ Testing & QA Guide
  ✅ Complete Delivery Summary

═══════════════════════════════════════════════════════════════════
    `);

  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  }
}

function markdownToHtml(md) {
  // Basic markdown to HTML conversion
  let html = md
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\`(.*?)\`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/gm, '<p>')
    .replace(/$/gm, '</p>');
  
  return html;
}

// Run the export
exportPerformanceFeaturePDF();
