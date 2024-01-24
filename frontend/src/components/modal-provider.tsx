"use client";

import useMounted from "@/components/hooks/use-mounted";
import PaymentModal from "@/components/modals/payment-modal";

const ModalProvider = () => {
	const mounted = useMounted();

	if (!mounted) {
		return null;
	}

	return (
		<>
			<PaymentModal />
			{/* add your own modals here... */}
		</>
	);
};

export default ModalProvider;
