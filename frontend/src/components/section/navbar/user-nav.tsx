import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { doc } from "firebase/firestore";
import { useFormatter } from "next-intl";
import { LuLoader2 } from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "../../../../firebase";
import usePaymentModal from "@/components/hooks/use-payment-modal";

const UserNav = () => {
	const format = useFormatter();
	const [currentUser] = useAuthState(auth);
	const router = useRouter();

	const [user, userLoading] = useDocumentData(
		doc(db, "users", currentUser?.uid ?? "not-found"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const { onOpen } = usePaymentModal();

	const logout = async () => {
		await auth.signOut();
		toast.success("You have been logged out.");
		await router.push("/");
	};

	if (userLoading) {
		return <LuLoader2 className="animate-spin" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10 border">
						<AvatarImage
							src={currentUser?.photoURL ?? undefined}
							alt={currentUser?.email ?? undefined}
						/>
						<AvatarFallback>
							{currentUser?.email?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="flex flex-col gap-4 font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{currentUser?.email?.slice(0, currentUser?.email?.indexOf("@"))}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{currentUser?.email}
						</p>
					</div>
					<div className="flex flex-col items-center justify-between gap-2">
						<p className="text-lg font-medium leading-none">
							Balance:{" "}
							{format.number((Number(user?.amount ?? 0) ?? 0) / 100, {
								style: "currency",
								currency: "NPR",
							})}
						</p>
						<Button
							size="xs"
							variant="default"
							className="w-full"
							onClick={onOpen}
						>
							Load Wallet
						</Button>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/admin">Admin</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default UserNav;
