
import React from 'react';
import { InvestmentDetails } from '../types';

interface InvestmentModalProps {
  details: InvestmentDetails | null;
  onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ details, onClose }) => {
  if (!details) return null;

  const minAmount = details.lotSize * details.minPrice;
  const maxAmount = details.lotSize * details.maxPrice;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-300">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-[#0f172a]/50">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Investment Estimate</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Company</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{details.companyName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Lot Size</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{details.lotSize} <span className="text-sm font-normal text-slate-400">shares</span></p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Price Band</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{details.minPrice} - {details.maxPrice}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">Minimum Investment</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">₹{minAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">Maximum Investment</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{maxAmount.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 leading-tight italic">
              * Calculations are based on 1 lot at the upper price band. Actual amounts may vary slightly due to taxes or transaction fees.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all active:scale-[0.98]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
