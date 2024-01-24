import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "../../../../firebase";
import usePaymentModal from "@/components/hooks/use-payment-modal";

const UserNav = () => {
	const [currentUser] = useAuthState(auth);
	const router = useRouter();

	const { onOpen } = usePaymentModal();

	const logout = async () => {
		await auth.signOut();
		toast.success("You have been logged out.");
		await router.push("/");
	};

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
				<DropdownMenuLabel className="flex flex-col gap-2 font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{currentUser?.email?.slice(0, currentUser?.email?.indexOf("@"))}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{currentUser?.email}
						</p>
					</div>
					<div className="flex flex-row items-center justify-between">
						<p className="text-sm font-medium leading-none">Balance: 0.00</p>
						<Button size="xs" variant="default" onClick={onOpen}>
							Load Wallet
						</Button>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
				<DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default UserNav;
