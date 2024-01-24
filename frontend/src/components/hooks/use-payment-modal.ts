import { create } from "zustand";

interface UsePaymentModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const usePaymentModal = create<UsePaymentModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default usePaymentModal;
