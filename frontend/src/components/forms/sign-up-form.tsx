/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "../../../firebase";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(100),
});
interface SignUpFormProps {
	onShowLogin: () => void;
	onSignUp?: () => void;
}

const SignUpForm = ({ onShowLogin, onSignUp }: SignUpFormProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [sendEmailVerification, , error] = useSendEmailVerification(auth);
	const router = useRouter();

	const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
		toast.loading("Loading", { id: "signing-up" });
		const currentUser = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		if (currentUser) {
			toast.success("Account created!", { id: "signing-up" });
			onSignUp?.();
			toast.loading("Loading", { id: "verifying-email" });
			const result = await sendEmailVerification();
			if (result) {
				toast.success("Verification email sent!", { id: "verifying-email" });
			} else
				toast.error(error?.message ? error?.message : "An error occurred", {
					id: "verifying-email",
				});

			await router.push("/auth/verify");
		} else
			toast.error(error?.message ? error?.message : "An error occurred", {
				id: "signing-up",
			});
	};
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(signup)}>
					<fieldset
						disabled={form.formState.isSubmitting}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
					</fieldset>
				</form>
			</Form>

			<p className="mt-4 text-sm">
				Already joined?{" "}
				<Button variant="link" onClick={onShowLogin}>
					Sign in instead.
				</Button>
			</p>
		</>
	);
};

export default SignUpForm;
