/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const possibleTypes = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
] as const;

const possibleStates = [
	"Koshi",
	"Madhesh",
	"Bagmati",
	"Gandaki",
	"Lumbini",
	"Karnali",
	"Sudurpaschim",
] as const;

const vehicleFormSchema = z.object({
	type: z.enum(possibleTypes),
	ageIdentifier: z.string().min(2).max(2).toUpperCase(),
	number: z.coerce.number().min(0).max(9999),
	state: z.enum(possibleStates),
	bluebook: z.string().url(),
	license: z.string().url(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const VehicleForm = () => {
	const { getValues } = useForm<VehicleFormValues>();

	const form = useForm<VehicleFormValues>({
		resolver: zodResolver(vehicleFormSchema),
		defaultValues: {
			type: undefined,
			ageIdentifier: "",
			number: undefined,
			state: undefined,
		},
	});

	const onSubmit = async (_data: VehicleFormValues) => {};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="">
				<div
					className="flex flex-row items-center justify-center gap-2
 "
				>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Vehicle Type</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													"w-[200px] justify-between",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value
													? possibleTypes.find((type) => type === field.value)
													: "Select Vechile Type"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-[200px] p-0">
										<Command>
											<CommandInput placeholder="Search vehicle type..." />
											<CommandEmpty>No vechile found.</CommandEmpty>
											<CommandGroup>
												{possibleTypes.map((type) => (
													<CommandItem
														value={type}
														key={type}
														onSelect={() => {
															form.setValue("type", type);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																type === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{type}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								{/* <FormDescription>
								This is the vechile type that will be used in the dashboard.
							</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="ageIdentifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Age Identifier</FormLabel>
								<FormControl>
									<Input placeholder="AA" {...field} maxLength={2} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="number"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Vehicle Number</FormLabel>
								<FormControl>
									<Input placeholder="0000-9999" {...field} maxLength={4} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>State</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													"w-[200px] justify-between",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value
													? possibleStates.find(
															(state) => state === field.value
														)
													: "Select State"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-[200px] p-0">
										<Command>
											<CommandInput placeholder="Search state..." />
											<CommandEmpty>No state found.</CommandEmpty>
											<CommandGroup>
												{possibleStates.map((state) => (
													<CommandItem
														value={state}
														key={state}
														onSelect={() => {
															form.setValue("state", state);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																state === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{state}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								{/* <FormDescription>
								This is the state that will be used in the dashboard.
							</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="mt-5 flex w-full flex-col items-center">
					<div className="text-xl font-semibold">Licence Plate Preview</div>
					<div className="flex flex-col items-center p-8 px-8">
						<div>{getValues().state}Bagmati </div>
						<div className="bg-wavy flex h-full flex-row items-center justify-center gap-4 text-black">
							<div className="flex flex-row items-center gap-4">
								<h2 className="text-4xl">{getValues().type}B</h2>
								<h2 className="text-4xl">{getValues().ageIdentifier}DE</h2>
								<h2 className="text-4xl">{getValues().number}1234</h2>
							</div>
						</div>
						{/* <p className="label-text text-center italic">
							Make sure the note apperarnce matches the preview here.
						</p> */}
					</div>
				</div>
			</form>
		</Form>
	);
};

export default VehicleForm;
