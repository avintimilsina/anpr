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
import Logo from "@/components/shared/logo";

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
					<Logo className="my-4" />
					<Card>
						<CardHeader>
							<CardTitle>{isShowingSignUp ? "Sign Up" : "Sign In"}</CardTitle>
							<CardDescription>
								Let&apos;s get started by{" "}
								{isShowingSignUp ? "signing up" : "signing in"}.
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
