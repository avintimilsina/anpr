/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/section/navbar";
import { Input } from "@/components/ui/input";
import heroImage from "@/../public/assets/hero.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import Step from "@/components/cards/step";
import CarouselSection from "@/components/section/carousel";
import { STEPS } from "@/config/marketing";
import ReviewSection from "@/components/section/review";
import Footer from "@/components/section/footer";

const Home = () => (
	<>
		<Navbar />
		<section className="container my-16 mt-[3.5rem] flex flex-col gap-3 p-6 md:gap-6 md:px-16 md:py-8">
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
			<div className="mx-auto flex max-w-5xl flex-row border shadow-[4px_4px_0_rgb(0,0,0)] dark:shadow-[4px_4px_0_rgb(255,255,255)]">
				<div className="w-1/2 overflow-hidden border-r border-black">
					<Image alt="Hero" className="scale-[200%] " src={heroImage} />
				</div>
				<div className="w- flex max-w-lg flex-col gap-6 p-8">
					<h2 className="text-3xl font-semibold">Are You Parking Provider?</h2>
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
		<section className="container my-16 flex max-w-3xl flex-col items-center gap-3 text-center">
			<h2 className="text-3xl font-semibold md:text-6xl">
				We Make It Deference
			</h2>
			<p>
				Parkirun puts the power to park in your hands. Whether you`re looking
				for a spot now or reserving a spot for later. Parkirun has you covered.
			</p>
			<div>
				<Button>HOW IT WORKS</Button>
			</div>
			<div className="my-8 flex flex-row items-center gap-4">
				{STEPS.map((step) => (
					<Step key={step.label} label={step.label} text={step.text} />
				))}
			</div>
		</section>
		<CarouselSection />
		<section className="mx-auto flex max-w-5xl flex-row gap-16 py-24">
			<div className="w-2/5 overflow-hidden border border-black">
				<Image alt="Hero" className="scale-[200%] " src={heroImage} />
			</div>
			<div className="flex w-3/5 flex-col gap-6 px-4 py-8">
				<h2 className="text-2xl font-bold md:text-5xl">
					Easily Ways for Parking From Your Phone
				</h2>
				<p>
					We Make it simple & user friendly for you to take a spot for parking
					with your vehicle!
				</p>
				<div>
					<Link href="/" className={buttonVariants({ variant: "default" })}>
						LEARN MORE
					</Link>
				</div>
			</div>
		</section>
		<ReviewSection />
		<section className="bg-secondary mt-24 border-y">
			<div className="container mx-auto flex max-w-5xl flex-row gap-16 py-12">
				<div className="-8 flex w-2/5 flex-col gap-6">
					<h2 className="text-2xl font-bold md:text-5xl">People Love Us</h2>
					<p>Parking`s Even Easier With the App. Download Now!</p>
					<div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
						<Input
							className="py-6"
							placeholder="Input your email for subscriber"
							type="email"
						/>
						<Button
							className="absolute right-1 top-0 my-1"
							variant="default"
							size="icon"
						>
							<LuChevronRight className="text-2xl" />
						</Button>
					</div>
				</div>
				<div className="w-3/5 overflow-hidden border border-black">
					<Image alt="Hero" className="scale-[200%] " src={heroImage} />
				</div>
			</div>
		</section>
		<Footer />
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
