import { Student } from '../types';

// A robust CSV parser that handles quoted fields containing commas
export const parseCSV = (text: string): Student[] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      } else {
        currentField += char;
      }
    }
  }
  // Push last field/row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/[\s_]+/g, '_')); // Normalize headers
  const data: Student[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0) continue; // Skip empty rows

    const student: any = {};
    headers.forEach((header, index) => {
      // Map known headers safely, otherwise put in object
      if (index < row.length) {
        student[header] = row[index];
      }
    });
    data.push(student as Student);
  }

  return data;
};
