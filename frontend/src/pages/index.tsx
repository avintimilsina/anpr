/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/section/navbar";
import { Input } from "@/components/ui/input";
import heroImage from "@/../public/assets/hero.svg";
import { buttonVariants } from "@/components/ui/button";

const Home = () => (
	<>
		<Navbar />
		<section className="mt-[3.5rem] flex flex-col gap-3 p-6 md:gap-6 md:px-16 md:py-8">
			<h1 className="mx-auto max-w-5xl text-center text-3xl font-semibold md:text-7xl">
				Do you need some space for parking your Vehicle?
			</h1>
			<p className=" text-center text-lg ">
				Book the Best Spaces & Save Up to 50%
			</p>
			<div className="mx-auto w-full max-w-xs lg:max-w-sm">
				<Input placeholder="Search location parking, town name" type="search" />
			</div>
			<Image alt="Hero" className="mx-auto my-8 w-[76vw]" src={heroImage} />
			<div className="mx-auto flex max-w-5xl flex-row border shadow-[4px_4px_0_rgb(0,0,0)]">
				<div className="w-2/5 overflow-hidden">
					<Image alt="Hero" className="scale-[200%]" src={heroImage} />
				</div>
				<div className="flex w-3/5 max-w-lg flex-col gap-6 p-8">
					<h2 className="text-3xl font-semibold">Are You Parkin Provider?</h2>
					<p>
						Whether you`ve got a garage to fill or you`re trying to make your
						city and events rnore manageable, Parkirun makes everything easier
					</p>
					<div>
						<Link href="/" className={buttonVariants({ variant: "default" })}>
							LEARN MORE
						</Link>
					</div>
				</div>
			</div>
		</section>
	</>
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
