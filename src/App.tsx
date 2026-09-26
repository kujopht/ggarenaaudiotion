import React, { useState } from 'react';
import { Navbar, WorkspaceTab } from './components/Navbar';
import { CoDesignStudio } from './components/CoDesignStudio';
import { WhatIfLab } from './components/WhatIfLab';
import { AnatomySection } from './components/AnatomySection';
import { CKBRegistryView } from './components/CKBRegistryView';
import { Footer } from './components/Footer';
import { CKBExplorerModal } from './components/CKBExplorerModal';
import { LookbookCardModal } from './components/LookbookCardModal';
import { OutfitProposal, GarmentKey } from './types/vietphuc';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('studio');
  const [selectedGarment, setSelectedGarment] = useState<GarmentKey>('ngu_than');
  const [selectedProposal, setSelectedProposal] = useState<OutfitProposal | null>(null);

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

  const handleSelectProposal = (proposal: OutfitProposal) => {
    setSelectedProposal(proposal);
    setSelectedGarment(proposal.garment_type);
  };

  const handleChangeGarment = (g: GarmentKey) => {
    setSelectedGarment(g);
    // If the active proposal belongs to another garment, clear it to avoid mismatch
    if (selectedProposal && selectedProposal.garment_type !== g) {
      setSelectedProposal(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#221F1C] flex flex-col font-sans">
      {/* Top Bar with Workspace Tab Switcher */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCKBModal={() => handleOpenCKB()}
      />

      {/* Main Workspace (Direct Tab View) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <CoDesignStudio
            activeProposal={selectedProposal}
            onSelectProposal={handleSelectProposal}
            selectedGarment={selectedGarment}
            onChangeGarment={handleChangeGarment}
            onOpenCKB={handleOpenCKB}
            onOpenLookbookCard={handleOpenLookbook}
            onNavigateToWhatIf={() => setActiveTab('what-if')}
          />
        )}

        {activeTab === 'what-if' && (
          <WhatIfLab
            currentGarment={selectedGarment}
            activeProposal={selectedProposal}
            onClearActiveProposal={() => setSelectedProposal(null)}
            onOpenCKB={handleOpenCKB}
          />
        )}

        {activeTab === 'anatomy' && (
          <AnatomySection onOpenCKB={handleOpenCKB} />
        )}

        {activeTab === 'ckb' && (
          <CKBRegistryView />
        )}
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
