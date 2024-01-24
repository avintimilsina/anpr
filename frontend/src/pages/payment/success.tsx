import { useRouter } from "next/router";

const SuccessPage = () => {
	const router = useRouter();

	return (
		<div className="grid h-screen w-full place-items-center">
			<h1>SuccessPage</h1>
			<pre>{JSON.stringify(router.query, null, 2)}</pre>
		</div>
	);
};

export default SuccessPage;
