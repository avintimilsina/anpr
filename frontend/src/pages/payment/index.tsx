/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-void */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import {
	collection,
	doc,
	increment,
	limit,
	orderBy,
	query,
	runTransaction,
	setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
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

	useEffect(() => {
		const runThisNow = async () => {
			if (router.query.pidx ?? router.query.refId) {
				const response = await (
					await fetch("/api/payment/update", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(router.query),
					})
				).json();

				if (response?.order.id) {
					await setDoc(
						doc(db, "orders", response.order.id as string),
						response.order,
						{
							merge: true,
						}
					);
				}

				if (response?.payment && payments) {
					await setDoc(
						doc(
							db,
							"orders",
							response.order.id as string,
							"payments",
							payments?.docs?.[0]?.id
						),
						response.payment,
						{
							merge: true,
						}
					);
				}

				if (response?.order.status === "PAID") {
					await runTransaction(db, async (transaction) => {
						transaction.update(
							doc(
								db,
								"users",
								(order?.userId as string) ?? currentUser?.uid ?? "not-found"
							),
							{
								amount: increment(Number(order?.amount ?? 0) ?? 0),
							}
						);

						transaction.update(doc(db, "orders", response.order.id as string), {
							status: "COMPLETED",
						});
					});
				}

				setUpdatingPayment(false);
			}
		};

		if (currentUser?.uid) {
			void runThisNow();
		}
	}, [router.query, currentUser, order, payments]);

	if (orderLoading || paymentLoading || updatingPayment || authLoading) {
		return (
			<div className="grid h-screen w-full place-items-center">
				<h1>Loading...</h1>
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
