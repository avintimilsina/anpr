/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NextPageContext } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase";
import PageLoadingSpinner from "@/components/shared/page-loading-spinner";

const withProtected = (Component: any) =>
	function WithProtected(props: NextPageContext) {
		const [currentUser, loading, error] = useAuthState(auth);

		const router = useRouter();

		if (loading) {
			return <PageLoadingSpinner />;
		}

		if (error) {
			return <p>{error.message}</p>;
		}

		if (!currentUser?.uid) {
			router.replace(
				{
					pathname: "/auth/login",
					query: {
						redirect: router.pathname,
					},
				},
				undefined,
				{
					shallow: true,
				}
			);
			return <PageLoadingSpinner />;
		}

		return <Component {...props} />;
	};

export default withProtected;
