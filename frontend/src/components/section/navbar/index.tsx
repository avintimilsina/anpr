import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuFish } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../firebase";
import UserNav from "./user-nav";
import { NAVBAR } from "@/config/navbar";
import ThemeToggle from "@/components/layout/theme-toggle";

const Navbar = () => {
	const [currentUser] = useAuthState(auth);

	return (
		<div className="supports-backdrop-blur:bg-background/60 bg-background/95 fixed left-0 right-0 top-0 z-20 border-b backdrop-blur">
			<nav className="flex h-14 items-center justify-between px-4">
				<div className="flex gap-6 px-6 md:gap-10">
					<Link className="hidden items-center space-x-2 md:flex" href="/">
						<LuFish />
						<span className="hidden font-bold sm:inline-block">ANPR</span>
					</Link>
					<nav className="hidden gap-6 md:flex">
						{NAVBAR.map(({ href, title }) => (
							<Link
								key={`nav-${href}-title-${title}`}
								className="hover:text-foreground/80 text-foreground/60 flex items-center text-lg font-medium transition-colors sm:text-sm"
								href={href}
							>
								{title}
							</Link>
						))}
					</nav>
					<button
						className="flex items-center space-x-2 md:hidden"
						type="button"
					>
						<LuFish />
						<span className="font-bold">Menu</span>
					</button>
				</div>

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
									<Button variant="link" size="sm">
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
