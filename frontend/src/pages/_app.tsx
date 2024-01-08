/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "@/styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";

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
		</NextIntlClientProvider>
	);
};

export default App;
