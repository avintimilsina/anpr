/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/section/navbar";
import { Input } from "@/components/ui/input";
import heroImage from "@/../public/assets/hero.svg";
import parkingImage from "@/../public/assets/parking1.svg";
import tollImage from "@/../public/assets/parking2.svg";
import providerImage from "@/../public/assets/parking-provider.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import Step from "@/components/cards/step";
import CarouselSection from "@/components/section/carousel";
import { STEPS } from "@/config/marketing";
import ReviewSection from "@/components/section/review";
import Footer from "@/components/section/footer";

const Home = () => (
	<main className="flex flex-col gap-32">
		<Navbar />
		<section className="container mt-[4rem] flex flex-col gap-3 p-6 md:gap-6">
			<h1 className="mx-auto max-w-5xl text-balance text-center text-3xl font-semibold md:text-7xl">
				Escape the hassle of manual parking?
			</h1>
			<p className=" text-center text-lg ">
				with our smart parking solution for a seamless experience!
			</p>
			<div className="mx-auto flex w-full max-w-xs flex-row justify-center lg:max-w-sm">
				<Link
					href="/dashboard"
					className={buttonVariants({ variant: "default", size: "lg" })}
				>
					Get Started
				</Link>
			</div>
			<Image alt="Hero" className="mx-auto my-8 w-[76vw]" src={heroImage} />
			<div className="mx-auto flex max-w-5xl flex-row border shadow-[4px_4px_0_rgb(0,0,0)] dark:shadow-[4px_4px_0_rgb(255,255,255)]">
				<div className="w-1/2 overflow-hidden border-r border-black">
					<Image alt="Hero" className="scale-[300%] " src={providerImage} />
				</div>
				<div className="w- flex max-w-lg flex-col justify-center gap-6 p-8">
					<h2 className="text-3xl font-semibold">Are You Parking Provider?</h2>
					<p>
						Whether you&apos;ve got a garage to fill or you&apos;ew trying to
						make your city and events more manageable, ParkSathi makes
						everything easier
					</p>
					<div>
						<Link href="/" className={buttonVariants({ variant: "default" })}>
							LEARN MORE
						</Link>
					</div>
				</div>
			</div>
		</section>
		<section className="container flex max-w-3xl flex-col items-center gap-3 text-center">
			<h2 className="text-3xl font-semibold md:text-6xl">
				We Make It Difference
			</h2>
			<p>
				ParkSathi make it easier to park in your city without the hassle of
				traditional parking. ParkSathi has you covered.
			</p>
			<div>
				<Button>HOW IT WORKS</Button>
			</div>
			<div className="my-8 flex flex-row items-center gap-4">
				{STEPS.map((step) => (
					<Step
						key={step.label}
						label={step.label}
						text={step.text}
						image={step.image}
					/>
				))}
			</div>
		</section>
		<CarouselSection />
		<section className="mx-auto flex max-w-5xl flex-row gap-16 py-24">
			<div className="w-2/5 overflow-hidden border border-black">
				<Image alt="Hero" className="scale-[300%] " src={parkingImage} />
			</div>
			<div className="flex w-3/5 flex-col gap-6 px-4 py-8">
				<h2 className="text-2xl font-bold md:text-5xl">
					Park effortlessly with just a tap!
				</h2>
				<p>
					We make your parking experience a lot simpler, better and
					user-friendly.
				</p>
				<div>
					<Link href="/" className={buttonVariants({ variant: "default" })}>
						LEARN MORE
					</Link>
				</div>
			</div>
		</section>
		<ReviewSection />
		<section className="bg-secondary -mb-16 border-y dark:text-black">
			<div className="container mx-auto flex max-w-5xl flex-row gap-16 px-0 py-12">
				<div className="flex w-2/5 flex-col justify-center gap-6">
					<h2 className="text-2xl font-bold md:text-5xl">Park. Go.</h2>
					<p>
						ParkingSathi is the new easiest and hottest parking solution in th
						town.
					</p>
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
					<Image alt="Hero" className="scale-[300%] " src={tollImage} />
				</div>
			</div>
		</section>
		<Footer />
	</main>
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
