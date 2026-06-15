import { create } from "zustand";

type ChatModalStore = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useChatModal = create<ChatModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));