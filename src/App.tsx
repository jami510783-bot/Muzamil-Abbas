import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InvestigatePage } from './pages/InvestigatePage';
import { PracticePage } from './pages/PracticePage';
import { TeachMePage } from './pages/TeachMePage';
import { AboutPage } from './pages/AboutPage';
import { SampleCase } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSample, setSelectedSample] = useState<SampleCase | null>(null);

  const handleSelectSampleCase = (sample: SampleCase) => {
    setSelectedSample(sample);
    setActiveTab('investigate');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectSampleCase={handleSelectSampleCase}
          />
        )}

        {activeTab === 'investigate' && (
          <InvestigatePage initialSample={selectedSample} />
        )}

        {activeTab === 'practice' && <PracticePage />}

        {activeTab === 'teachme' && <TeachMePage />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
