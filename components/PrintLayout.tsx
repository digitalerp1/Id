import React from 'react';
import { Student, SchoolConfig } from '../types';
import IDCard from './IDCard';

interface PrintLayoutProps {
  students: Student[];
  school: SchoolConfig;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ students, school }) => {
  // Chunk students into groups of 10 (2 columns * 5 rows)
  const chunkSize = 10;
  const pages = [];
  for (let i = 0; i < students.length; i += chunkSize) {
    pages.push(students.slice(i, i + chunkSize));
  }

  if (students.length === 0) {
    return <div className="text-center p-10 text-gray-500">No students found for this UID.</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 printable-area-container">
      {pages.map((pageStudents, pageIndex) => (
        <div
          key={pageIndex}
          className="bg-white relative shadow-lg mb-8 mx-auto printable-area"
          style={{
            width: '210mm',
            height: '297mm',
            paddingTop: '13.5mm', // Vertically centered roughly: (297 - (54*5 + 10*4))/2 ≈ 13.5mm
            paddingBottom: '13.5mm',
            // Side padding calculation: (210 - (86*2 + 10)) / 2 = 14mm
            paddingLeft: '14mm',
            paddingRight: '14mm',
            pageBreakAfter: 'always',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 86mm)',
            gridTemplateRows: 'repeat(5, 54mm)',
            columnGap: '10mm',
            rowGap: '10mm',
          }}
        >
          {/* Cutting Guides Layer - Dashed lines between cols and rows */}
          <div className="absolute inset-0 pointer-events-none z-50">
             {/* Center Vertical Line */}
             <div 
               className="absolute border-l border-dashed border-gray-300"
               style={{ left: '50%', top: '10mm', bottom: '10mm' }}
             ></div>
             
             {/* Horizontal Lines between rows */}
             {[1, 2, 3, 4].map(row => (
               <div 
                 key={row}
                 className="absolute border-t border-dashed border-gray-300 w-full"
                 style={{ 
                   top: `calc(13.5mm + ${row * 54}mm + ${(row - 1) * 10}mm + 5mm)` // Approx middle of gap
                 }}
               ></div>
             ))}
          </div>

          {pageStudents.map((student, idx) => (
            <div key={student.id || idx} className="z-10">
              <IDCard student={student} school={school} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PrintLayout;
