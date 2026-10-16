import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOUR CODE | Attendance & Payroll",
  description: "Employee attendance and payroll management for YOUR CODE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
