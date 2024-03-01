/* eslint-disable no-nested-ternary */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import {
	type DocumentData,
	type DocumentReference,
	doc,
	collection,
	type Query,
	query,
	orderBy,
} from "firebase/firestore";
import { useFormatter } from "next-intl";
import { LuLoader2 } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Payment, type Order } from "@/db/schema";
import { db } from "../../../firebase";
import { statusToColor } from "@/components/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";

const SuccessPage = () => {
	const router = useRouter();
	const format = useFormatter();
	const [updatingPayment, setUpdatingPayment] = useState(true);

	const orderId = (router?.query?.purchase_order_id ??
		router?.query?.oid ??
		"not-found") as string;

	const [order, orderLoading] = useDocumentData<Order>(
		doc(db, "orders", orderId) as DocumentReference<Order, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [payments, paymentLoading, paymentError] = useCollectionData<Payment>(
		query(
			collection(db, "orders", orderId, "payments"),
			orderBy("createdAt", "desc")
		) as Query<Payment, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

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
						error: () => {
							setUpdatingPayment(false);
							return "Error processing payment";
						},
					}
				);
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		runThisNow();
	}, [router.query]);

	if (updatingPayment) {
		return (
			<div className="grid h-screen w-full place-items-center">
				<h1>Please, do not close the window or shut down the computer.</h1>
			</div>
		);
	}

	if (orderLoading || paymentLoading) {
		return (
			<div className="grid h-screen w-full place-items-center">
				<LuLoader2 className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="grid  h-screen place-items-center">
			<div className="my-8 flex max-w-5xl flex-col items-center justify-between gap-8 p-8 md:my-16 md:flex-row md:gap-48">
				<div className="flex flex-col items-start gap-6">
					<div className="flex flex-col items-start gap-2">
						<div className="flex flex-row items-start">
							<Badge>PAYMENT {payments?.[0].status}</Badge>
						</div>
						<h1 className="text-5xl font-bold">Thanks for the topup.</h1>
						<h2 className="text-2xl">
							Your topup of{" "}
							<span className="font-bold">
								{format.number((Number(order?.amount) ?? 0) / 100, {
									style: "currency",
									currency: "NPR",
								})}{" "}
							</span>{" "}
							was {payments?.[0].status.toLowerCase()}.
						</h2>
					</div>
					<div className="flex flex-col items-start">
						<p className="text-2xl font-semibold">Payment Id</p>
						<div>
							<p>{order?.id}</p>
						</div>
					</div>
					<Link className={cn(buttonVariants({ variant: "default" }))} href="/">
						Dashboard
					</Link>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>PaymentId</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>TransactionId</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						{paymentLoading ? (
							<TableBody>
								{Array.from({ length: 10 }).map((_, i) => (
									<TableRow
										key={`table-body-row-${i + 1}`}
										className="hover:bg-transparent"
									>
										{Array.from({ length: 1 }).map((_, i) => (
											<TableCell key={`table-body-column-${i + 1}`}>
												<Skeleton className="h-6 w-full" />
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						) : payments?.length ? (
							<TableBody>
								{payments?.map((value) => (
									<TableRow key={value.id}>
										<TableCell className="font-medium">{value.id}</TableCell>
										<TableCell className="font-medium">
											<Badge variant={statusToColor(value.status)}>
												{value.status}
											</Badge>
										</TableCell>
										<TableCell>{value.pidx}</TableCell>
										<TableCell className="text-right">
											{format.number(value.totalAmount / 100, {
												style: "currency",
												currency: "NPR",
											})}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									{paymentError
										? `An Error Occured ! ${paymentError?.name}-${paymentError?.code}`
										: "No results"}
								</TableCell>
							</TableRow>
						)}
					</Table>
					<p className="w-full text-xl">
						Have a Problem? Contact our{" "}
						<Link
							className={cn(buttonVariants({ variant: "secondary" }))}
							href="/"
						>
							Customer Support{" "}
						</Link>
					</p>
				</div>
				<div className="max-h-[60vh] max-w-[80vw] lg:max-w-[40vw]">
					<Image
						objectFit="contain"
						height={500}
						width={500}
						alt="Image"
						src="/assets/order-placed.svg"
					/>
				</div>
			</div>
		</div>
	);
};

export default SuccessPage;
