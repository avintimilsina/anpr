import { Html, Head, Main, NextScript } from "next/document";
import { GeistSans } from "geist/font/sans";

const Document = () => (
	<Html lang="en">
		<Head />
		<body className={`${GeistSans.className}`}>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default Document;
