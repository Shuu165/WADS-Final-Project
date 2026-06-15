import { create } from "zustand";

type HintModalState = {
    isOpen: boolean;
    hint: string;
    isLoading: boolean;
    open: (hint: string) => void;
    setLoading: (loading: boolean) => void;
    close: () => void;
};

export const useHintModal = create<HintModalState>((set) => ({
    isOpen: false,
    hint: "",
    isLoading: false,
    open: (hint) => set({ isOpen: true, hint }),
    setLoading: (loading) => set({ isLoading: loading }),
    close: () => set({ isOpen: false, hint: "" }),
}));