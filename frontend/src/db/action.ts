/* eslint-disable import/prefer-default-export */
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { type Parking } from "./schema";
import { generateId } from "@/lib/nanoid";

interface VehicleEntryProps {
	vehicleAgeIdentifier: string;
	vehicleNumber: number;
	vehicleState:
		| "Koshi"
		| "Madhesh"
		| "Bagmati"
		| "Gandaki"
		| "Lumbini"
		| "Karnali"
		| "Sudurpaschim";
	vehicleType: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
}

export const vehicleEntry = async ({
	vehicleAgeIdentifier,
	vehicleNumber,
	vehicleState,
	vehicleType,
}: VehicleEntryProps) => {
	const vehicleId = `${vehicleState.toUpperCase()}-${vehicleType}-${vehicleAgeIdentifier}-${vehicleNumber}`;
	const docSnap = await getDoc(doc(db, "parkings", vehicleId));

	if (docSnap.exists()) {
		await updateDoc(doc(db, "parkings", vehicleId), {
			exit: serverTimestamp(),
			status: "COMPLETED",
		} satisfies Partial<Parking>);
	} else {
		const parkingId = generateId("PARKING");

		await setDoc(doc(db, "parkings", parkingId), {
			id: parkingId,
			entry: serverTimestamp(),
			vehicleId,
			createdAt: serverTimestamp(),
			status: "PARKED",
		} satisfies Parking);
	}
};
