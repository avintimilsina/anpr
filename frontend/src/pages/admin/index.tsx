/* eslint-disable no-nested-ternary */

import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
	doc,
	serverTimestamp,
	updateDoc,
	type Timestamp,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFormatter } from "next-intl";
import { toast } from "sonner";
import Dropzone from "@/components/shared/dropzone";
import ParkingForm from "@/components/forms/parking-form";
import { type Parking } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateParking } from "@/components/helpers";
import { Input } from "@/components/ui/input";
import { getParking } from "@/db/query";
import { db } from "../../../firebase";

dayjs.extend(relativeTime);

const DashboardHome = () => {
	const format = useFormatter();
	const [status, setStatus] = useState<Parking["status"] | undefined>();
	const [search, setSearch] = useState("");
	const [values, loading, error] = useCollectionData<Parking>(
		getParking(status),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	return (
		<div className="flex flex-col gap-4 lg:max-w-5xl">
			<div className="flex flex-col items-end gap-2 md:flex-row">
				<div className="flex-grow p-4">
					<ParkingForm />
				</div>
				<div className="h-full flex-grow p-4">
					<Dropzone
						onUpload={(url) => console.log("Download URL", url)} // Pass the handler function
						fileExtension="mp4" // Set the expected file extension
						folder="videos"
					/>
				</div>
			</div>

			<div className="m-4 flex-1 space-y-6 lg:max-w-5xl">
				<div className="flex flex-row items-center justify-between">
					<div className="space-y-0.5">
						<h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
						<p className="text-muted-foreground">Manage your vehicles here.</p>
					</div>
					<div className="flex flex-row gap-2">
						<Input
							type="search"
							placeholder="Search Parking Id or Vehicle Id"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Select
							value={status}
							onValueChange={(val) => setStatus(val as Parking["status"])}
						>
							<SelectTrigger className="w-[180px] min-w-[130px]">
								<SelectValue placeholder="Select Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Status</SelectLabel>
									<SelectItem value="BOOKED">BOOKED</SelectItem>
									<SelectItem value="PARKED">PARKED</SelectItem>
									<SelectItem value="COMPLETED">COMPLETED</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<Button
							onClick={() => {
								setStatus(undefined);
								setSearch("");
							}}
							variant="destructive"
						>
							Clear Filter
						</Button>
					</div>
				</div>

				<div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ParkingID</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Entry Time</TableHead>
								<TableHead>Exit Time</TableHead>
								<TableHead>Vehicle Id</TableHead>
								<TableHead className="text-right">Amount</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						{loading ? (
							<TableBody>
								{Array.from({ length: 10 }).map((_, i) => (
									<TableRow
										key={`table-body-row-${i + 1}`}
										className="hover:bg-transparent"
									>
										{Array.from({ length: 6 }).map((_, i) => (
											<TableCell key={`table-body-column-${i + 1}`}>
												<Skeleton className="h-6 w-full" />
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						) : values?.length ? (
							<TableBody>
								{values
									?.filter(
										(value) =>
											value.id.includes(search) ||
											value.vehicleId.includes(search)
									)
									.map((value) => (
										<TableRow key={value.id}>
											<TableCell className="font-medium">{value.id}</TableCell>
											<TableCell className="font-medium">
												{value.status}
											</TableCell>
											<TableCell>
												{dayjs(
													(value.entry as Timestamp)?.toMillis() ?? Date.now()
												).format("YYYY-MM-DD HH:mm:ss")}
											</TableCell>
											<TableCell>
												{value.exit
													? dayjs(
															(value.exit as Timestamp)?.toMillis() ??
																Date.now()
														).format("YYYY-MM-DD HH:mm:ss")
													: "N/A"}
											</TableCell>
											<TableCell>{value.vehicleId}</TableCell>
											<TableCell className="text-right">
												{format.number(
													calculateParking(
														value.entry as Timestamp,
														value.exit as Timestamp
													),
													{ style: "currency", currency: "NPR" }
												)}
											</TableCell>
											<TableCell>
												<Button
													className="w-full"
													size="sm"
													variant="destructive"
													onClick={() => {
														toast.promise(
															updateDoc(doc(db, "parkings", value.id), {
																exit: serverTimestamp(),
																status: "COMPLETED",
															} satisfies Partial<Parking>),
															{
																loading: "Updating...",
																success: "Updated Successfully !",
																error: "An Error Occured !",
															}
														);
													}}
												>
													Exit
												</Button>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									{error
										? `An Error Occured ! ${error?.name}-${error?.code}`
										: "No results"}
								</TableCell>
							</TableRow>
						)}
					</Table>
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
