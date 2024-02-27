import { type FieldValue, type Timestamp } from "firebase/firestore";

export interface Vehicle {
	id: string;
	uid: string;
	vehicleAgeIdentifier: string;
	vehicleBluebook: string;
	vehicleNumber: number;
	status: "PENDING" | "VERIFIED" | "REJECTED";
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

export interface Parking {
	id: string;
	entry: Timestamp | FieldValue;
	exit?: Timestamp | FieldValue | null;
	status: "BOOKED" | "PARKED" | "COMPLETED" | "CANCELLED";
	vehicleId: string;
	entryVideo?: string | null;
	exitVideo?: string | null;
	createdAt: Timestamp | FieldValue;
}

export interface User {
	uid: string;
	email: string;
	amount: number;
	createdAt: Timestamp | FieldValue;
	displayName: string;
	emailVerified: boolean;
	phoneNumber?: string | null;
	photoURL?: string | null;
	providerData?:
		| {
				displayName?: string | null;
				email?: string | null;
				phoneNumber?: string | null;
				photoURL?: string | null;
				providerId: string;
				uid: string;
		  }[]
		| null;
	licenseNumber?: string | null;
	licenseImage?: string | null;
}

export interface Order {
	id: string;
	userId: string;
	amount: number;
	status: "COMPLETED" | "PAID" | "REJECTED" | "PENDING";
}

export interface Payment {
	id: string;
	pidx?: string;
	orderId: string;
	userId: string;
	refunded: boolean;
	status: "PENDING" | "COMPLETED" | "FAILED" | "INITIATED" | "REFUNDED";
	totalAmount: number;
	createdAt: Timestamp | FieldValue;
}
