/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { LuCalendar, LuLoader2 } from "react-icons/lu";
import Dropzone from "../shared/dropzone";
import { Button } from "../ui/button";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import TimePickerDemo from "../shared/time-picker";
import { vehicleEntry } from "@/db/action";
import { type Vehicle } from "@/db/schema";

const videoFormSchema = z.object({
	videoUrl: z.string().url(),
	entryTime: z.date(),
});

type VideoData = {
	license_plate_number: string;
	average_time: number;
	license_text_score: number;
	track_id: number;
};

type VideoFormValues = z.infer<typeof videoFormSchema>;

const VideoForm = () => {
	const form = useForm<VideoFormValues>({
		resolver: zodResolver(videoFormSchema),
		defaultValues: {
			videoUrl: "",
			entryTime: undefined,
		},
		mode: "onChange",
	});
	const onSubmit = async (data: VideoFormValues) => {
		const response = await fetch("http://127.0.0.1:9696/api/video", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: data.videoUrl,
			}),
		});
		const datam = await response.json();

		// @ts-expect-error Type error
		Object.values(datam).forEach(async (video: VideoData) => {
			await vehicleEntry({
				vehicleType: video.license_plate_number[0] as Vehicle["vehicleType"],
				vehicleState: "Bagmati",
				vehicleAgeIdentifier: `${video.license_plate_number[1]}${video.license_plate_number[2]}`,
				vehicleNumber: Number(video.license_plate_number.slice(3)),
				time: dayjs(data.entryTime).add(video.average_time, "seconds").toDate(),
			});
		});

		// toast.promise(
		// 	fetch("http://127.0.0.1:9696/api/video", {
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			url: data.videoUrl,
		// 		}),
		// 	}),
		// 	{
		// 		loading: "Saving...",
		// 		success: async (response) => {
		// 			console.log("Response: ", response);
		// 			console.log("Response Json:  ", await response.json());
		// 			return "Saved successfully";
		// 		},
		// 		error: "Failed",
		// 	}
		// );
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="videoUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Video Url</FormLabel>
							<FormControl>
								<Dropzone
									folder="videos"
									onUpload={field.onChange}
									fileExtension="mp4"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-row items-end gap-4">
					<FormField
						control={form.control}
						name="entryTime"
						render={({ field }) => (
							<FormItem className="flex flex-col items-start md:gap-2">
								<FormLabel className="whitespace-nowrap">
									Video Start Time
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"w-[240px] flex-1 pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													dayjs(field.value).format("MMMM D, YYYY h:mm:ss A")
												) : (
													<span>Pick Video Start Time</span>
												)}
												<LuCalendar className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date(Date.now() - 86400000)
											}
											initialFocus
										/>
										<div className="border-border border-t p-3">
											<TimePickerDemo
												setDate={field.onChange}
												date={field.value}
											/>
										</div>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
						type="submit"
						className="flex flex-row items-center gap-2"
					>
						{form.formState.isSubmitting ? (
							<>
								<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
								Process Video
							</>
						) : (
							"Process Video"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default VideoForm;
