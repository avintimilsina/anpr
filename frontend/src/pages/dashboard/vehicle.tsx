import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
	type DocumentData,
	type Query,
	collection,
	query,
	where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Separator } from "@/components/ui/separator";
import { auth, db } from "../../../firebase";
import { Button } from "@/components/ui/button";
import VehicleForm from "@/components/forms/vehicle-form";
import Modal from "@/components/shared/modal";
import { type Vehicle } from "@/db/schema";
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

const VehiclePage = () => {
	const [currentUser] = useAuthState(auth);

	const [newVehicleModal, setNewVehicleModal] = useState(false);
	const [values, loading, error] = useCollectionData<Vehicle>(
		query(
			collection(db, "vehicles"),
			where("uid", "==", currentUser?.uid ?? "vehicle-not-found")
		) as Query<Vehicle, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		<p>Error</p>;
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
					<p className="text-muted-foreground">Manage your vehicles here.</p>
				</div>
				<Button onClick={() => setNewVehicleModal(true)}>
					Add New Vehicle
				</Button>
				<Modal
					className="md:max-w-4xl"
					showModal={newVehicleModal}
					setShowModal={(open) => {
						setNewVehicleModal(open);
					}}
				>
					<div className="w-full">
						<div className="bg-secondary/50 flex flex-col space-y-4 px-4 py-8 md:px-16">
							<VehicleForm onSuccess={() => setNewVehicleModal(false)} />
						</div>
					</div>
				</Modal>
			</div>
			<Separator className="my-6" />
			<div className="flex flex-col gap-4">
				{values?.map((vehicle) => (
					<Card key={vehicle.id}>
						<CardHeader>
							<CardTitle>{vehicle.id}</CardTitle>
							<CardDescription>{vehicle.status}</CardDescription>
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
							<Button>Update</Button>
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
											This action cannot be undone. This will permanently delete
											your vehicle and you`ll lose your verification data.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction asChild>
											<Button variant="destructive">Delete</Button>
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
};

export default VehiclePage;
