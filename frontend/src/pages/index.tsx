/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetStaticPropsContext } from "next";
import { Button } from "@/components/ui/button";

const Home = () => (
	<div>
		<h1 className="bg-slate-400 text-center text-3xl font-bold underline">
			ANPR
		</h1>
		<Button variant="default">Default</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="destructive">Destructive</Button>
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
