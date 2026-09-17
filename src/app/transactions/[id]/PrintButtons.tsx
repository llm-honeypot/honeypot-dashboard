'use client';

import { Download, Printer } from 'lucide-react';

export default function PrintButtons() {
  return (
    <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-end text-xs">
      <button
        onClick={() => window.print()}
        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition"
      >
        <Printer className="w-4 h-4" />
        <span>Print Official Advice</span>
      </button>
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition shadow-lg shadow-blue-900/30">
        <Download className="w-4 h-4" />
        <span>Download PDF Advice</span>
      </button>
    </div>
  );
}
