/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	useSignInWithEmailAndPassword,
	useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import * as z from "zod";
import { LogIn } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { auth } from "../../../firebase";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import ModalForgotPassword from "./ModalForgotPassword";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

interface SignInFormProps {
	onShowSignUp: () => void;
}

const SignInForm = ({ onShowSignUp }: SignInFormProps) => {
	const [isResetOpen, setIsResetOpen] = useState(false);
	const [signInWithEmailAndPassword, , , signInError] =
		useSignInWithEmailAndPassword(auth);
	const [signInWithGoogle] = useSignInWithGoogle(auth);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const login = async ({ email, password }: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const response = await signInWithEmailAndPassword(email, password);
			if (response) {
				toast({
					title: "Success!",
					description: "You have been signed in.",
				});
			} else {
				toast({
					title: "Error Signing In",
					description: `${signInError?.message}`,
				});
			}
		} catch (error) {
			toast({
				title: "Error Signing In",
				description: `${signInError?.message}`,
			});
		} finally {
			setIsLoading(false);
		}
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
					<Button type="submit" disabled={isLoading}>
						Submit
					</Button>
				</form>
			</Form>
			<Button
				variant="outline"
				disabled={isLoading}
				onClick={async () => {
					const response = await signInWithGoogle();
					if (response) {
						await router.push("/");
						toast({
							title: `Successfully logged in`,
						});
					}
				}}
			>
				<LogIn className="mr-2 h-4 w-4" />
				Google
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
