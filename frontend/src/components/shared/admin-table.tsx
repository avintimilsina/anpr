import {
	collection,
	deleteDoc,
	doc,
	documentId,
	query,
	setDoc,
	where,
	type DocumentData,
	type Query,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { LuLoader2 } from "react-icons/lu";
import { type User } from "@/db/schema";
import { db } from "../../../firebase";
import { extractFirstCharacter } from "../helpers";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const badgeEnum = {
	active: "default",
	reviewing: "secondary",
	revoked: "destructive",
} as const;

interface TableContentProps {
	admins: { id: string; isActive: boolean }[];
	search?: string;
}

const AdminTable = ({ admins, search }: TableContentProps) => {
	const [data, loading, error] = useCollectionData<User>(
		query(
			collection(db, "users"),
			where(documentId(), "in", admins.map((admin) => admin.id) ?? ["-"])
		) as Query<User, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (loading) {
		return <LuLoader2 className="animate-spin" />;
	}

	return (
		<div>
			<Table className="border-1 my-8">
				<TableHeader>
					<TableRow>
						<TableHead className="whitespace-nowrap">Member</TableHead>
						<TableHead className="whitespace-nowrap">Status</TableHead>
						<TableHead className="whitespace-nowrap text-right">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.filter(
						(admin) =>
							admin.displayName
								?.toLowerCase()
								?.includes(search?.toLowerCase() ?? "") ||
							admin.uid?.toLowerCase()?.includes(search?.toLowerCase() ?? "")
					)?.length ? (
						data
							?.filter(
								(admin) =>
									admin.displayName
										?.toLowerCase()
										?.includes(search?.toLowerCase() ?? "") ||
									admin.uid
										?.toLowerCase()
										?.includes(search?.toLowerCase() ?? "")
							)
							?.map((user) => {
								const isActive = admins.find((a) => a.id === user.uid)
									?.isActive;
								return (
									<TableRow key={user.uid}>
										<TableCell key={user.uid}>
											<div className="my-2 flex items-center space-x-4">
												<Avatar>
													<AvatarImage
														src={
															user.photoURL ??
															`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`
														}
													/>
													<AvatarFallback>
														{extractFirstCharacter(user.displayName)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium leading-none">
														{user.displayName}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell className="whitespace-nowrap" key={user.uid} />
										<TableCell className="whitespace-nowrap" key={user.uid}>
											<Badge
												variant={badgeEnum[isActive ? "active" : "revoked"]}
											>
												{isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>

										<TableCell className="flex flex-row justify-end gap-2">
											{isActive ? (
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button variant="destructive">Revoke</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Are you sure you want to revoke admin
																privileges?
															</AlertDialogTitle>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction asChild>
																<Button
																	onClick={async () => {
																		await setDoc(doc(db, "admins", user.uid), {
																			isActive: false,
																		});
																	}}
																	variant="destructive"
																>
																	Revoke
																</Button>
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											) : (
												<Button
													variant="link"
													className="bg-primary"
													onClick={async () => {
														await setDoc(doc(db, "admins", user.uid), {
															isActive: true,
														});
													}}
												>
													Enable
												</Button>
											)}

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="destructive">Delete</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Remove admin?</AlertDialogTitle>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction asChild>
															<Button
																onClick={async () => {
																	await deleteDoc(doc(db, "admins", user.uid));
																}}
																variant="destructive"
															>
																Delete
															</Button>
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</TableCell>
									</TableRow>
								);
							})
					) : (
						<TableRow>
							<TableCell colSpan={3} className="h-24 text-center">
								{error
									? `An Error Occured ! ${error?.name}-${error?.code}`
									: "No results"}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default AdminTable;
