import {create} from 'zustand';
import {type CardStatus} from '@/domains/cards/cards.types';

export interface CardFiltersState {
  status: CardStatus[];
  labels: string[];
}

export interface CardFiltersActions {
  toggleStatus: (status: CardStatus) => void;
  toggleLabel: (label: string) => void;
  removeStatus: (status: CardStatus) => void;
  removeLabel: (label: string) => void;
  clearStatusFilters: () => void;
  clearLabelFilters: () => void;
  clearAllFilters: () => void;
}

export type CardFiltersStore = CardFiltersState & CardFiltersActions;

export const useCardFiltersStore = create<CardFiltersStore>(set => ({
  status: [],
  labels: [],
  toggleStatus: status =>
    set(state => ({
      status: state.status.includes(status)
        ? state.status.filter(s => s !== status)
        : [...state.status, status],
    })),
  toggleLabel: label =>
    set(state => ({
      labels: state.labels.includes(label)
        ? state.labels.filter(l => l !== label)
        : [...state.labels, label],
    })),
  removeStatus: status =>
    set(state => ({
      status: state.status.filter(s => s !== status),
    })),
  removeLabel: label =>
    set(state => ({
      labels: state.labels.filter(l => l !== label),
    })),
  clearStatusFilters: () => set({status: []}),
  clearLabelFilters: () => set({labels: []}),
  clearAllFilters: () => set({status: [], labels: []}),
}));
