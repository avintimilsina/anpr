import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SuccessPage = () => {
	const router = useRouter();
	const [updatingPayment, setUpdatingPayment] = useState(true);

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
				<p>updatingPayment {updatingPayment.toString()}</p>
			</div>
		);
	}

	return (
		<div className="grid h-screen w-full place-items-center">
			<h1>SuccessPage</h1>
			<pre>{JSON.stringify(router.query, null, 2)}</pre>
		</div>
	);
};

export default SuccessPage;
