/* eslint-disable no-console */

import {
	collection,
	doc,
	setDoc,
	type CollectionReference,
	type DocumentData,
} from "firebase/firestore";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";
import AdminTable from "@/components/shared/admin-table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type User, type Admin } from "@/db/schema";
import { db } from "../../../firebase";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { extractFirstCharacter } from "@/components/helpers";
import UserProfile from "@/components/shared/user-profile";
import withAdminProtected from "@/routes/withAdminProtected";

const RolePage = () => {
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [users, usersLoading] = useCollectionData<User>(
		collection(db, "users") as CollectionReference<User, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [, adminLoading, adminError, snapshot] = useCollectionData<Admin>(
		collection(db, "admins") as CollectionReference<Admin, DocumentData>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (adminLoading || usersLoading) {
		return <LuLoader2 className="animate-spin" />;
	}

	if (adminError) {
		return <div>{adminError?.message}</div>;
	}

	return (
		<div className="m-4 flex-1 space-y-6 lg:max-w-5xl">
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Roles</h2>
					<p className="text-muted-foreground">
						Manage admin privileges by adding and revoking roles.
					</p>
				</div>
				<div className="flex flex-row gap-2">
					<Input
						type="search"
						placeholder="Search username or uid"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default">New Admin</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>New Admin</DialogTitle>
								<DialogDescription>
									You&apos;re about to create a new admin.
								</DialogDescription>
							</DialogHeader>
							<div className="flex">
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											size="lg"
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between"
										>
											{value ? (
												<UserProfile
													displayName={
														users?.find((u) => u.uid === value)?.displayName
													}
													photoURL={
														users?.find((u) => u.uid === value)?.photoURL
													}
													email={users?.find((u) => u.uid === value)?.email}
												/>
											) : (
												"Select new admin..."
											)}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className=" p-0">
										<Command>
											<CommandInput placeholder="Search users..." />
											<CommandEmpty>No users found.</CommandEmpty>
											<CommandGroup>
												{users
													?.filter(
														(user) =>
															!snapshot?.docs
																.map((document) => document.id)
																.includes(user.uid)
													)
													?.map((user) => (
														<CommandItem
															key={user.uid}
															value={user.uid}
															onSelect={(currentValue) => {
																setValue(
																	currentValue === value ? "" : user.uid
																);
																setOpen(false);
															}}
														>
															{value === user.uid ? (
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		value === user.uid
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
															) : (
																<Avatar className="mr-2 h-4 w-4">
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
															)}
															{user?.displayName ?? user?.email.split("@")[0]}
														</CommandItem>
													))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
							</div>
							<DialogFooter>
								<Button
									type="button"
									onClick={async () => {
										toast.promise(
											setDoc(doc(db, "admins", value), {
												isActive: true,
											} satisfies Admin),
											{
												loading: "Creating...",
												success: () => {
													setValue("");
													setOpen(false);
													return "Created Successfully !";
												},
												error: "An Error Occured !",
											}
										);
									}}
								>
									Save changes
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<AdminTable
				search={search}
				admins={
					snapshot?.docs.map((document) => ({
						id: document.id,
						...document.data(),
					})) ?? []
				}
			/>
		</div>
	);
};

export default withAdminProtected(RolePage);
