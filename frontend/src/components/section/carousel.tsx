/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import { useFormatter } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CITIES } from "@/config/marketing";

const CarouselSection = () => {
	const format = useFormatter();
	return (
		<section className="container">
			<Carousel
				opts={{
					align: "start",
				}}
				className="max-h-96 w-full"
			>
				<CarouselContent>
					<CarouselItem className="md:basis-2/5 lg:basis-1/2">
						<div className="h-full p-1">
							<Card className="bg-background h-full border-0 shadow-none">
								<CardContent className="flex h-full max-w-xl flex-col items-start justify-center gap-6 p-16">
									<h2 className="text-3xl font-semibold md:text-6xl">
										Parking by Location
									</h2>
									<p>
										ParkSathi is making parking easier in over 300 locations
										across all major cities in Nepal.
									</p>
									<Input
										placeholder="Search location parking/town name"
										type="search"
									/>
									<div>
										<Button size="lg">EXPLORE LOCATION</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
					{CITIES.map((city) => (
						<CarouselItem
							key={city.name}
							className="max-w-xs md:basis-1/5 lg:basis-2/5 "
						>
							<div className="p-1">
								<Card className=" shadow-[0px_0px_0px_rgb(0,0,0)] transition-all ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgb(0,0,0)] dark:shadow-[0px_0px_0px_rgb(255,255,255)] dark:hover:shadow-[3px_3px_0_rgb(255,255,255)]">
									<CardContent className="relative flex aspect-square flex-col items-center justify-center p-6">
										<div className="h-[300px] overflow-hidden object-fill">
											<Image
												alt="hero"
												objectFit="fill"
												height={300}
												width={300}
												src={city.image}
											/>
										</div>
										<CardFooter className="flex w-full flex-col items-start gap-0.5 px-0 pb-0 pt-2">
											<h3 className="text-sm font-semibold">{city.name}</h3>
											<p className="text-xs opacity-50">{city.address}</p>
											<div className="my-2 flex w-full flex-row justify-between text-xs">
												<p>{city.ambience}</p>
												<p>
													{format.number(city.distance / 1000, {
														style: "unit",
														unit: "kilometer",
													})}
												</p>
												<p>{city.rating}</p>
											</div>
										</CardFooter>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
};

export default CarouselSection;
