/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import { type Order, type Payment } from "@/db/schema";
import firebaseAdminInit from "@/db/firebase-admin-init";

// ?  Initializing firebase admin snippet
const { db } = firebaseAdminInit();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Only allow POST requests to this API route (for security)
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}

	// Khalti Payment
	if (req.body.pidx) {
		const resposne = await fetch(
			"https://a.khalti.com/api/v2/epayment/lookup/",
			{
				method: "POST",
				body: JSON.stringify({
					pidx: req.body.pidx,
				}),
				headers: {
					"content-type": "application/json",
					Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
				},
			}
		);

		const data = await resposne.json();

		const paymentStatus = data.status.toUpperCase() as Payment["status"];
		let orderStatus: Order["status"];

		switch (data.status) {
			case "Pending":
				orderStatus = "PENDING";
				break;

			case "Initiated":
				orderStatus = "PENDING";
				break;

			case "Completed":
				orderStatus = "PAID";
				break;

			case "Refunded":
				orderStatus = "REJECTED";
				break;

			default:
				orderStatus = "PENDING";
				break;
		}

		const orderDetail = await db
			.collection("orders")
			.doc(req.body.purchase_order_id)
			.get();

		const paymentDetail = await db
			.collection("orders")
			.doc(req.body.purchase_order_id)
			.collection("payments")
			.orderBy("createdAt")
			.limit(1)
			.get();

		console.log("Order Details", orderDetail.data());
		console.log("paymentDetail ", paymentDetail.docs[0].data());
		console.log("Purchase Id", req.body.purchase_order_id);

		await db
			.collection("orders")
			.doc(req.body.purchase_order_id)
			.collection("payments")
			.doc(paymentDetail.docs[0].data().id as string)
			.set(
				{
					status: paymentStatus,
					transactionId: data.transaction_id,
				},
				{ merge: true }
			);

		// set the order status to PLACED when a new order is initiated
		if (orderDetail.data()?.status === "PENDING") {
			console.log("Pending RAN");
			await db.collection("orders").doc(req.body.purchase_order_id).set(
				{
					status: orderStatus,
				},
				{ merge: true }
			);

			if (orderStatus === "PAID") {
				await db.runTransaction(async (t) => {
					t.update(
						db.collection("users").doc(orderDetail.data()?.userId as string),
						{
							amount: FieldValue.increment(
								Number(orderDetail.data()?.amount ?? 0) ?? 0
							),
						}
					);

					t.update(db.collection("orders").doc(req.body.purchase_order_id), {
						status: "COMPLETED",
					});
				});
			}
			res.status(200).json({ success: true });
		} else if (orderDetail.data()?.status === "PAID") {
			console.log("PAID Ran");
			await db.runTransaction(async (t) => {
				t.update(
					db.collection("users").doc(orderDetail.data()?.userId as string),
					{
						amount: FieldValue.increment(
							Number(orderDetail.data()?.amount ?? 0) ?? 0
						),
					}
				);

				t.update(db.collection("orders").doc(req.body.purchase_order_id), {
					status: "COMPLETED",
				});
			});
			res.status(200).json({ success: true });
		}
	} else if (req.body.refId) {
		// Esewa Payment
		const body = new FormData();
		body.set("amt", req.body.amt);
		body.set("rid", req.body.refId);
		body.set("pid", req.body.oid);
		body.set("scd", "EPAYTEST");

		const response = await fetch("https://uat.esewa.com.np/epay/transrec", {
			method: "POST",
			body,
		});

		const xmlResponse = await response.text();

		const orderStatus = xmlResponse.toLowerCase().includes("success")
			? "COMPLETED"
			: "FAILED";

		const orderDetail = await db.collection("orders").doc(req.body.oid).get();

		const paymentDetail = await db
			.collection("orders")
			.doc(req.body.oid)
			.collection("payments")
			.orderBy("createdAt")
			.limit(1)
			.get();

		await db
			.collection("orders")
			.doc(req.body.purchase_order_id)
			.collection(paymentDetail.docs[0].data().id as string)
			.doc(req.body.token)
			.set(
				{
					status: orderStatus === "COMPLETED" ? "PAID" : "FAILED",
					transactionId: req.body.refId,
				},
				{ merge: true }
			);

		// set the order status to PLACED when a new order is initiated
		if (orderDetail.data()?.status === "PENDING") {
			await db.collection("orders").doc(req.body.orderId).set(
				{
					status: "PAID",
				},
				{ merge: true }
			);
			await db.runTransaction(async (t) => {
				t.update(db.collection("users").doc(orderDetail.data()?.id as string), {
					amount: FieldValue.increment(
						Number(orderDetail.data()?.amount ?? 0) ?? 0
					),
				});

				t.update(db.collection("orders").doc(req.body.purchase_order_id), {
					status: "COMPLETED",
				});
			});
		} else if (orderDetail.data()?.status === "PAID") {
			await db.runTransaction(async (t) => {
				t.update(db.collection("users").doc(orderDetail.data()?.id as string), {
					amount: FieldValue.increment(
						Number(orderDetail.data()?.amount ?? 0) ?? 0
					),
				});

				t.update(db.collection("orders").doc(req.body.purchase_order_id), {
					status: "COMPLETED",
				});
			});
		}
		res.status(200).json({ success: true });
	}

	res.status(200).json({ success: true });
}
