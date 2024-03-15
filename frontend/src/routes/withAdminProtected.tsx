/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc } from "firebase/firestore";
import { type NextPageContext } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PageLoadingSpinner from "@/components/shared/page-loading-spinner";
import { auth, db } from "../../firebase";

const withAdminProtected = (Component: any) =>
	function WithProtected(props: NextPageContext) {
		const [currentUser, userLoading, userError] = useAuthState(auth);
		const [value, loading, error] = useDocumentData(
			doc(db, "admins", currentUser?.uid ?? "-"),
			{
				snapshotListenOptions: { includeMetadataChanges: true },
			}
		);

		const router = useRouter();

		if (loading || userLoading) {
			return <PageLoadingSpinner />;
		}

		if (error ?? userError) {
			return <p>{error?.message}</p>;
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
		if (!value?.isActive) {
			router.replace("/");
		}

		return <Component {...props} />;
	};

export default withAdminProtected;
