import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { mockTransactions, formatINR } from '@/lib/mockData';
import PrintButtons from './PrintButtons';

export function generateStaticParams() {
  return mockTransactions.map((t) => ({ id: t.id }));
}

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: txnId } = await params;
  const txn = mockTransactions.find((t) => t.id === txnId) || mockTransactions[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <Link
        href="/transactions"
        className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Transaction History</span>
      </Link>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{txn.status} Transaction</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{txn.merchant}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Reference: <code className="text-slate-200">{txn.referenceNumber}</code></p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Transaction Amount</span>
            <span className={`text-3xl font-extrabold ${txn.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
              {txn.type === 'credit' ? '+' : '-'}{formatINR(txn.amount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Payment Overview</h4>

            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span className="font-mono text-white font-bold">{txn.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Category</span>
              <span className="text-slate-200">{txn.category}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Payment Channel</span>
              <span className="text-slate-200">{txn.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Location</span>
              <span className="text-slate-200">{txn.location}</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Party Details</h4>

            <div className="flex justify-between">
              <span className="text-slate-400">Account Debited/Credited</span>
              <span className="text-slate-200 font-semibold">{txn.account}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Counterparty</span>
              <span className="text-slate-200">{txn.senderRecipient}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="text-slate-200">{txn.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Time</span>
              <span className="text-slate-200">{txn.time}</span>
            </div>
          </div>

        </div>

        {txn.notes && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Transaction Note</span>
            <p>{txn.notes}</p>
          </div>
        )}

        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-4 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Audit Metadata</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px] text-slate-400">
            <div>Clearing Node: RBI-NEFT-MUM-04</div>
            <div>Terminal Hash: 90F8A-VAULT-2026</div>
            <div>Encryption: TLS 1.3 AES-GCM</div>
          </div>
        </div>

        <PrintButtons />

      </div>

    </div>
  );
}
