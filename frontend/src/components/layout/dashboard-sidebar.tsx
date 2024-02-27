import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV_ITEMS } from "@/config/navbar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
}

export const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						buttonVariants({ variant: "ghost" }),
						pathname === item.href
							? "bg-accent hover:bg-accent"
							: "hover:bg-transparent hover:underline",
						"justify-start"
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
};

interface SettingsLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: SettingsLayoutProps) => (
	<div className="w-full space-y-6 p-10 pb-16 pt-16">
		<div className="flex w-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside className="-mx-4 lg:w-1/5">
				<SidebarNav items={DASHBOARD_NAV_ITEMS} />
			</aside>
			<ScrollArea className="h-screen w-full pb-20">
				<div className="flex-1">{children}</div>
			</ScrollArea>
		</div>
	</div>
);

export default DashboardLayout;
