import React, { useState } from 'react';
import { Navbar, WorkspaceTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoDesignStudio } from './components/CoDesignStudio';
import { WhatIfLab } from './components/WhatIfLab';
import { AnatomySection } from './components/AnatomySection';
import { CKBRegistryView } from './components/CKBRegistryView';
import { Footer } from './components/Footer';
import { CKBExplorerModal } from './components/CKBExplorerModal';
import { LookbookCardModal } from './components/LookbookCardModal';
import { OutfitProposal, GarmentKey } from './types/vietphuc';
import { HeritageBackground } from './components/HeritageBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('studio');
  const [selectedGarment, setSelectedGarment] = useState<GarmentKey>('ngu_than');

  // Motion control state (persisted in localStorage or respecting system preference)
  const [motionEnabled, setMotionEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('vietphuc_motion');
      if (stored !== null) return stored === 'true';
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return true;
    }
  });

  const handleToggleMotion = () => {
    setMotionEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vietphuc_motion', String(next));
      } catch {}
      return next;
    });
  };

  // Form controls state lifted to App so user selections are preserved across tab changes
  const [dialLevel, setDialLevel] = useState<number>(3);
  const [context, setContext] = useState<string>('streetwear');
  const [style, setStyle] = useState<string>('indigo_denim');
  const [colorPreference, setColorPreference] = useState<string>('auto');
  const [accessoryPreference, setAccessoryPreference] = useState<string>('auto');
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

  // Smooth scroll to studio workspace when user clicks "Bắt đầu phối"
  const handleStartCoDesign = () => {
    const el = document.getElementById('studio-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#120E0D] text-[#F2E9D8] flex flex-col font-sans selection:bg-[#B8342B]/30 selection:text-[#F2E9D8] overflow-x-hidden">
      {/* 1. Global Heritage Background: fixed z-0 behind everything, pointer-events none */}
      <HeritageBackground motionEnabled={motionEnabled} />

      {/* 2. Top Bar with Workspace Tab Switcher (relative z-40) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCKBModal={() => handleOpenCKB()}
        motionEnabled={motionEnabled}
        onToggleMotion={handleToggleMotion}
      />

      {/* 3. Main Workspace (relative z-10 floating above background) */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'studio' && (
          <>
            {/* Lacquer Editorial Hero Section (Integrated into heritage space) */}
            <HeroSection
              onStartCoDesign={handleStartCoDesign}
              onOpenCKB={() => handleOpenCKB()}
              motionEnabled={motionEnabled}
              onToggleMotion={handleToggleMotion}
            />

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
              colorPreference={colorPreference}
              onChangeColorPreference={setColorPreference}
              accessoryPreference={accessoryPreference}
              onChangeAccessoryPreference={setAccessoryPreference}
              customNotes={customNotes}
              onChangeCustomNotes={setCustomNotes}
              onOpenCKB={handleOpenCKB}
              onOpenLookbookCard={handleOpenLookbook}
              onNavigateToWhatIf={() => setActiveTab('what-if')}
              onNavigateToAnatomy={() => setActiveTab('anatomy')}
              motionEnabled={motionEnabled}
            />
          </>
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

      {/* 4. Institutional Footer (relative z-10) */}
      <div className="relative z-10">
        <Footer
          onOpenCKB={() => handleOpenCKB()}
          onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>

      {/* 5. Modals (highest z-50 overlay) */}
      <CKBExplorerModal
        isOpen={ckbModalOpen}
        onClose={() => setCkbModalOpen(false)}
        highlightId={highlightedCKBId}
      />

      <LookbookCardModal
        isOpen={lookbookModalOpen}
        onClose={() => setLookbookModalOpen(false)}
        proposal={activeLookbookProposal}
        onOpenCKB={(id) => handleOpenCKB(id)}
      />
    </div>
  );
}
