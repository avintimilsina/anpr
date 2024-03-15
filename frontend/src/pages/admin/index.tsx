/* eslint-disable no-nested-ternary */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Timestamp } from "firebase/firestore";
import { useFormatter } from "next-intl";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ParkingForm from "@/components/forms/parking-form";
import VideoForm from "@/components/forms/video-form";
import { calculateParking, statusToColor } from "@/components/helpers";
import BillModal from "@/components/modals/bill-modal";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getParking } from "@/db/query";
import { type Parking } from "@/db/schema";
import { CELL_ACTIONS } from "@/db/action";

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
		<div className="flex flex-col gap-4 lg:max-w-6xl">
			<div className="flex flex-col items-end gap-2 md:flex-row">
				<div className="flex-grow p-4">
					<h2 className="text-2xl font-bold tracking-tight ">Vehicle Entry</h2>
					<p className="text-muted-foreground mb-4">
						Enter vehicle details either manually or from a video.
					</p>
					<ParkingForm />
				</div>
				<div className="h-full flex-grow p-4">
					<VideoForm />
				</div>
			</div>

			<hr />

			<div className="m-4 flex-1 space-y-6 lg:max-w-6xl">
				<div className="flex flex-row items-center justify-between">
					<div className="space-y-0.5">
						<h2 className="text-2xl font-bold tracking-tight">Parking</h2>
						<p className="text-muted-foreground">
							Every vehicle that&apos;s parked or was parked.
						</p>
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
												<Badge variant={statusToColor(value.status)}>
													{value.status}
												</Badge>
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
											<TableCell className="flex flex-row justify-end gap-2">
												{CELL_ACTIONS.filter((action) =>
													action.showOnStatus.includes(value.status)
												).map((action) => (
													<Button
														className="w-full"
														size="sm"
														variant={action.variant as ButtonProps["variant"]}
														onClick={() => action.onClick(value)}
													>
														{action.label}
													</Button>
												))}
												<BillModal parking={value} />
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
