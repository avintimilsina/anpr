/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Check } from "lucide-react";

import { type User } from "firebase/auth";
import { type GetStaticPropsContext } from "next";
import { useRouter } from "next/navigation";
import {
	useAuthState,
	useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLoadingSpinner from "@/components/shared/page-loading-spinner";
import { auth } from "../../../firebase";
import Logo from "@/components/shared/logo";

interface VerifyEmailPageProps {
	currentUser: User;
}
const VerifyEmailPage = ({ currentUser }: VerifyEmailPageProps) => {
	const [sendEmailVerification] = useSendEmailVerification(auth);
	const router = useRouter();
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Card className=" w-full max-w-md">
				<CardHeader>
					<Logo className="my-4" />
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
							router.refresh();
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
							const emailVerification = await sendEmailVerification();
							if (emailVerification) {
								toast.success("Email Verification Sent!");
							}
						}}
					>
						Resend email{" "}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

const VerifyEmail = () => {
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);
	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}

	if (user?.emailVerified) {
		router.push("/");
		return <PageLoadingSpinner />;
	}
	if (!user) {
		router.push("/auth/login");
		return <PageLoadingSpinner />;
	}
	return (
		<div>
			<VerifyEmailPage currentUser={user} />
		</div>
	);
};

export default VerifyEmail;

export async function getStaticProps(context: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../../translations/${context.locale}.json`))
				.default,
		},
	};
}
