/* eslint-disable import/prefer-default-export */
import {
	type DocumentData,
	type DocumentReference,
	doc,
	getDocs,
	serverTimestamp,
	setDoc,
	updateDoc,
	getDoc,
	type Timestamp,
	increment,
	runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";
import { type Vehicle, type Parking } from "./schema";
import { generateId } from "@/lib/nanoid";
import { getParkingByVehicle } from "./query";
import { calculateParking } from "@/components/helpers";

interface VehicleEntryProps {
	vehicleAgeIdentifier: string;
	vehicleNumber: string;
	vehicleState:
		| "Koshi"
		| "Madhesh"
		| "Bagmati"
		| "Gandaki"
		| "Lumbini"
		| "Karnali"
		| "Sudurpaschim";
	vehicleType: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
	time?: Date;
}

export const vehicleEntry = async ({
	vehicleAgeIdentifier,
	vehicleNumber,
	vehicleState,
	vehicleType,
	time,
}: VehicleEntryProps) => {
	const vehicleId = `${vehicleState.toUpperCase()}-${vehicleType}-${vehicleAgeIdentifier}-${vehicleNumber}`;
	const querySnapshot = await getDocs(getParkingByVehicle(vehicleId));

	if (querySnapshot.empty) {
		const parkingId = generateId("PARKING");

		await setDoc(doc(db, "parkings", parkingId), {
			id: parkingId,
			entry: time ?? serverTimestamp(),
			vehicleId,
			createdAt: serverTimestamp(),
			status: "PARKED",
		} satisfies Parking);
	} else {
		await updateDoc(doc(db, "parkings", querySnapshot.docs[0].id), {
			exit: serverTimestamp(),
			status: "PAYMENT_REQUIRED",
		} satisfies Partial<Parking>);

		const { vehicleId } = querySnapshot.docs[0].data();
		const docSnap = await getDoc(
			doc(db, "vehicles", vehicleId) as DocumentReference<Vehicle, DocumentData>
		);

		if (docSnap.exists()) {
			const userId = docSnap?.data()?.uid;

			try {
				await runTransaction(db, async (transaction) => {
					transaction.update(doc(db, "users", userId), {
						amount: increment(
							(Number(
								calculateParking(
									querySnapshot.docs[0].data().entry as Timestamp
								)
							) ?? 0) * -100
						),
					});

					transaction.update(doc(db, "parkings", querySnapshot.docs[0].id), {
						status: "COMPLETED",
					});
				});
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}
	}
};
