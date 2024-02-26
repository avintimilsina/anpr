"use client";

import { Drawer } from "vaul";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useMediaQuery from "../hooks/use-media-query";

interface ModalProps {
	children: React.ReactNode;
	className?: string;
	showModal: boolean;
	setShowModal: (open: boolean) => void;
}

const Modal = ({
	children,
	className,
	showModal,
	setShowModal,
}: ModalProps) => {
	const { isMobile } = useMediaQuery();

	if (isMobile) {
		return (
			<Drawer.Root open={showModal} onOpenChange={setShowModal}>
				<Drawer.Overlay className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm" />
				<Drawer.Portal>
					<Drawer.Content
						className={cn(
							"bg-background fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-2xl border",
							className
						)}
					>
						<div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
							<div className="bg-muted-foreground/20 my-3 h-1.5 w-16 rounded-full" />
						</div>
						{children}
					</Drawer.Content>
					<Drawer.Overlay />
				</Drawer.Portal>
			</Drawer.Root>
		);
	}
	return (
		<Dialog open={showModal} onOpenChange={setShowModal}>
			<DialogContent
				className={cn(
					"overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border",
					className
				)}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
