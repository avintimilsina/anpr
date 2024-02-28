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
	console.log(users);
	console.log(users?.find((user) => user.uid === value)?.displayName);
	console.log(value);

	return (
		<div className="m-4 flex-1 space-y-6 lg:max-w-5xl">
			<div className="flex flex-row items-center justify-between">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Parking</h2>
					<p className="text-muted-foreground">
						Every vehicle that&apos;s parked or was parked.
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
							<Button variant="outline">New Admin</Button>
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
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className=" justify-between"
										>
											{value || "Select new admin..."}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className=" p-0">
										<Command>
											<CommandInput placeholder="Search users..." />
											<CommandEmpty>No users found.</CommandEmpty>
											<CommandGroup>
												{users?.map((user) => (
													<CommandItem
														key={user.uid}
														value={user.uid}
														onSelect={(currentValue) => {
															setValue(
																currentValue === value ? "" : currentValue
															);
															setOpen(false);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																value === user.uid ? "opacity-100" : "opacity-0"
															)}
														/>
														{user?.displayName}
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

export default RolePage;
