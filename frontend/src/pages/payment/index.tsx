/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-void */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, limit, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { auth, db } from "../../../firebase";

const SuccessPage = () => {
	const router = useRouter();
	const [currentUser, authLoading] = useAuthState(auth);
	const [updatingPayment, setUpdatingPayment] = useState(true);

	const orderId =
		(router.query.purchase_order_id as string) ??
		(router.query.oid as string) ??
		(router.query.orderId as string) ??
		"not-found";

	const [order, orderLoading] = useDocumentData(doc(db, "orders", orderId), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const [payments, paymentLoading] = useCollection(
		query(
			collection(db, "orders", orderId, "payments"),
			orderBy("createdAt", "desc"),
			limit(1)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	let ignore = false;
	useEffect(() => {
		const runThisNow = async () => {
			if (router.query.pidx ?? router.query.refId) {
				toast.promise(
					fetch("/api/payment/update", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(router.query),
					}),
					{
						loading: "Updating payment...",
						success: () => {
							setUpdatingPayment(false);
							return "Payment updated successfully";
						},
						error: (err) => {
							console.log(err);
							setUpdatingPayment(false);
							return "Error processing payment";
						},
					}
				);
			}
		};

		if (currentUser?.uid && !ignore) {
			void runThisNow();
		}
		return () => {
			ignore = true;
		};
	}, [router.query, currentUser, order, payments]);

	if (orderLoading || paymentLoading || updatingPayment || authLoading) {
		return (
			<div className="grid h-screen w-full place-items-center">
				<h1>Loading...</h1>
				<p>orderLoading {orderLoading.toString()}</p>
				<p>paymentLoading {paymentLoading.toString()}</p>
				<p>updatingPayment {updatingPayment.toString()}</p>
				<p>authLoading {authLoading.toString()}</p>
			</div>
		);
	}

	return (
		<div className="grid h-screen w-full place-items-center">
			<h1>SuccessPage</h1>
			<pre>{JSON.stringify(router.query, null, 2)}</pre>
			<pre>{JSON.stringify(order, null, 2)}</pre>
			<pre>{JSON.stringify(payments?.docs, null, 2)}</pre>
		</div>
	);
};

export default SuccessPage;
