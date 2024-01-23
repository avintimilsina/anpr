import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "../../../firebase";

interface ModalChangePasswordProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const ModalForgotPassword = ({
	isOpen,
	setIsOpen,
}: ModalChangePasswordProps) => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async () => {
		try {
			setIsLoading(true);
			await sendPasswordResetEmail(auth, email);
			toast.success("Password reset email sent; please check your inbox.");
			setIsOpen(false);
		} catch (error) {
			toast.error("Error");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Forgot password?</DialogTitle>
					<DialogDescription>
						Enter your email to reset your password
					</DialogDescription>
				</DialogHeader>

				<Label htmlFor="email">Email address</Label>
				<Input
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					disabled={isLoading}
					name="email"
					type="email"
					required
				/>

				<p className="-mt-3 text-[0.8rem] text-white/60">
					We will send you a link to reset your password
				</p>
				<Button disabled={isLoading} onClick={() => onSubmit()}>
					Submit
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ModalForgotPassword;
