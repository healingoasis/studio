import type { Metadata } from "next";
import "./globals.css";
import ThemePreview from "./theme-preview";

/**
 * Applies Daniel's saved preview choice before the first paint, so switching to light
 * does not flash dark on every navigation. Only a development aid — see theme-preview.tsx.
 */
const NO_FLASH = `try{var c=localStorage.getItem('ho-theme-preview');if(c==='light'||c==='dark')document.documentElement.setAttribute('data-theme',c)}catch(e){}`;

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
    // suppressHydrationWarning: the no-flash script stamps data-theme onto <html> before
    // React hydrates, which React would otherwise report as a mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        {children}
        <ThemePreview />
      </body>
    </html>
  );
}
