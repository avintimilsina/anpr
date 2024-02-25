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
	vehicleType: z.enum(possibleTypes),
	vehicleAgeIdentifier: z.string().min(2).max(2).toUpperCase(),
	vehicleNumber: z.coerce.number().min(0).max(9999),
	vehicleState: z.enum(possibleStates),
	vehicleBluebook: z.string().url(),
	driverLicense: z.string().url(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const VehicleForm = () => {
	
	const form = useForm<VehicleFormValues>({
		resolver: zodResolver(vehicleFormSchema),
		defaultValues: {
			vehicleType: undefined,
			vehicleAgeIdentifier: "",
			vehicleNumber: undefined,
			vehicleState: undefined,
		},
	});
	
	const { formState } = useForm<VehicleFormValues>();
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
						name="vehicleType"
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
													? possibleTypes.find((vehicleType) => vehicleType === field.value)
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
												{possibleTypes.map((vehicleType) => (
													<CommandItem
														value={vehicleType}
														key={vehicleType}
														onSelect={() => {
															form.setValue("vehicleType", vehicleType);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																vehicleType === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{vehicleType}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="vehicleAgeIdentifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Age Identifier</FormLabel>
								<FormControl>
									<Input placeholder="AA" {...field} maxLength={2} value={field.value.toUpperCase()} pattern="[A-Z]{2}"/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="vehicleNumber"
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
						name="vehicleState"
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
															(vehicleState) => vehicleState === field.value
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
												{possibleStates.map((vehicleState) => (
													<CommandItem
														value={vehicleState}
														key={vehicleState}
														onSelect={() => {
															form.setValue("vehicleState", vehicleState);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																vehicleState === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{vehicleState}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				
			</form>
			
			<div className="mt-5 flex w-full flex-col items-center">
					<div className="text-xl font-semibold">Licence Plate Preview</div>
					<div className="flex flex-col items-center p-8 px-8">
						<div>{form.watch("vehicleState") ?? "Bagmati"} </div>
						<div className="bg-wavy flex h-full flex-row items-center justify-center gap-4 text-black">
							<div className="flex flex-row items-center gap-4">
								<h2 className="text-4xl" >{form.watch("vehicleType") ?? "B"}</h2>
								<h2 className="text-4xl">{form.watch("vehicleAgeIdentifier").toLocaleUpperCase() || "DE"}</h2>
								<h2 className="text-4xl">{form.watch("vehicleNumber") ?? "1234"}</h2>
							</div>
						</div>
						<p className="label-text text-center italic">
							Make sure the licence plate  apperarnce matches the preview here.
						</p>
					</div>
				</div>
		</Form>
		
	);
};

export default VehicleForm;
