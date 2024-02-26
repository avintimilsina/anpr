import { type FieldValue, type Timestamp } from "firebase/firestore";

export interface Vehicle {
	id: string;
	uid: string;
	vehicleAgeIdentifier: string;
	vehicleBluebook: string;
	vehicleNumber: number;
	vehicleState: string;
	vehicleType: string;
	status: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface User {
	id: string;
	email: string;
	password: string;
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
