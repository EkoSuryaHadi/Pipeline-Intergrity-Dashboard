import React from 'react';
import Sidebar from '../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar is now a self-contained Client Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-72 p-4 pt-20 md:p-8 lg:p-12 transition-all duration-300 w-full">
        <header className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">Dashboard Prediksi Integritas Pipa Migas</h1>
            <p className="text-blue-100/80 text-sm md:text-lg font-light leading-relaxed">AI-Driven Pipeline Integrity Management System <br className="hidden md:block"/>(API 1160 / ASME B31.8S)</p>
        </header>
        
        {children}
      </main>
    </div>
  );
}
