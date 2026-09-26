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

  // Form controls state lifted to App so user selections are preserved across tab changes
  const [dialLevel, setDialLevel] = useState<number>(3);
  const [context, setContext] = useState<string>('streetwear');
  const [style, setStyle] = useState<string>('indigo_denim');
  const [customNotes, setCustomNotes] = useState<string>('');
  
  // State lifted to App so proposals and provenance source are retained across tab switches
  const [studioProposals, setStudioProposals] = useState<OutfitProposal[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
  const [proposalSource, setProposalSource] = useState<string | null>(null);

  const [ckbModalOpen, setCkbModalOpen] = useState(false);
  const [highlightedCKBId, setHighlightedCKBId] = useState<string | null>(null);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [activeLookbookProposal, setActiveLookbookProposal] = useState<OutfitProposal | null>(null);

  const selectedProposal = studioProposals[selectedPlanIndex] || null;

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

  const handleSelectPlanIndex = (idx: number) => {
    setSelectedPlanIndex(idx);
  };

  const handleUpdateProposals = (newProposals: OutfitProposal[], source: string) => {
    setStudioProposals(newProposals);
    setSelectedPlanIndex(0);
    setProposalSource(source);
  };

  // When user changes garment in Studio, clear old proposals + plan index + source
  const handleChangeGarment = (g: GarmentKey) => {
    if (selectedGarment !== g) {
      setSelectedGarment(g);
      setStudioProposals([]);
      setSelectedPlanIndex(0);
      setProposalSource(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121418] text-[#E2E6EC] flex flex-col font-sans selection:bg-[#0D9488]/30 selection:text-[#2DD4BF]">
      {/* Top Bar with Workspace Tab Switcher */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCKBModal={() => handleOpenCKB()}
      />

      {/* Main Workspace (Direct Tab View) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'studio' && (
          <CoDesignStudio
            proposals={studioProposals}
            selectedPlanIndex={selectedPlanIndex}
            onSelectPlanIndex={handleSelectPlanIndex}
            onUpdateProposals={handleUpdateProposals}
            proposalSource={proposalSource}
            selectedGarment={selectedGarment}
            onChangeGarment={handleChangeGarment}
            dialLevel={dialLevel}
            onChangeDialLevel={setDialLevel}
            context={context}
            onChangeContext={setContext}
            style={style}
            onChangeStyle={setStyle}
            customNotes={customNotes}
            onChangeCustomNotes={setCustomNotes}
            onOpenCKB={handleOpenCKB}
            onOpenLookbookCard={handleOpenLookbook}
            onNavigateToWhatIf={() => setActiveTab('what-if')}
          />
        )}

        {activeTab === 'what-if' && (
          <WhatIfLab
            currentGarment={selectedGarment}
            activeProposal={selectedProposal}
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
