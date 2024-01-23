/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import "@/styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { Toaster } from "sonner";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

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
