/* eslint-disable @typescript-eslint/no-misused-promises */
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
import { ThemeProvider } from "next-themes";
import { useAuthState } from "react-firebase-hooks/auth";
import { onIdTokenChanged } from "firebase/auth";
import nookies from "nookies";
import { auth, db } from "../../firebase";
import Sidebar from "@/components/layout/admin-sidebar";
import Navbar from "@/components/section/navbar";
import ModalProvider from "@/components/modal-provider";
import DashboardLayout from "@/components/layout/dashboard-sidebar";

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

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken();
				nookies.set(undefined, "token", token, { path: "/" });
			} else {
				nookies.set(undefined, "token", "", { path: "/" });
			}
		});

		return unsubscribe;
	}, []);

	if (router.pathname.startsWith("/dashboard")) {
		return (
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<NextIntlClientProvider
					locale={router.locale}
					timeZone="UTC"
					messages={pageProps.messages}
				>
					<Navbar />
					<div className="flex h-screen overflow-hidden">
						<DashboardLayout>
							<main className="flex-1 overflow-y-auto overflow-x-hidden">
								<Component {...pageProps} />
							</main>
						</DashboardLayout>
					</div>
					<ModalProvider />
					<Toaster richColors />
				</NextIntlClientProvider>
			</ThemeProvider>
		);
	}

	if (router.pathname.startsWith("/admin")) {
		return (
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<NextIntlClientProvider
					locale={router.locale}
					timeZone="UTC"
					messages={pageProps.messages}
				>
					<Navbar />
					<div className="flex h-screen overflow-hidden">
						<Sidebar>
							<main className="flex-1 overflow-y-auto overflow-x-hidden pt-16">
								<Component {...pageProps} />
							</main>
						</Sidebar>
					</div>
					<ModalProvider />
					<Toaster richColors />
				</NextIntlClientProvider>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<NextIntlClientProvider
				locale={router.locale}
				timeZone="UTC"
				messages={pageProps.messages}
			>
				<Component {...pageProps} />
				<ModalProvider />
				<Toaster richColors />
			</NextIntlClientProvider>
		</ThemeProvider>
	);
};

export default App;

// // Dashboard From Shadcn
// // Profile page from Shadcn
// // Profile page data update in database
// Schema Define garnu paryo
// // Predifined Theme halnu paryo
// // Navbar ma  wallet ma kati paisa xa vanera pani dekhaunu paryo
// // Paisa load garne option hunu paryo
// // Khalti Esewa Stripe
// // Email Verification
// (admin side)video upload garne page dinu paryo

// avin 2 4hr
// Rohit 2 4hr
// amisha 6

// User dashboard
// Driving license ko photo (optional)
// multiple vehicle entry
// License plate entry
// Bluebook ko photo entry
// Show biling

// admin side
// vehicle verification (aprovr decline)
// add vehicle -> entry vehicle -> exit vehicle manually
// add vehicle via video
// Generate Billing
