import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import LicensePlatePreview from "@/components/cards/plate-preview";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { statusToColor } from "@/components/helpers";
import { type Vehicle } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { db } from "../../../firebase";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from "../ui/dialog";
import VehicleForm from "../forms/vehicle-form";

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
	const [editModalOpen, setEditModalOpen] = useState(false);

	return (
		<Card key={vehicle.id}>
			<CardHeader className="flex flex-row justify-between">
				<CardTitle>{vehicle.id}</CardTitle>
				<CardDescription>
					<Badge variant={statusToColor(vehicle.status)}>
						{vehicle.status}
					</Badge>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<LicensePlatePreview
					vehicleAgeIdentifier={vehicle.vehicleAgeIdentifier}
					vehicleNumber={vehicle.vehicleNumber}
					vehicleState={vehicle.vehicleState}
					vehicleType={vehicle.vehicleType}
				/>
			</CardContent>
			<CardFooter className="flex flex-row justify-end gap-4">
				<Button onClick={() => setEditModalOpen(true)}>Update</Button>

				<Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
					<DialogContent className="max-w-4xl">
						<DialogHeader>
							<DialogTitle>Forgot password?</DialogTitle>
							<DialogDescription>
								Enter your email to reset your password
							</DialogDescription>
						</DialogHeader>

						<VehicleForm
							initialValues={{
								...vehicle,
							}}
						/>
					</DialogContent>
				</Dialog>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								vehicle and you`ll lose your verification data.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button
									onClick={() => {
										toast.promise(deleteDoc(doc(db, "vehicles", vehicle.id)), {
											loading: "Deleting...",
											success: "Deleted successfully",
											error: "Failed to delete",
										});
									}}
									variant="destructive"
								>
									Delete
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardFooter>
		</Card>
	);
};

export default VehicleCard;
