export interface Vehicle {
	id: number;
	make: string;
	model: string;
	year?: number;
}

export interface User {
	id: number;
	email: string;
	password: string;
}
