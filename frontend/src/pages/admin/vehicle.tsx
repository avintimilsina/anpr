/* eslint-disable no-nested-ternary */

import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
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
import { getVehicle } from "@/db/query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { db } from "../../../firebase";

const ACTION_BUTTONS = [
	{
		label: "Approve",
		status: "VERIFIED",
		variant: "default",
		onClick: async (id: string) => {
			await updateDoc(doc(db, "vehicles", id), {
				status: "VERIFIED",
			});
		},
	},
	{
		label: "Reject",
		status: "REJECTED",
		variant: "destructive",
		onClick: async (id: string) => {
			await updateDoc(doc(db, "vehicles", id), {
				status: "REJECTED",
			});
		},
	},
	{
		label: "Pending",
		status: "PENDING",
		variant: "secondary",
		onClick: async (id: string) => {
			await updateDoc(doc(db, "vehicles", id), {
				status: "PENDING",
			});
		},
	},
];

const Vehicle = () => {
	const [status, setStatus] = useState<IVehicle["status"] | undefined>();
	const [search, setSearch] = useState("");
	const [values, loading, error] = useCollectionData<IVehicle>(
		getVehicle(status),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (error) {
		return <p>Error</p>;
	}

	return (
		<div className="m-4 flex-1 space-y-6 lg:max-w-4xl">
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">
						Vehicles Approval
					</h2>
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
						onValueChange={(val) => setStatus(val as IVehicle["status"])}
					>
						<SelectTrigger className="w-[180px] min-w-[130px]">
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
							<TableHead>Vehicle Number</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>UserId</TableHead>
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
									<TableCell className="font-medium">{value.id}</TableCell>
									<TableCell>
										<Badge
											variant={
												value.status === "REJECTED"
													? "destructive"
													: value.status === "PENDING"
														? "secondary"
														: "default"
											}
										>
											{value.status}
										</Badge>
									</TableCell>
									<TableCell>{value.uid}</TableCell>
									<TableCell className="flex flex-row gap-2 text-right">
										{ACTION_BUTTONS.filter(
											(action) => action.status !== value.status
										)
											.sort((a, b) => a.label.localeCompare(b.label))
											.map((action) => (
												<Button
													onClick={() =>
														toast.promise(action.onClick(value.id), {
															loading: "Updating...",
															success: "Updated Status",
															error: "Something went wrong",
														})
													}
													className="w-full"
													size="sm"
													variant={action.variant as ButtonProps["variant"]}
												>
													{action.label}
												</Button>
											))}
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
