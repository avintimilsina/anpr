/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Image from "next/image";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import khaltiIcon from "@/../public/assets/logos/khalti.svg";
import esewaIcon from "@/../public/assets/logos/esewa.png";
import stripeIcon from "@/../public/assets/logos/stripe.svg";
import { auth, db } from "../../../firebase";
import { type Order, type Payment } from "@/db/schema";
import { generateId } from "@/lib/nanoid";

const paymentFormSchema = z.object({
	amount: z.coerce
		.number({
			required_error: "Please select an email to display.",
		})
		.min(10, "Amount must be greater than 10"),
	provider: z.enum(["KHALTI", "STRIPE", "ESEWA"]).default("KHALTI"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = () => {
	const [currentUser] = useAuthState(auth);

	const form = useForm<PaymentFormValues>({
		resolver: zodResolver(paymentFormSchema),
		defaultValues: {
			amount: 0,
			provider: "KHALTI",
		},
	});

	const onSubmit = async (data: PaymentFormValues) => {
		const orderId = generateId("ORD");

		await setDoc(doc(db, "orders", orderId), {
			id: orderId,
			amount: data.amount * 100,
			userId: currentUser?.uid ?? "",
			status: "PENDING",
		} satisfies Order);

		const paymentId = generateId("PAY");

		await setDoc(doc(db, "orders", orderId, "payments", paymentId), {
			id: paymentId,
			orderId,
			userId: currentUser?.uid ?? "",
			refunded: false,
			status: "PENDING",
			totalAmount: data.amount * 100,
			createdAt: serverTimestamp(),
		} satisfies Payment);

		const response = await (
			await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderId,
					paymentId,
					amount: data.amount * 100,
					provider: data.provider,
					name: currentUser?.displayName ?? "",
					email: currentUser?.email ?? "",
				}),
			})
		).json();

		switch (response.provider as "KHALTI" | "STRIPE" | "ESEWA") {
			case "KHALTI":
				if (!response.paymentUrl || !response.pidx) {
					toast.error("Khalti payment failed");
					return;
				}

				await setDoc(
					doc(db, "orders", orderId, "payments", paymentId),
					{
						pidx: response.pidx,
					},
					{
						merge: true,
					}
				);

				window.location.assign(response.paymentUrl as URL);
				break;

			case "ESEWA":
				if (!response.amt || !response.tAmt || !response.pid || !response.scd) {
					toast.error("Esewa payment failed");
					return;
				}

				await setDoc(
					doc(db, "orders", orderId, "payments", paymentId),
					{
						pidx: nanoid(),
					},
					{
						merge: true,
					}
				);

				const params = {
					amt: response.amt,
					psc: response.psc,
					pdc: response.pdc,
					txAmt: response.txAmt,
					tAmt: response.tAmt,
					pid: response.pid,
					scd: response.scd,
					su: `${process.env.CLIENT_URL}/payment`,
					fu: `${process.env.CLIENT_URL}/payment?orderId=${orderId}`,
				};

				const form = document.createElement("form");
				form.setAttribute("method", "POST");
				form.setAttribute("action", "https://uat.esewa.com.np/epay/main");

				Object.keys(params).forEach((key) => {
					const hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute(
						"value",
						params[key as keyof typeof params] as string
					);
					form.appendChild(hiddenField);
				});

				document.body.appendChild(form);
				form.submit();
				break;

			case "STRIPE":
				if (!response.paymentUrl || !response.pidx) {
					toast.error("Stripe payment failed");
					return;
				}

				await setDoc(
					doc(db, "orders", orderId, "payments", paymentId),
					{
						pidx: response.pidx,
					},
					{
						merge: true,
					}
				);

				window.location.assign(response.paymentUrl as URL);
				break;

			default:
				break;
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input placeholder="0.00" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="provider"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="grid grid-cols-3 gap-4"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<div>
												<RadioGroupItem
													value="KHALTI"
													id="KHALTI"
													className="peer sr-only"
												/>
												<Label
													htmlFor="KHALTI"
													className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-2"
												>
													<Image
														className="h-16 w-16"
														src={khaltiIcon}
														alt="Khalti"
														width={64}
														height={64}
													/>
													Khalti
												</Label>
											</div>
										</FormControl>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<div>
												<RadioGroupItem
													value="ESEWA"
													id="ESEWA"
													className="peer sr-only"
												/>
												<Label
													htmlFor="ESEWA"
													className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-2"
												>
													<div className="grid h-16 w-16 place-items-center">
														<Image
															className="h-8 w-8"
															src={esewaIcon}
															alt="eSewa"
															width={32}
															height={32}
														/>
													</div>
													e-Sewa
												</Label>
											</div>
										</FormControl>
									</FormItem>

									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<div>
												<RadioGroupItem
													value="STRIPE"
													id="STRIPE"
													className="peer sr-only"
												/>
												<Label
													htmlFor="STRIPE"
													className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-2"
												>
													<Image
														className="h-16 w-16"
														src={stripeIcon}
														alt="Stripe"
														width={64}
														height={64}
													/>
													Stripe
												</Label>
											</div>
										</FormControl>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="w-full" type="submit">
					Continue to Pay
				</Button>
			</form>
		</Form>
	);
};

export default PaymentForm;
