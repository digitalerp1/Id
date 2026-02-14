import React, { useState, useRef } from 'react';
import { Upload, Printer, FileText, Settings, Users, ArrowLeft } from 'lucide-react';
import { parseCSV } from './utils/csvParser';
import { Student, SchoolConfig } from './types';
import PrintLayout from './components/PrintLayout';

const App: React.FC = () => {
  // State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Configuration State
  const [targetUid, setTargetUid] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('My High School');
  const [schoolAddress, setSchoolAddress] = useState<string>('123 Education Lane, Knowledge City');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // View State
  const [view, setView] = useState<'form' | 'preview'>('form');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setAllStudents(parsed);
        // Auto-set the UID from the first record if available just for preview
        if (parsed.length > 0 && parsed[0].uid && !targetUid) {
          setTargetUid(parsed[0].uid);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCards = () => {
    if (!targetUid.trim()) {
      alert("Please enter a UID to filter students.");
      return;
    }
    
    // Filter logic
    const filtered = allStudents.filter(s => s.uid && s.uid.trim() === targetUid.trim());
    
    if (filtered.length === 0) {
      alert("No students found with this UID.");
      return;
    }

    setFilteredStudents(filtered);
    setView('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  const schoolConfig: SchoolConfig = {
    name: schoolName,
    address: schoolAddress,
    logoUrl: logoUrl
  };

  // Render Form View
  if (view === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">ID Card Generator</h1>
              <p className="text-blue-100 text-sm">Upload CSV, Configure, and Print</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Step 1: Upload */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Upload Data Source
              </h2>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-blue-50 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">{csvFile ? csvFile.name : "Click to upload CSV"}</p>
                <p className="text-xs text-gray-400 mt-1">Accepts .csv files only</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>
              {allStudents.length > 0 && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm border border-green-200">
                  Successfully loaded {allStudents.length} records.
                </div>
              )}
            </section>

            {/* Step 2: Configuration */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">School Name</label>
                  <input 
                    type="text" 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. St. Xavier's High School"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Target UID (Filter)</label>
                  <input 
                    type="text" 
                    value={targetUid} 
                    onChange={(e) => setTargetUid(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    placeholder="Enter UID from CSV"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-600">School Address</label>
                  <input 
                    type="text" 
                    value={schoolAddress} 
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="City, State"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-600">School Logo</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      Choose Image
                    </button>
                    {logoUrl && <img src={logoUrl} alt="Preview" className="h-10 w-10 object-contain" />}
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoChange} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Action */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={generateCards}
                disabled={!csvFile || !targetUid}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition
                  ${(!csvFile || !targetUid) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'}
                `}
              >
                <FileText className="w-5 h-5" />
                Generate Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Preview View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Control Header (Hidden when printing) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-3 flex justify-between items-center shadow-sm no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('form')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="font-semibold text-gray-700">Preview Mode: {filteredStudents.length} Cards Generated</span>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
        >
          <Printer className="w-5 h-5" />
          Print PDF
        </button>
      </div>

      <PrintLayout students={filteredStudents} school={schoolConfig} />
    </div>
  );
};

export default App;
