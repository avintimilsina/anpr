/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Only allow POST requests to this API route (for security)
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}

	const { orderId, paymentId, amount, provider, name, email } = req.body;

	const url = `${req.headers["x-forwarded-proto"] as string}://${
		req.headers["x-forwarded-host"] as string
	}`;

	switch (provider) {
		case "KHALTI":
			const resposne = await fetch(
				"https://a.khalti.com/api/v2/epayment/initiate/",
				{
					method: "POST",
					body: JSON.stringify({
						return_url: `${url}/payment`,
						website_url: url,
						amount,
						purchase_order_id: orderId ?? "order-id-not-found",
						purchase_order_name: "ANPR Payment",
						customer_info: {
							name,
							email,
							phone: 9800000000,
						},
						amount_breakdown: [
							{
								label: `Wallet Load`,
								amount,
							},
						],
						product_details: [
							{
								identity: `Wallet-Load-ANPR-${amount}`,
								name: `Wallet Load ${amount}`,
								total_price: amount,
								quantity: 1,
								unit_price: amount,
							},
						],
					}),
					headers: {
						"content-type": "application/json",
						Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
					},
				}
			);

			const { pidx, payment_url: paymentUrl } = await resposne.json();

			// Value can be added to database Server side here

			res.status(200).json({
				pidx,
				provider: "KHALTI",
				paymentUrl,
				requestUrl: url,
			});
			break;

		case "ESEWA":
			res.status(200).json({
				provider: "ESEWA",
				amt: amount,
				psc: 0,
				pdc: 0,
				txAmt: 0,
				tAmt: amount,
				pid: orderId,
				scd: "EPAYTEST",
				requestUrl: url,
			});
			break;

		case "STRIPE":
			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						price_data: {
							currency: "NPR",
							product_data: {
								name: `Wallet Load ${amount}`,
							},
							unit_amount: amount,
						},
						quantity: 1,
					},
				],
				mode: "payment",
				success_url: `${url}/payment?paymentId=${paymentId}&orderId=${orderId}`,
				cancel_url: `${url}/payment?paymentId=${paymentId}&orderId=${orderId}`,
			});
			res.status(200).json({
				pidx: session.id,
				provider: "STRIPE",
				paymentUrl: session.url,
				requestUrl: url,
			});
			break;

		default:
			break;
	}

	res.status(500);
}
