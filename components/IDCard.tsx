import React from 'react';
import { Student, SchoolConfig } from '../types';

interface IDCardProps {
  student: Student;
  school: SchoolConfig;
}

const IDCard: React.FC<IDCardProps> = ({ student, school }) => {
  // Format Date of Birth
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div 
      className="relative bg-white border border-gray-300 overflow-hidden flex flex-col"
      style={{
        width: '86mm',
        height: '54mm',
        borderRadius: '3mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Pattern (Optional Aesthetic) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header - School Info */}
      <div className="bg-blue-800 text-white p-1.5 flex items-center gap-2 h-[14mm] z-10">
        {school.logoUrl ? (
          <img src={school.logoUrl} alt="Logo" className="h-8 w-8 object-contain bg-white rounded-full p-0.5" />
        ) : (
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center text-[8px]">Logo</div>
        )}
        <div className="flex-1 text-center leading-tight overflow-hidden">
          <h1 className="font-bold text-[10px] uppercase tracking-wide truncate w-full">{school.name || "School Name"}</h1>
          <p className="text-[6px] opacity-90 truncate w-full">{school.address || "School Address City, State - Zip"}</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 p-2 gap-2 items-center z-10">
        {/* Photo Section */}
        <div className="flex flex-col items-center justify-center w-[22mm]">
          <div className="w-[20mm] h-[24mm] border border-blue-200 bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm">
            {student.photo_url ? (
              <img 
                src={student.photo_url} 
                alt={student.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/80/100'; // Fallback
                }}
              />
            ) : (
              <span className="text-[8px] text-gray-400">No Photo</span>
            )}
          </div>
          <span className="text-[7px] font-bold mt-1 text-blue-800">
            ID: {student.id_number || student.roll_number || 'N/A'}
          </span>
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col justify-center text-[8px] leading-[1.3] space-y-0.5">
          <h2 className="text-[11px] font-bold text-blue-900 uppercase border-b border-blue-100 pb-0.5 mb-0.5 truncate">
            {student.name}
          </h2>
          
          <div className="grid grid-cols-[35px_1fr] gap-x-1">
            <span className="font-semibold text-gray-600">Class:</span>
            <span className="font-medium text-gray-800 truncate">{student.class}</span>
            
            <span className="font-semibold text-gray-600">Roll No:</span>
            <span className="font-medium text-gray-800">{student.roll_number}</span>

            <span className="font-semibold text-gray-600">DOB:</span>
            <span className="font-medium text-gray-800">{formatDate(student.date_of_birth)}</span>

            <span className="font-semibold text-gray-600">Father:</span>
            <span className="font-medium text-gray-800 truncate">{student.father_name}</span>

            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="font-medium text-gray-800">{student.mobile || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Footer - Signature / Address */}
      <div className="h-[6mm] bg-blue-50 border-t border-blue-100 flex items-center justify-between px-2 z-10">
        <div className="text-[6px] text-gray-500 w-2/3 truncate">
          Addr: {student.address}
        </div>
        <div className="text-[6px] font-bold text-blue-800 w-1/3 text-right">
          Principal Sig.
        </div>
      </div>
    </div>
  );
};

export default IDCard;
