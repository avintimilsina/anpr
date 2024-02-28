import {
	type DocumentData,
	type Query,
	collection,
	query,
	where,
	type CollectionReference,
	orderBy,
} from "firebase/firestore";
import { type Parking, type Vehicle } from "./schema";
import { db } from "../../firebase";

export const getVehicle = (status?: Vehicle["status"]) => {
	if (status) {
		return query(
			collection(db, "vehicles"),
			where("status", "==", status)
		) as Query<Vehicle, DocumentData>;
	}
	return collection(db, "vehicles") as CollectionReference<
		Vehicle,
		DocumentData
	>;
};

export const getParking = (status?: Parking["status"]) => {
	if (status) {
		return query(
			collection(db, "parkings"),
			where("status", "==", status),
			orderBy("status", "desc"),
			orderBy("createdAt", "desc")
		) as Query<Parking, DocumentData>;
	}
	return query(
		collection(db, "parkings"),
		orderBy("status", "desc"),
		orderBy("createdAt", "desc")
	) as Query<Parking, DocumentData>;
};

export const getParkingByVehicle = (vehicleId: string) =>
	query(
		collection(db, "parkings"),
		where("status", "==", "PARKED"),
		where("vehicleId", "==", vehicleId)
	) as Query<Parking, DocumentData>;
