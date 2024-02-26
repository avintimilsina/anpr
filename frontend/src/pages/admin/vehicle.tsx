/* eslint-disable no-nested-ternary */

import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
	type DocumentData,
	type Query,
	collection,
	query,
	where,
	type CollectionReference,
} from "firebase/firestore";
import { type Vehicle as IVehicle } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { db } from "../../../firebase";
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

const Vehicle = () => {
	const [status, setStatus] = useState<IVehicle["status"] | undefined>();
	const [values, loading, error] = useCollectionData<IVehicle>(
		status
			? (query(
					collection(db, "vehicles"),
					where("status", "==", status)
				) as Query<IVehicle, DocumentData>)
			: (collection(db, "vehicles") as CollectionReference<
					IVehicle,
					DocumentData
				>),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (error) {
		return <p>Error</p>;
	}

	return (
		<div className="m-4 flex-1 space-y-6 lg:max-w-2xl">
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
					<p className="text-muted-foreground">Manage your vehicles here.</p>
				</div>
				<div className="flex flex-row gap-2">
					<Select onValueChange={(val) => setStatus(val as IVehicle["status"])}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Status</SelectLabel>
								<SelectItem value="PENDING">PENDING</SelectItem>
								<SelectItem value="VERIFIED">VERIFIED</SelectItem>
								<SelectItem value="REJECTED">REJECTED</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button onClick={() => setStatus(undefined)} variant="destructive">
						Clear Filter
					</Button>
				</div>
			</div>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					{loading ? (
						<TableBody>
							{Array.from({ length: 10 }).map((_, i) => (
								<TableRow
									key={`table-body-row-${i + 1}`}
									className="hover:bg-transparent"
								>
									{Array.from({ length: 4 }).map((_, i) => (
										<TableCell key={`table-body-column-${i + 1}`}>
											<Skeleton className="h-6 w-full" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					) : values?.length ? (
						<TableBody>
							{values?.map((value) => (
								<TableRow key={value.id}>
									<TableCell className="font-medium">{value.status}</TableCell>
									<TableCell>{value.vehicleAgeIdentifier}</TableCell>
									<TableCell>{value.vehicleNumber}</TableCell>
									<TableCell className="text-right">
										{value.vehicleType}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : (
						<TableRow>
							<TableCell colSpan={4} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</div>
	);
};

export default Vehicle;
