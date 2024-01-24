/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import "@/styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import AdminHeader from "@/components/section/navbar/admin-header";
import Sidebar from "@/components/layout/admin-sidebar";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const [currentUser] = useAuthState(auth);

	// Setting User in the database when logged in
	useEffect(() => {
		const setUser = async () => {
			if (currentUser) {
				await setDoc(
					doc(db, "users", currentUser?.uid),
					{
						email: currentUser?.email,
						photoURL: currentUser?.photoURL,
						displayName: currentUser?.displayName,
						uid: currentUser?.uid,
						phoneNumber: currentUser?.phoneNumber,
						providerData: currentUser?.providerData,
						emailVerified: currentUser?.emailVerified,
						createdAt: currentUser?.metadata?.creationTime,
					},
					{ merge: true }
				);
			}
		};

		// eslint-disable-next-line no-void
		void setUser();
	}, [currentUser]);

	if (router.pathname.startsWith("/admin")) {
		return (
			<NextIntlClientProvider
				locale={router.locale}
				timeZone="UTC"
				messages={pageProps.messages}
			>
				<AdminHeader />
				<div className="flex h-screen overflow-hidden">
					<Sidebar>
						<main className=" flex-1 overflow-y-auto overflow-x-hidden pt-16">
							<Component {...pageProps} />
						</main>
					</Sidebar>
				</div>
			</NextIntlClientProvider>
		);
	}

	return (
		<NextIntlClientProvider
			locale={router.locale}
			timeZone="UTC"
			messages={pageProps.messages}
		>
			<Component {...pageProps} />
			<Toaster richColors />
		</NextIntlClientProvider>
	);
};

export default App;

// Dashboard From Shadcn
// Profile page from Shadcn
// Profile page data update in database
// Schema Define garnu paryo
// Predifined Theme halnu paryo
// Navbar ma  wallet ma kati paisa xa vanera pani dekhaunu paryo
// Paisa load garne option hunu paryo
// Khalti Esewa Stripe
// Email Verification
// (admin side)video upload garne page dinu paryo

// avin 2 4hr
// Rohit 2 4hr
// amisha 6
