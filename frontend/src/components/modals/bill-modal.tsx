import { Label } from "@radix-ui/react-label";
import dayjs from "dayjs";
import { type Timestamp } from "firebase/firestore";
import React from "react";
import { useFormatter } from "next-intl";
import { Button, type ButtonProps } from "../ui/button";
import { Badge } from "../ui/badge";
import { statusToColor, calculateParking } from "../helpers";
import {
	DialogHeader,
	DialogFooter,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { type Parking } from "@/db/schema";
import { CELL_ACTIONS } from "@/db/action";

const BillModal = ({ parking }: { parking: Parking }) => {
	const format = useFormatter();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex-grow" size="sm" variant="default">
					Bill
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						Bill{" "}
						<Badge variant={statusToColor(parking.status)}>
							{parking.status}
						</Badge>
					</DialogTitle>
					<DialogDescription>
						{format.number(
							calculateParking(
								parking.entry as Timestamp,
								parking.exit as Timestamp
							),
							{ style: "currency", currency: "NPR" }
						)}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Entry Time
						</Label>
						<Input
							readOnly
							id="entrytime"
							value={dayjs((parking.entry as Timestamp)?.toMillis()).format(
								"YYYY-MM-DD HH:mm:ss"
							)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Exit Time
						</Label>
						<Input
							readOnly
							id="exittime"
							value={
								parking.exit
									? dayjs((parking.exit as Timestamp)?.toMillis()).format(
											"YYYY-MM-DD HH:mm:ss"
										)
									: "N/A"
							}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Parking Duration
						</Label>
						<Input
							readOnly
							id="duration"
							value={`${
								parking.exit
									? dayjs((parking.exit as Timestamp)?.toMillis()).diff(
											dayjs((parking.entry as Timestamp)?.toMillis()),
											"minutes"
										)
									: dayjs(Date.now()).diff(
											dayjs((parking.entry as Timestamp)?.toMillis()),
											"minutes"
										)
							} minutes`}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Total Charge
						</Label>
						<Input
							readOnly
							id="charge"
							value={format.number(
								calculateParking(
									parking.entry as Timestamp,
									parking.exit as Timestamp
								),
								{ style: "currency", currency: "NPR" }
							)}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					{CELL_ACTIONS.filter((action) =>
						action.showOnStatus.includes(parking.status)
					).map((action) => (
						<Button
							className="w-full"
							size="sm"
							variant={action.variant as ButtonProps["variant"]}
							onClick={() => action.onClick(parking)}
						>
							{action.label}
						</Button>
					))}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default BillModal;
