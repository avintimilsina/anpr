/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from "next";
import { type Order, type Payment } from "@/db/schema";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Only allow POST requests to this API route (for security)
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}

	let payment: Record<string, string | number> = {};
	let order: Record<string, string | number> = {};

	if (req.body.pidx) {
		// Khalti Payment
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

		payment = {
			status: paymentStatus,
			transactionId: data.transaction_id,
			amount: data.amount,
		};

		order = {
			id: req.body.purchase_order_id,
			status: orderStatus,
		};
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

		payment = {
			status: orderStatus,
			transactionId: req.body.refId,
		};

		order = {
			id: req.body.oid,
			status: orderStatus,
			amount: req.body.amt,
		};
	}

	res.status(200).json({ payment, order });
}
