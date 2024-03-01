/* eslint-disable no-nested-ternary */

import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
	doc,
	query,
	serverTimestamp,
	updateDoc,
	type Timestamp,
	type DocumentData,
	type Query,
	collection,
	where,
	orderBy,
} from "firebase/firestore";
import dayjs from "dayjs";
import { useFormatter } from "next-intl";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
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
import { Button, type ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateParking, statusToColor } from "@/components/helpers";
import { Input } from "@/components/ui/input";
import { auth, db } from "../../../firebase";
import { Badge } from "@/components/ui/badge";
import BillModal from "@/components/modals/bill-modal";

const CELL_ACTIONS = [
	{
		label: "Cancel",
		variant: "destructive",
		showOnStatus: ["BOOKED"],
		onClick: (vehicleId: string) => {
			toast.promise(
				updateDoc(doc(db, "parkings", vehicleId), {
					exit: serverTimestamp(),
					status: "COMPLETED",
				} satisfies Partial<Parking>),
				{
					loading: "Updating...",
					success: "Updated Successfully !",
					error: "An Error Occured !",
				}
			);
		},
	},
];

const DashboardHome = () => {
	const format = useFormatter();
	const [currentUser] = useAuthState(auth);
	const [status, setStatus] = useState<Parking["status"] | undefined>();
	const [search, setSearch] = useState("");
	const [values, loading, error] = useCollectionData<Parking>(
		status
			? (query(
					collection(db, "parkings"),
					where("status", "==", status),
					where("uid", "==", currentUser?.uid ?? "not-found"),
					orderBy("status", "desc"),
					orderBy("createdAt", "desc")
				) as Query<Parking, DocumentData>)
			: (query(
					collection(db, "parkings"),
					where("uid", "==", currentUser?.uid ?? "not-found"),
					orderBy("status", "desc"),
					orderBy("createdAt", "desc")
				) as Query<Parking, DocumentData>),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	return (
		<div className="m-4 flex-1 space-y-6 lg:max-w-5xl">
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Parking</h2>
					<p className="text-muted-foreground">
						Every vehicle that you parked.
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
														(value.exit as Timestamp)?.toMillis() ?? Date.now()
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
											{CELL_ACTIONS.filter((action) =>
												action.showOnStatus.includes(value.status)
											).map((action) => (
												<Button
													className="w-full"
													size="sm"
													variant={action.variant as ButtonProps["variant"]}
													onClick={() => action.onClick(value.id)}
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
							<TableCell colSpan={7} className="h-24 text-center">
								{error
									? `An Error Occured ! ${error?.name}-${error?.code}`
									: "No results"}
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</div>
	);
};

export default DashboardHome;
