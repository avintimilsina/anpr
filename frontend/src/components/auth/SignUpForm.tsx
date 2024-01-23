/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth, db } from "../../../firebase";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(100),
});
interface SignUpFormProps {
	onShowLogin: () => void;
	onSignUp?: () => void;
}

const SignUpForm = ({ onShowLogin, onSignUp }: SignUpFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [createUserWithEmailAndPassword, , ,] =
		useCreateUserWithEmailAndPassword(auth);

	const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const response = await createUserWithEmailAndPassword(email, password);
			if (response) {
				await setDoc(doc(db, "users", response?.user.uid), {
					email: response?.user.email,
					uid: response?.user.uid,
					createdAt: response?.user.metadata?.creationTime,
				});
				toast({ title: "Account created!" });
				onSignUp?.();
			}
		} catch (signUpError: any) {
			if ("code" in signUpError && signUpError.code.includes("already")) {
				toast({ title: "User already exists" });
			} else {
				toast({
					title: "Error signing up",
					description: `${signUpError.message}`,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(signup)}>
					<fieldset disabled={isLoading} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormDescription>
										A valid email is required to watch locked specials.
									</FormDescription>
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
									<FormDescription>
										Must be at least 8 characters long.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Sign Up</Button>
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
