import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Companion from "@/components/Companion";
import { TasksProvider } from "@/context/TasksContext";

export const metadata: Metadata = {
  title: "Klaytic Productivity",
  description: "Next Gen Productivity Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <TasksProvider>
          <div className="flex min-h-screen bg-[#030303] text-neutral-300 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 relative overflow-hidden">
            <AtmosphericBackground />

            <Sidebar />

            <Companion />

            <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth z-10">
              {children}
            </main>
          </div>
        </TasksProvider>
      </body>
    </html>
  );
}
