import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

/**
 * Format date nicely
 */
function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(d);
  }
}

/**
 * Export CNO samples array to Excel (.xlsx)
 */
export function exportCnoToExcel(samples, filename = 'Motiwala_CNO_Samples.xlsx') {
  if (!samples || !samples.length) {
    alert('No samples to export.');
    return;
  }

  const rows = samples.map((s, idx) => ({
    'Sr No': idx + 1,
    'Serial Number': s.serialNo || '',
    'Sample Date': formatDate(s.sampleDate),
    'Supplier Name': s.supplierName || '',
    'Code': s.code || '',
    'Inspiration': s.inspiration || '',
    'Ideal For': s.idealFor || '',
    'Suitable Uses': (s.suitableFor || []).join(', '),
    'Boxes Received': s.boxesReceived ?? 0,
    'Used In Product': s.usedInProduct || '',
    'Profile': s.profile || '',
    'Received Date': formatDate(s.receivedDate),
    'Received Time': s.receivedTime || '',
    'Concentrate (Longevity)': s.concentrateLongevity || '',
    'Temperature': s.temperature || '',
    'Spray (Longevity)': s.sprayLongevity || '',
    'Status': s.status || 'Under Review',
    'Remarks': s.remarks || '',
    'Created At': formatDate(s.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  // Set nice column widths
  const colWidths = [
    { wch: 8 },  // Sr No
    { wch: 16 }, // Serial Number
    { wch: 14 }, // Sample Date
    { wch: 22 }, // Supplier
    { wch: 16 }, // Code
    { wch: 24 }, // Inspiration
    { wch: 12 }, // Ideal For
    { wch: 28 }, // Suitable Uses
    { wch: 15 }, // Boxes Received
    { wch: 26 }, // Used In Product
    { wch: 16 }, // Profile
    { wch: 14 }, // Received Date
    { wch: 12 }, // Received Time
    { wch: 18 }, // Concentrate
    { wch: 14 }, // Temperature
    { wch: 18 }, // Spray
    { wch: 16 }, // Status
    { wch: 36 }, // Remarks
    { wch: 14 }, // Created At
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CNO_Samples');
  XLSX.writeFile(workbook, filename);
}

/**
 * Generate and download a branded PDF report for a single CNO Sample
 */
export function exportSingleCnoPdf(sample) {
  if (!sample) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryGreen = [153, 194, 41]; // #99c229 brand green
  const darkSlate = [30, 41, 59];      // #1e293b
  const mutedSlate = [100, 116, 139];  // #64748b
  const lightBg = [248, 250, 252];

  // Header Banner
  doc.setFillColor(...darkSlate);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent Line in brand green
  doc.setFillColor(...primaryGreen);
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  // Header Brand & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MOTIWALA PERFUMES', 15, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Admin Rights · Chief Nose Officer (CNO) Evaluation Sheet', 15, 22);

  // Serial No Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryGreen);
  doc.text(sample.serialNo || 'CNO-SAMPLE', pageWidth - 15, 16, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 23, { align: 'right' });

  let y = 46;

  // Helper for section header
  function renderSectionHeader(title) {
    doc.setFillColor(...lightBg);
    doc.roundedRect(14, y, pageWidth - 28, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryGreen);
    doc.text(title.toUpperCase(), 18, y + 5.5);
    y += 12;
  }

  // Helper for 2-column key-value rows
  function renderFieldPair(label1, val1, label2, val2) {
    const col1X = 18;
    const col2X = pageWidth / 2 + 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedSlate);
    doc.text(label1, col1X, y);
    if (label2) doc.text(label2, col2X, y);

    y += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkSlate);
    doc.text(String(val1 || '—'), col1X, y);
    if (label2) doc.text(String(val2 || '—'), col2X, y);

    y += 8;
  }

  // 1. SAMPLE & SUPPLIER SECTION
  renderSectionHeader('01. Sample & Supplier Specification');
  renderFieldPair('Serial Number', sample.serialNo, 'Sample Date', formatDate(sample.sampleDate));
  renderFieldPair('Supplier Name', sample.supplierName, 'Supplier Batch / Code', sample.code);
  renderFieldPair('Fragrance Inspiration', sample.inspiration || 'Original Accord', 'Target Gender / Ideal For', sample.idealFor);
  renderFieldPair('Boxes Received', `${sample.boxesReceived ?? 1} Units / Vials`, 'Linked Store Product', sample.usedInProduct || 'Direct Formulation / Custom');

  const formatsStr = (sample.suitableFor && sample.suitableFor.length) ? sample.suitableFor.join('  •  ') : 'Perfume, Attar';
  renderFieldPair('Application Formats', formatsStr, 'Evaluation Status', sample.status || 'Under Review');

  y += 3;

  // 2. PROFILE & TECHNICAL EVALUATION SECTION
  renderSectionHeader('02. Scent Profile & Technical Longevity');
  renderFieldPair('Olfactory Profile', sample.profile || 'French', 'Ambient Temperature', sample.temperature || 'Ambient');
  renderFieldPair('Received Date', formatDate(sample.receivedDate), 'Received Time', sample.receivedTime || '—');
  renderFieldPair('Concentrate Longevity', sample.concentrateLongevity || '8h+', 'Spray Longevity', sample.sprayLongevity || '12h+');

  y += 3;

  // 3. REMARKS & OBSERVATIONS
  renderSectionHeader('03. Nose Remarks & Formulation Notes');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkSlate);

  const remarksText = sample.remarks || 'No detailed remarks recorded. Fragrance sample is under internal lab evaluation for projection, maceration, and scent curve stability.';
  const splitRemarks = doc.splitTextToSize(remarksText, pageWidth - 36);
  doc.text(splitRemarks, 18, y);
  y += splitRemarks.length * 5 + 10;

  // Sign-off section at bottom
  if (y > 250) {
    doc.addPage();
    y = 30;
  }
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 268, pageWidth - 15, 268);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedSlate);
  doc.text('Motiwala Perfumes · Confidential Internal Evaluation Sheet · Quality Assurance & Fragrance Atelier', 15, 274);
  doc.text('Evaluator Signature: _______________________', pageWidth - 15, 274, { align: 'right' });

  const cleanName = (sample.serialNo || 'CNO-Sample').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanName}_Evaluation_Sheet.pdf`);
}
