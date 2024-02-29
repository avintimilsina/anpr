/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import heroImage from "@/../../public/assets/hero.svg";
import { LuStar } from "react-icons/lu";
import { REVIEWS } from "@/config/marketing";
import { Card, CardContent } from "../ui/card";
import {
	CarouselContent,
	CarouselItem,
	Carousel,
	CarouselPrevious,
	CarouselNext,
} from "../ui/carousel";

const ReviewSection = () => (
	<section className="mx-auto flex max-w-5xl flex-row gap-16 border p-12">
		<div className="flex w-3/5 flex-col gap-6 px-4 py-8">
			<h2 className="text-2xl font-bold md:text-5xl">People Love Us</h2>
			<Carousel
				opts={{
					align: "start",
				}}
				className="flex w-full flex-col"
			>
				<CarouselContent>
					{REVIEWS.map((review) => (
						<CarouselItem key={review.content} className="w-full">
							<div className="p-1">
								<Card className="border-0 bg-transparent shadow-none">
									<CardContent className="flex flex-col items-start justify-center gap-4 p-0">
										<div className="flex flex-row gap-0.5">
											{Array.from({ length: review.rating }, (_, i) => (
												<LuStar
													key={`${review.content}-${i + 1}`}
													fill="#f9a62a"
												/>
											))}
										</div>
										<p className="text-lg opacity-70">{review.content}</p>
										<div className="flex w-full flex-row justify-between">
											<h3 className="text-xl font-semibold">{review.author}</h3>
											<div className="flex flex-row gap-2">
												{/* <CarouselPrevious asChild>
													<Button variant="outline" size="icon">
														<LuChevronLeft className="text-2xl" />
													</Button>
												</CarouselPrevious>
												<CarouselNext asChild>
													<Button variant="default" size="icon">
														<LuChevronRight className="text-2xl" />
													</Button>
												</CarouselNext> */}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious
					variant="outline"
					size="icon"
					className="rounded-none"
				/>
				<CarouselNext variant="default" size="icon" className="rounded-none" />
			</Carousel>
		</div>
		<div className="w-2/5 overflow-hidden border border-black">
			<Image alt="Hero" className="scale-[200%] " src={heroImage} />
		</div>
	</section>
);

export default ReviewSection;
