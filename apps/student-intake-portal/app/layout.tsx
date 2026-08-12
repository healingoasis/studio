import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Intake — Healing Oasis",
  description:
    "Where each student stands on paperwork and on tuition, pulled live from the store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
