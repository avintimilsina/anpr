import {
	type DocumentData,
	type Query,
	collection,
	query,
	where,
	type CollectionReference,
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
			where("status", "==", status)
		) as Query<Parking, DocumentData>;
	}
	return collection(db, "parkings") as CollectionReference<
		Parking,
		DocumentData
	>;
};
