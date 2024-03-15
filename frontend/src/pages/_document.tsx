/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Head, Main, NextScript } from "next/document";
import { GeistSans } from "geist/font/sans";

const Document = () => (
	<Html lang="en">
		<Head>
			<title>ParkSathi</title>
			<link rel="manifest" href="site.webmanifest" />
		</Head>
		<body className={`${GeistSans.className}`}>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default Document;
