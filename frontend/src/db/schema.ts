import { type FieldValue, type Timestamp } from "firebase/firestore";

export interface Vehicle {
	id: string;
	make: string;
	model: string;
	year?: number;
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
}

export interface Payment {
	pidx?: string;
	orderId: string;
	userId: string;
	refunded: boolean;
	status: "PENDING" | "COMPLETED" | "FAILED";
	totalAmount: number;
	createdAt: Timestamp | FieldValue;
}
