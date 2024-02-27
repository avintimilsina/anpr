import { Check } from "lucide-react";

import { toast } from "sonner";
import {
	useAuthState,
	useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "../../../firebase";

const VerifyEmail = () => {
	const [sendEmailVerification, , error] = useSendEmailVerification(auth);
	const [currentUser] = useAuthState(auth);
	const router = useRouter();

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Card className=" w-full max-w-md">
				<CardHeader>
					<h1 className="tems-center w-full scroll-m-20 text-4xl font-extrabold lg:text-5xl">
						anpr
					</h1>
					<CardTitle>Verify your email</CardTitle>
					<CardDescription>
						You&apos;ll get an email with a verification link.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{currentUser?.email}
					<Button
						className="w-full"
						onClick={async () => {
							if (currentUser?.emailVerified) {
								toast.success("Email verified!", { id: "verifying-email" });
								await router.push("/");
							} else {
								toast.error("Please verify your email", {
									id: "verifying-email",
								});

								router.reload();
							}
						}}
					>
						<Check className="mr-2 h-4 w-4" /> Already Verified?
					</Button>
				</CardContent>
				<CardFooter>
					Didn&apos;t receive an email?{" "}
					<Button
						variant="link"
						onClick={async () => {
							toast.loading("Resending email...", { id: "verifying-email" });
							const result = await sendEmailVerification();
							if (result) {
								toast.success("Verification email sent!", {
									id: "verifying-email",
								});
							} else
								toast.error(
									error?.message ? error?.message : "An error occurred",
									{
										id: "verifying-email",
									}
								);
						}}
					>
						Resend email{" "}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default VerifyEmail;
