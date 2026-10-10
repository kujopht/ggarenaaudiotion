import { OutfitProposal, GarmentKey } from '../types/vietphuc';
export const HISTORY_SCHEMA_VERSION = 1;
const STORAGE_KEY = 'kujo_rewear_history_v1';
const MAX_ENTRIES = 20;
export interface DesignHistoryEntry { v: number; id: string; createdAt: number; garment: GarmentKey; context: string; style: string; dialLevel: number; colorPreference: string; accessoryPreference: string; customNotes: string; proposals: OutfitProposal[]; source: string; }
export type NewHistoryEntry = Omit<DesignHistoryEntry, 'v' | 'id' | 'createdAt'>;
function isValidEntry(e: any): e is DesignHistoryEntry { return (!!e && e.v === HISTORY_SCHEMA_VERSION && typeof e.id === 'string' && typeof e.createdAt === 'number' && Array.isArray(e.proposals) && e.proposals.length > 0); }
export function loadHistory(): DesignHistoryEntry[] { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return []; const parsed = JSON.parse(raw); if (!Array.isArray(parsed)) return []; return parsed.filter(isValidEntry); } catch { return []; } }
function persist(history: DesignHistoryEntry[]): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 10))); } catch {} } }
export function saveHistoryEntry(entry: NewHistoryEntry): DesignHistoryEntry[] { const full: DesignHistoryEntry = { v: HISTORY_SCHEMA_VERSION, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now(), ...entry }; const history = loadHistory().filter((e) => !(e.garment === full.garment && e.context === full.context && e.style === full.style && e.dialLevel === full.dialLevel && e.createdAt > Date.now() - 5000)); const next = [full, ...history].slice(0, MAX_ENTRIES); persist(next); return next; }
export function deleteHistoryEntry(id: string): DesignHistoryEntry[] { const next = loadHistory().filter((e) => e.id !== id); persist(next); return next; }
export function clearHistory(): DesignHistoryEntry[] { try { localStorage.removeItem(STORAGE_KEY); } catch {} return []; }
export const GARMENT_NAMES: Record<GarmentKey, string> = { ngu_than: 'Áo Ngũ Thân', ao_tac: 'Áo Tấc', nhat_binh: 'Áo Nhật Bình' };