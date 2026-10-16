export type Status = "present" | "absent" | "permission";
export type Entry = { status: Status; hours?: number };
export type Employee = { id: string; name: string; dept: string; role: string; salary: number; avatar: string };

const av = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&h=160&q=80`;

export const EMPLOYEES: Employee[] = [
  { id: "YC-001", name: "Aarav Sharma", dept: "Engineering", role: "Senior Developer", salary: 95000, avatar: av("1507003211169-0a1dd7228f2d") },
  { id: "YC-002", name: "Priya Nair", dept: "Design", role: "UI/UX Designer", salary: 72000, avatar: av("1494790108377-be9c29b29330") },
  { id: "YC-003", name: "Rahul Verma", dept: "Engineering", role: "Backend Developer", salary: 88000, avatar: av("1472099645785-5658abf4ff4e") },
  { id: "YC-004", name: "Meera Iyer", dept: "HR", role: "HR Manager", salary: 68000, avatar: av("1438761681033-6461ffad8d80") },
  { id: "YC-005", name: "Karthik Raja", dept: "Sales", role: "Account Executive", salary: 56000, avatar: av("1500648767791-00dcc994a43e") },
  { id: "YC-006", name: "Divya Menon", dept: "Finance", role: "Accountant", salary: 64000, avatar: av("1544005313-94ddf0286df2") },
  { id: "YC-007", name: "Vikram Singh", dept: "Sales", role: "Sales Lead", salary: 78000, avatar: av("1506794778202-cad84cf45f1d") },
  { id: "YC-008", name: "Ananya Das", dept: "Design", role: "Brand Designer", salary: 61000, avatar: av("1534528741775-53994a69daeb") },
];

export const DEPT_IMG: Record<string, string> = {
  Engineering: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=300&h=160&q=70",
  Design: "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=300&h=160&q=70",
  HR: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&h=160&q=70",
  Sales: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&h=160&q=70",
  Finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=300&h=160&q=70",
};
export const HERO = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=500&q=70";

export const TODAY = "2026-10-16";
export const MONTHS = ["2026-09", "2026-10"];

export const monthLabel = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
};
export const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export const isWeekend = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const w = new Date(y, m - 1, d).getDay();
  return w === 0 || w === 6;
};

export const weekdays = (month: string) => {
  const [y, mo] = month.split("-").map(Number);
  const n = new Date(y, mo, 0).getDate();
  const out: string[] = [];
  for (let d = 1; d <= n; d++) {
    const date = `${month}-${String(d).padStart(2, "0")}`;
    if (!isWeekend(date)) out.push(date);
  }
  return out;
};

/** Deterministic seed so server/client renders always match. */
export const seed = (): Record<string, Entry> => {
  const recs: Record<string, Entry> = {};
  EMPLOYEES.forEach((e, i) => {
    MONTHS.forEach((m, mi) => {
      weekdays(m).forEach((date) => {
        if (date > TODAY) return;
        const day = Number(date.slice(8));
        const h = (i * 31 + day * 17 + mi * 7) % 23;
        recs[`${e.id}|${date}`] =
          h === 0 ? { status: "absent" } : h <= 3 ? { status: "permission", hours: h === 1 ? 2 : 1 } : { status: "present" };
      });
    });
  });
  return recs;
};
