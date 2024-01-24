"use client";

import { LuCommand } from "react-icons/lu";

import usePaymentModal from "@/components/hooks/use-payment-modal";
import Modal from "@/components/shared/modal";
import PaymentForm from "@/components/forms/payment-form";

const PaymentModal = () => {
	const signInModal = usePaymentModal();

	return (
		<Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
			<div className="w-full">
				<div className="bg-background flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center md:px-16">
					<LuCommand className="size-10" />
					<h3 className="font-urban text-2xl font-bold">Load Wallet</h3>
					<p className="bg-background text-primary hover:bg-background flex flex-row gap-1 underline-offset-4 ">
						Balance: Rs 0.00
					</p>
				</div>
				<div className="bg-secondary/50 flex flex-col space-y-4 px-4 py-8 md:px-16">
					<PaymentForm />
				</div>
			</div>
		</Modal>
	);
};

export default PaymentModal;
