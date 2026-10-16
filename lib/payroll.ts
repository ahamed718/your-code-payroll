import { Employee, Entry, weekdays } from "./data";

export const WORKING_DAYS = 22;      // standard working days per month
export const FREE_PERMISSION_HRS = 2; // free permission hours per month
export const MAX_PERMISSION_PER_SESSION = 2;
export const ALLOWANCE_RATE = 0.1;   // HRA / allowances
export const PF_RATE = 0.06;
export const TAX_RATE = 0.05;

const r2 = (n: number) => Math.round(n * 100) / 100;

export function calcPayroll(emp: Employee, month: string, recs: Record<string, Entry>) {
  let present = 0, absent = 0, permHours = 0, permSessions = 0, unmarked = 0;
  for (const d of weekdays(month)) {
    const r = recs[`${emp.id}|${d}`];
    if (!r) { unmarked++; continue; }
    if (r.status === "absent") absent++;
    else {
      present++; // permission days are still paid days
      if (r.status === "permission") { permHours += r.hours ?? 0; permSessions++; }
    }
  }
  const perDay = emp.salary / WORKING_DAYS;
  const perHour = perDay / 8;
  const excessHours = Math.max(0, permHours - FREE_PERMISSION_HRS);
  const absentDeduction = absent * perDay;
  const permissionPenalty = excessHours * perHour;
  const allowances = emp.salary * ALLOWANCE_RATE;
  const pf = emp.salary * PF_RATE;
  const tax = emp.salary * TAX_RATE;
  const net = emp.salary - absentDeduction - permissionPenalty + allowances - (pf + tax);
  return {
    present, absent, permHours, permSessions, unmarked, excessHours,
    perDay: r2(perDay), perHour: r2(perHour),
    absentDeduction: r2(absentDeduction), permissionPenalty: r2(permissionPenalty),
    allowances: r2(allowances), pf: r2(pf), tax: r2(tax), net: r2(net),
  };
}
