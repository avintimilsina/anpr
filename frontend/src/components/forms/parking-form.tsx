/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
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
import { auth } from "../../../firebase";
import { vehicleEntry } from "@/db/action";

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

const parkingFormSchema = z.object({
	vehicleType: z.enum(possibleTypes),
	vehicleAgeIdentifier: z.string().min(2).max(2).toUpperCase(),
	vehicleNumber: z.coerce.number().min(0).max(9999),
	vehicleState: z.enum(possibleStates),
});

type ParkingFormValues = z.infer<typeof parkingFormSchema>;

interface ParkingFormProps {
	initialValues?: ParkingFormValues & {
		id: string;
	};
	onSuccess?: () => void;
}

const ParkingForm = ({ initialValues, onSuccess }: ParkingFormProps) => {
	const [currentUser] = useAuthState(auth);
	const form = useForm<ParkingFormValues>({
		resolver: zodResolver(parkingFormSchema),
		defaultValues: {
			vehicleType: undefined,
			vehicleAgeIdentifier: "",
			vehicleNumber: undefined,
			vehicleState: undefined,
		},
	});

	const onSubmit = async (data: ParkingFormValues) => {
		if (!currentUser?.uid) {
			toast.error("Not Logged In");
			return;
		}

		if (initialValues) {
			toast.info("Form update goes here", {
				id: "parking-form",
			});
		} else {
			toast.promise(
				vehicleEntry({
					vehicleType: data.vehicleType,
					vehicleState: data.vehicleState,
					vehicleAgeIdentifier: data.vehicleAgeIdentifier,
					vehicleNumber: data.vehicleNumber,
				}),
				{
					loading: "Saving...",
					success: () => {
						form.reset();
						onSuccess?.();
						return "Parked successfully";
					},
					error: "Failed to Park",
				}
			);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid w-full grid-cols-1 justify-center gap-4 md:grid-cols-2">
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
													"justify-between",
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
									<PopoverContent className="p-0">
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
													"justify-between",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value
													? possibleTypes.find(
															(vehicleType) => vehicleType === field.value
														)
													: "Select Vehicle Type"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="p-0">
										<Command>
											<CommandInput placeholder="Search vehicle type..." />
											<CommandEmpty>No vehicle found.</CommandEmpty>
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
									<Input
										placeholder="AA"
										{...field}
										maxLength={2}
										value={field.value.toUpperCase()}
										pattern="[A-Z]{2}"
									/>
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
					<Button className="col-span-2" type="submit">
						Add New Vehicle
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ParkingForm;
