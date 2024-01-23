/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetStaticPropsContext } from "next";
import NavBar from "@/components/section/navbar";

const Home = () => (
	<div>
		<NavBar />
	</div>
);

export default Home;

export async function getStaticProps(context: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../translations/${context.locale}.json`))
				.default,
		},
	};
}
