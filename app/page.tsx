"use client";
import { useMemo, useState } from "react";
import { LayoutDashboard, Users, CalendarCheck, Wallet, Clock, CheckCircle2, Printer, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { EMPLOYEES, DEPT_IMG, HERO, MONTHS, TODAY, Entry, Status, seed, weekdays, monthLabel, fmt, isWeekend } from "@/lib/data";
import { calcPayroll, FREE_PERMISSION_HRS, MAX_PERMISSION_PER_SESSION, WORKING_DAYS } from "@/lib/payroll";
import { Badge, Button, Card, Logo, Modal, inputCls } from "@/components/ui";

type Tab = "overview" | "employees" | "attendance" | "payroll";
const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "payroll", label: "Payroll", icon: Wallet },
];

const statusBadge = (e?: Entry) =>
  !e ? <Badge>Not marked</Badge> :
  e.status === "present" ? <Badge tone="green">Present</Badge> :
  e.status === "absent" ? <Badge tone="red">Absent</Badge> :
  <Badge tone="amber">Permission · {e.hours}h</Badge>;

export default function Page() {
  const [tab, setTab] = useState<Tab>("overview");
  const [recs, setRecs] = useState<Record<string, Entry>>(seed);
  const [month, setMonth] = useState(MONTHS[1]);
  const [empId, setEmpId] = useState(EMPLOYEES[0].id);
  const [modal, setModal] = useState<"mark" | "perm" | "slip" | null>(null);

  const save = (id: string, date: string, entry: Entry) => setRecs((r) => ({ ...r, [`${id}|${date}`]: entry }));

  const stats = useMemo(() => {
    const todays = EMPLOYEES.map((e) => recs[`${e.id}|${TODAY}`]);
    const marked = todays.filter(Boolean).length;
    const attended = todays.filter((t) => t && t.status !== "absent").length;
    const payable = EMPLOYEES.reduce((s, e) => s + calcPayroll(e, month, recs).net, 0);
    const perms = EMPLOYEES.reduce((s, e) => s + calcPayroll(e, month, recs).permSessions, 0);
    return { pct: marked ? Math.round((attended / marked) * 100) : 0, payable, perms };
  }, [recs, month]);

  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const pay = calcPayroll(emp, month, recs);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <nav className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${tab === id ? "bg-indigo-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon size={16} /><span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModal("perm")}><Clock size={16} />Log Permission</Button>
            <Button onClick={() => setModal("mark")}><Plus size={16} />Mark Attendance</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold capitalize">{tab}</h1>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${inputCls} !w-auto`} aria-label="Month">
            {MONTHS.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
        </div>

        {tab === "overview" && (
          <>
            <div className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO} alt="Team collaborating" className="h-44 w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-indigo-950/90 to-indigo-900/30 px-6 text-white">
                <p className="text-2xl font-bold">Welcome back, YOUR CODE team</p>
                <p className="text-sm text-indigo-100">Today is {TODAY} · {WORKING_DAYS} standard working days per month</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { l: "Total Employees", v: String(EMPLOYEES.length), i: Users },
                { l: "Today's Attendance", v: `${stats.pct}%`, i: TrendingUp },
                { l: "Monthly Payroll Payable", v: fmt(stats.payable), i: Wallet },
                { l: "Approved Permissions", v: String(stats.perms), i: CheckCircle2 },
              ].map(({ l, v, i: Icon }) => (
                <Card key={l} className="flex items-center justify-between p-5">
                  <div><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>
                  <div className="rounded-lg bg-indigo-50 p-3 text-indigo-700"><Icon size={22} /></div>
                </Card>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(DEPT_IMG).map(([d, img]) => (
                <div key={d} className="relative h-24 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={d} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-end bg-slate-900/50 p-3">
                    <span className="text-sm font-semibold text-white">{d} · {EMPLOYEES.filter((e) => e.dept === d).length}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "employees" && (
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>{["Employee", "ID", "Department", "Base Salary", "Today"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EMPLOYEES.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={e.avatar} alt={e.name} className="h-10 w-10 rounded-full object-cover" />
                        <div><p className="font-medium">{e.name}</p><p className="text-xs text-slate-500">{e.role}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{e.id}</td>
                    <td className="px-4 py-3"><Badge tone="indigo">{e.dept}</Badge></td>
                    <td className="px-4 py-3 font-medium">{fmt(e.salary)}</td>
                    <td className="px-4 py-3">{statusBadge(recs[`${e.id}|${TODAY}`])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "attendance" && (
          <Card className="overflow-x-auto p-4">
            <div className="mb-3 flex gap-3 text-xs">
              <Badge tone="green">P = Present</Badge><Badge tone="red">A = Absent</Badge><Badge tone="amber">Nh = Permission hours</Badge>
            </div>
            <table className="text-center text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white px-3 py-2 text-left">Employee</th>
                  {weekdays(month).map((d) => <th key={d} className="px-1 py-2 font-medium text-slate-500">{Number(d.slice(8))}</th>)}
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="sticky left-0 whitespace-nowrap bg-white px-3 py-2 text-left font-medium">{e.name}</td>
                    {weekdays(month).map((d) => {
                      const r = recs[`${e.id}|${d}`];
                      const cls = !r ? "bg-slate-100 text-slate-400" : r.status === "present" ? "bg-emerald-100 text-emerald-700" : r.status === "absent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800";
                      return (
                        <td key={d} className="p-0.5">
                          <div className={`flex h-7 w-8 items-center justify-center rounded font-semibold ${cls}`}>
                            {!r ? "·" : r.status === "present" ? "P" : r.status === "absent" ? "A" : `${r.hours}h`}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "payroll" && (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="space-y-4 p-5">
              <label className="block text-sm font-medium">Employee
                <select value={empId} onChange={(e) => setEmpId(e.target.value)} className={`${inputCls} mt-1`}>
                  {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                </select>
              </label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-50 p-3"><p className="text-xl font-bold text-emerald-700">{pay.present}</p><p className="text-xs text-slate-500">Present</p></div>
                <div className="rounded-lg bg-red-50 p-3"><p className="text-xl font-bold text-red-700">{pay.absent}</p><p className="text-xs text-slate-500">Absent</p></div>
                <div className="rounded-lg bg-amber-50 p-3"><p className="text-xl font-bold text-amber-700">{pay.permHours}h</p><p className="text-xs text-slate-500">Permission</p></div>
              </div>
              <p className="text-xs text-slate-500">Per-day {fmt(pay.perDay)} · Per-hour {fmt(pay.perHour)} · {pay.unmarked} unmarked days</p>
              <Button className="w-full" onClick={() => setModal("slip")}><Printer size={16} />View Salary Slip</Button>
            </Card>
            <Card className="p-5 lg:col-span-2"><Breakdown emp={emp} month={month} pay={pay} /></Card>
          </div>
        )}
      </main>

      {modal === "mark" && <MarkModal onClose={() => setModal(null)} onSave={save} />}
      {modal === "perm" && <PermModal onClose={() => setModal(null)} onSave={save} recs={recs} />}
      {modal === "slip" && (
        <Modal title="Salary Slip" wide onClose={() => setModal(null)}>
          <div id="slip" className="bg-white p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <Logo />
              <div className="text-right text-sm"><p className="font-semibold">Salary Slip</p><p className="text-slate-500">{monthLabel(month)}</p></div>
            </div>
            <div className="my-4 flex items-center gap-3 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={emp.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div><p className="font-semibold">{emp.name}</p><p className="text-slate-500">{emp.id} · {emp.role} · {emp.dept}</p></div>
            </div>
            <Breakdown emp={emp} month={month} pay={pay} />
            <p className="mt-6 text-center text-xs text-slate-400">Computer-generated slip · YOUR CODE</p>
          </div>
          <div className="no-print flex justify-end gap-2 border-t px-5 py-3">
            <Button variant="outline" onClick={() => setModal(null)}>Close</Button>
            <Button onClick={() => window.print()}><Printer size={16} />Print / Save PDF</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Breakdown({ emp, month, pay }: { emp: (typeof EMPLOYEES)[number]; month: string; pay: ReturnType<typeof calcPayroll> }) {
  const rows: [string, string, "" | "plus" | "minus"][] = [
    ["Base Salary", fmt(emp.salary), ""],
    [`Absent deduction (${pay.absent} d × ${fmt(pay.perDay)})`, fmt(pay.absentDeduction), "minus"],
    [`Excess permission (${pay.excessHours}h of ${pay.permHours}h; first ${FREE_PERMISSION_HRS}h free)`, fmt(pay.permissionPenalty), "minus"],
    ["Allowances (10%)", fmt(pay.allowances), "plus"],
    ["Provident Fund (6%)", fmt(pay.pf), "minus"],
    ["Income Tax (5%)", fmt(pay.tax), "minus"],
  ];
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{monthLabel(month)} breakdown</p>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {rows.map(([l, v, s]) => (
            <tr key={l}>
              <td className="py-2 text-slate-600">{l}</td>
              <td className={`py-2 text-right font-medium ${s === "minus" ? "text-red-600" : s === "plus" ? "text-emerald-600" : ""}`}>
                {s === "minus" ? "− " : s === "plus" ? "+ " : ""}{v}
              </td>
            </tr>
          ))}
          <tr className="bg-indigo-50"><td className="px-2 py-3 font-bold text-indigo-900">Net Pay</td><td className="px-2 py-3 text-right text-lg font-bold text-indigo-900">{fmt(pay.net)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function MarkModal({ onClose, onSave }: { onClose: () => void; onSave: (id: string, d: string, e: Entry) => void }) {
  const [id, setId] = useState(EMPLOYEES[0].id);
  const [date, setDate] = useState(TODAY);
  const [status, setStatus] = useState<Exclude<Status, "permission">>("present");
  const [err, setErr] = useState("");
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!date) return setErr("Please choose a date.");
    if (isWeekend(date)) return setErr("Weekends are not working days.");
    if (date > TODAY) return setErr("Cannot mark attendance for a future date.");
    onSave(id, date, { status });
    onClose();
  };
  return (
    <Modal title="Mark Daily Attendance" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4 p-5">
        <select value={id} onChange={(e) => setId(e.target.value)} className={inputCls} aria-label="Employee">
          {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <input type="date" value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        <div className="grid grid-cols-2 gap-2">
          {(["present", "absent"] as const).map((s) => (
            <button type="button" key={s} onClick={() => setStatus(s)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize ${status === s ? (s === "present" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") : "border-slate-300"}`}>{s}</button>
          ))}
        </div>
        {err && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle size={14} />{err}</p>}
        <Button type="submit" className="w-full">Save Attendance</Button>
      </form>
    </Modal>
  );
}

function PermModal({ onClose, onSave, recs }: { onClose: () => void; onSave: (id: string, d: string, e: Entry) => void; recs: Record<string, Entry> }) {
  const [id, setId] = useState(EMPLOYEES[0].id);
  const [date, setDate] = useState(TODAY);
  const [hours, setHours] = useState(1);
  const [err, setErr] = useState("");
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!date) return setErr("Please choose a date.");
    if (isWeekend(date)) return setErr("Weekends are not working days.");
    if (date > TODAY) return setErr("Cannot log permission for a future date.");
    if (!(hours > 0 && hours <= MAX_PERMISSION_PER_SESSION)) return setErr(`Permission must be between 0.5 and ${MAX_PERMISSION_PER_SESSION} hours per session.`);
    onSave(id, date, { status: "permission", hours });
    onClose();
  };
  const used = calcPayroll(EMPLOYEES.find((e) => e.id === id)!, date.slice(0, 7), recs).permHours;
  return (
    <Modal title="Request / Log Permission" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4 p-5">
        <select value={id} onChange={(e) => setId(e.target.value)} className={inputCls} aria-label="Employee">
          {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <input type="date" value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className={inputCls} aria-label="Hours">
          {[0.5, 1, 1.5, 2].map((h) => <option key={h} value={h}>{h} hour{h !== 1 ? "s" : ""}</option>)}
        </select>
        <p className="text-xs text-slate-500">Used this month: {used}h · first {FREE_PERMISSION_HRS}h free, excess is deducted at the hourly rate.</p>
        {err && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle size={14} />{err}</p>}
        <Button type="submit" className="w-full">Log Permission</Button>
      </form>
    </Modal>
  );
}
