/* eslint-disable @typescript-eslint/no-floating-promises */
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import SignInForm from "@/components/forms/sign-in-form";
import SignUpForm from "@/components/forms/sign-up-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "../../../firebase";
import NavBar from "@/components/section/navbar";

const LoginPage = () => {
	const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(false);
	const [currentUser] = useAuthState(auth);
	const router = useRouter();

	useEffect(() => {
		if (currentUser) {
			router.push("/");
		}
	}, [currentUser]);

	return (
		<>
			<NavBar />
			<div className="mt-[5%]">
				<section className="mx-auto max-w-md">
					<h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
						Venefish
					</h1>
					<Card>
						<CardHeader>
							<CardTitle>{isShowingSignUp ? "Sign Up" : "Sign In"}</CardTitle>
							<CardDescription>
								Give them a reason to {isShowingSignUp ? "sign up" : "sign in"}.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isShowingSignUp ? (
								<SignUpForm onShowLogin={() => setIsShowingSignUp(false)} />
							) : (
								<SignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
							)}
						</CardContent>
					</Card>
				</section>
			</div>
		</>
	);
};
export default LoginPage;
