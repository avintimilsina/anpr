/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/router";
import * as z from "zod";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { auth } from "../../../firebase";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import ModalForgotPassword from "../modals/modal-forgot-password";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

interface SignInFormProps {
	onShowSignUp: () => void;
}

const SignInForm = ({ onShowSignUp }: SignInFormProps) => {
	const [isResetOpen, setIsResetOpen] = useState(false);
	const [signInWithGoogle] = useSignInWithGoogle(auth);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const login = async ({ email, password }: z.infer<typeof formSchema>) => {
		toast.promise(signInWithEmailAndPassword(auth, email, password), {
			loading: "Logging In...",
			success: "Logged In!",
			error: (err: any) => err.message ?? "An error occured",
		});
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(login)} className="space-y-6">
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

					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-full"
					>
						Submit
					</Button>
				</form>
			</Form>
			<Button
				type="button"
				className="mt-4 flex w-full flex-row gap-2"
				variant="outline"
				disabled={form.formState.isSubmitting}
				onClick={async () => {
					const response = await signInWithGoogle();
					if (response) {
						await router.push("/");
						toast.success(`Successfully logged in`);
					}
				}}
			>
				<FcGoogle className=" h-5 w-5" />
				Continue with Google
			</Button>
			<p className="mt-4 text-sm">
				Not a member?{" "}
				<Button variant="link" onClick={onShowSignUp}>
					Sign up instead.
				</Button>
			</p>
			<p className="text-sm">
				Forgot password?{" "}
				<Button variant="link" onClick={() => setIsResetOpen(true)}>
					Reset
				</Button>
			</p>
			<ModalForgotPassword isOpen={isResetOpen} setIsOpen={setIsResetOpen} />
		</>
	);
};

export default SignInForm;
