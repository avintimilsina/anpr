/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
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
import Dropzone from "../shared/dropzone";
import LicensePlatePreview from "../cards/plate-preview";
import { auth, db } from "../../../firebase";

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
	// driverLicense: z.string().url(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
	initialValues?: VehicleFormValues & {
		id: string;
	};
	onSuccess?: () => void;
}

const VehicleForm = ({ initialValues, onSuccess }: VehicleFormProps) => {
	const [currentUser] = useAuthState(auth);
	const form = useForm<VehicleFormValues>({
		resolver: zodResolver(vehicleFormSchema),
		defaultValues: {
			vehicleType: undefined,
			vehicleAgeIdentifier: "",
			vehicleNumber: undefined,
			vehicleState: undefined,
		},
	});

	const onSubmit = async (data: VehicleFormValues) => {
		if (initialValues) {
			toast.info("Form update goes here", {
				id: "vehicle-form",
			});
		} else {
			const vehicleId = `${data.vehicleType}-${data.vehicleAgeIdentifier}-${data.vehicleNumber}`;

			toast.promise(
				setDoc(doc(db, "vehicles", vehicleId), {
					id: vehicleId,
					...data,
					uid: currentUser?.uid,
					status: "PENDING",
				}),
				{
					loading: "Saving...",
					success: () => {
						form.reset();
						onSuccess?.();
						return "Saved successfully";
					},
					error: "Failed to save",
				}
			);
		}
	};

	return (
		<Form {...form}>
			<LicensePlatePreview
				vehicleAgeIdentifier={form.watch("vehicleAgeIdentifier")}
				vehicleNumber={form.watch("vehicleNumber")}
				vehicleState={form.watch("vehicleState")}
				vehicleType={form.watch("vehicleType")}
			/>

			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-row items-end justify-center gap-2 md:flex-row">
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
													? possibleTypes.find(
															(vehicleType) => vehicleType === field.value
														)
													: "Select Vehicle Type"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-[200px] p-0">
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
				<FormField
					control={form.control}
					name="vehicleBluebook"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vehicle Bluebook Image</FormLabel>
							<FormControl>
								{field.value ? (
									<div className="flex max-h-[112px] max-w-[112px] flex-row gap-4">
										<Image
											objectFit="cover"
											alt="Bluebook"
											src={field.value}
											height="112"
											width="112"
										/>
										<div className="flex flex-col justify-center">
											<Button type="button" variant="destructive">
												Delete
											</Button>
										</div>
									</div>
								) : (
									<Dropzone
										folder="bluebook"
										onUpload={field.onChange}
										fileExtension="jpg"
									/>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name="driverLicense"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Driver License Image</FormLabel>
							<FormControl>
								<Dropzone onUpload={field.onChange} fileExtension="jpg" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<Button type="submit">Add New Vehicle</Button>
			</form>
		</Form>
	);
};

export default VehicleForm;
