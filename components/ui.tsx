import { X } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes } from "react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden>
        <defs>
          <linearGradient id="yc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366f1" /><stop offset="1" stopColor="#312e81" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#yc)" />
        <rect x="2" y="2" width="44" height="44" rx="12" fill="none" stroke="#a5b4fc" strokeOpacity=".5" />
        <path d="M13 12l5 5M23 12l-5 9v4" stroke="#c7d2fe" strokeWidth="0" />
        <text x="24" y="30" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" fontFamily="ui-sans-serif,system-ui">YC</text>
        <path d="M14 36h20" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        <div className={`text-lg font-extrabold tracking-[0.18em] ${light ? "text-white" : "text-slate-900"}`}>YOUR CODE</div>
        <div className={`text-[10px] uppercase tracking-widest ${light ? "text-indigo-200" : "text-slate-500"}`}>Attendance &amp; Payroll</div>
      </div>
    </div>
  );
}

export function Button({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  const v = {
    primary: "bg-indigo-700 text-white hover:bg-indigo-800",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  }[variant];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50 ${v} ${className}`} />;
}

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
);

const tones = {
  green: "bg-emerald-100 text-emerald-700", red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-800", slate: "bg-slate-100 text-slate-600", indigo: "bg-indigo-100 text-indigo-700",
};
export const Badge = ({ tone = "slate", children }: { tone?: keyof typeof tones; children: ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
);

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4" onClick={onClose}>
      <div className={`mt-8 w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-xl bg-white shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-slate-100"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200";
