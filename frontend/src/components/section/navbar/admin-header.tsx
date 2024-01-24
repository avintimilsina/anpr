import { LucideFish } from "lucide-react";

const AdminHeader = () => (
	<div className="supports-backdrop-blur:bg-background/60 bg-background/95 fixed left-0 right-0 top-0 z-20 border-b backdrop-blur">
		<nav className="flex h-14 items-center justify-between px-4">
			<div className="hidden h-10 w-10 md:block">
				<LucideFish />
			</div>
			{/* <div className={cn("block sm:!hidden")}>
			// ? Mobile Sidebar could go here
			</div> */}

			<div className="flex items-center gap-2">
				{/* <UserNav /> */}
				{/* <LocaleSwitcher variant="icon" /> */}
				{/* <ThemeToggle /> */}
			</div>
		</nav>
	</div>
);

export default AdminHeader;
