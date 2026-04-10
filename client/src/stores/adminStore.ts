import { create } from "zustand";

type SaveAction = (() => Promise<void>) | null;

interface AdminState {
  isEditMode: boolean;
  saveAction: SaveAction;
  setEditMode: (value: boolean) => void;
  registerSaveAction: (action: SaveAction) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isEditMode: false,
  saveAction: null,
  setEditMode: (value) => set({ isEditMode: value }),
  registerSaveAction: (action) => set({ saveAction: action }),
}));
