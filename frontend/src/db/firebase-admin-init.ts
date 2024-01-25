/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
	type ServiceAccount,
	cert,
	getApps,
	initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ? Snippet to initialize firebase admin SDK for each API route
const firebaseAdminInit = () => {
	if (!getApps()?.length) {
		initializeApp({
			credential: cert({
				type: process.env.FIREBASE_ADMIN_TYPE,
				project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
				private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
				client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
				client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
				auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
				token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
				auth_provider_x509_cert_url:
					process.env.FIREBASE_ADMIN_AUTH_PROVIDER_x509_CERT_URL,
				client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_x509_CERT_URL,
			} as ServiceAccount),
		});
	}

	const db = getFirestore();
	return { db };
};

export default firebaseAdminInit;
