import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clock",
  description: "Advanced Clock App by Deepmind",
};

import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import GlobalAlarmManager from "@/components/GlobalAlarmManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body
        style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}
      >
        <GlobalAlarmManager />
        <Navigation />

        <main style={{
          flex: 1,
          marginLeft: '80px', // Desktop offset
          marginBottom: '80px', // Mobile offset handled by media query
          padding: '24px',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
            <ThemeToggle />
          </div>
          {children}
        </main>

        <style>{`
           @media (max-width: 800px) {
             main {
               margin-left: 0 !important;
               margin-bottom: 80px !important;
             }
           }
         `}</style>
      </body>
    </html>
  );
}
