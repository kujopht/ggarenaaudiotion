import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoDesignStudio } from './components/CoDesignStudio';
import { WhatIfLab } from './components/WhatIfLab';
import { AnatomySection } from './components/AnatomySection';
import { ManifestoSection } from './components/ManifestoSection';
import { Footer } from './components/Footer';
import { CKBExplorerModal } from './components/CKBExplorerModal';
import { LookbookCardModal } from './components/LookbookCardModal';
import { OutfitProposal } from './types/vietphuc';

export default function App() {
  const [ckbModalOpen, setCkbModalOpen] = useState(false);
  const [highlightedCKBId, setHighlightedCKBId] = useState<string | null>(null);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [activeLookbookProposal, setActiveLookbookProposal] = useState<OutfitProposal | null>(null);

  const handleOpenCKB = (evidenceId?: string) => {
    if (evidenceId) {
      setHighlightedCKBId(evidenceId);
    } else {
      setHighlightedCKBId(null);
    }
    setCkbModalOpen(true);
  };

  const handleOpenLookbook = (proposal: OutfitProposal) => {
    setActiveLookbookProposal(proposal);
    setLookbookModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1E1B18] font-sans flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenCKB={() => handleOpenCKB()}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Editorial Hero Marquee */}
        <HeroSection
          onStartCoDesign={() => handleScrollToSection('studio')}
          onOpenCKB={() => handleOpenCKB()}
        />

        {/* Mode 1: Co-Design Studio & Cultural Audit */}
        <CoDesignStudio
          onOpenCKB={handleOpenCKB}
          onOpenLookbookCard={handleOpenLookbook}
        />

        {/* Mode 2: "What If...?" Heritage Experimentation Simulator */}
        <div id="what-if" className="py-12 px-6 max-w-7xl mx-auto border-b border-stone-200">
          <WhatIfLab
            currentGarment="ngu_than"
            onOpenCKB={handleOpenCKB}
          />
        </div>

        {/* Anatomical Schematic & Heritage Invariants */}
        <AnatomySection onOpenCKB={handleOpenCKB} />

        {/* Cultural Audit Governance Manifesto */}
        <ManifestoSection onOpenCKB={() => handleOpenCKB()} />
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenCKB={() => handleOpenCKB()}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* CKB Explorer Modal */}
      <CKBExplorerModal
        isOpen={ckbModalOpen}
        onClose={() => setCkbModalOpen(false)}
        highlightId={highlightedCKBId}
      />

      {/* Lookbook Export Card Modal */}
      <LookbookCardModal
        isOpen={lookbookModalOpen}
        onClose={() => setLookbookModalOpen(false)}
        proposal={activeLookbookProposal}
      />
    </div>
  );
}
