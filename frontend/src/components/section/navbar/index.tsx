import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import ThemeToggle from "@/components/layout/theme-toggle";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { NAVBAR } from "@/config/navbar";
import { cn } from "@/lib/utils";
import { auth } from "../../../../firebase";
import UserNav from "./user-nav";

const Navbar = ({ className }: { className?: string }) => {
	const [currentUser] = useAuthState(auth);

	return (
		<div
			className={cn(
				"supports-backdrop-blur:bg-background/60 bg-background/95 fixed left-0 right-0 top-0 z-20 backdrop-blur",
				className
			)}
		>
			<nav className="container flex h-14 items-center justify-between">
				<div className="flex gap-6 md:gap-10">
					<Logo />
					<button
						className="flex items-center space-x-2 md:hidden"
						type="button"
					>
						<Logo />
						<span className="font-bold">Menu</span>
					</button>
				</div>

				<nav className="hidden gap-6 md:flex">
					{NAVBAR.map(({ href, title }) => (
						<Link
							key={`nav-${href}-title-${title}`}
							className="hover:text-foreground/80 text-foreground/60 flex items-center text-lg font-medium transition-colors sm:text-xs"
							href={href}
						>
							{title.toUpperCase()}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-2">
					<nav className="flex items-center gap-2">
						{!currentUser ? (
							<Link href="/auth/login">
								<Button variant="secondary" size="sm">
									Login
								</Button>
							</Link>
						) : (
							<>
								<Link href="/dashboard">
									<Button variant="outline" size="sm">
										Dashboard
									</Button>
								</Link>
								<UserNav />
							</>
						)}
					</nav>
					{/* <LocaleSwitcher variant="icon" /> */}
					<ThemeToggle />
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
