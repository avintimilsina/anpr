"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { type NavItem } from "@/config/navbar";
import { buttonVariants } from "../../ui/button";
import { Icons } from "@/components/icons";

interface DashboardNavProps {
	isCollapsed: boolean;
	links: NavItem[];
}

const DashboardNav = ({ links, isCollapsed }: DashboardNavProps) => {
	const pathname = usePathname();

	return (
		<div
			data-collapsed={isCollapsed}
			className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map(({ href, icon, key, title }) => {
					const Icon = Icons[icon!];

					if (isCollapsed) {
						return (
							<Tooltip key={`collapsed-${key}`} delayDuration={0}>
								<TooltipTrigger asChild>
									<Link
										href={href}
										className={cn(
											buttonVariants({
												variant: href === pathname ? "default" : "ghost",
												size: "icon",
											}),
											"h-9 w-9",
											href === pathname &&
												"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
										)}
									>
										<Icon className="h-4 w-4" />
										<span className="sr-only">{title}</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent
									side="right"
									className="flex items-center gap-4"
								>
									{title}
									{/*
									// ? For Label
									<span className="ml-auto text-muted-foreground">{label}</span> */}
								</TooltipContent>
							</Tooltip>
						);
					}

					return (
						<Link
							key={`uncollapsed-${key}`}
							href={href}
							className={cn(
								buttonVariants({
									variant: href === pathname ? "default" : "ghost",
									size: "sm",
								}),
								href === pathname &&
									"dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white",
								"justify-start"
							)}
						>
							<Icon className="mr-2 h-4 w-4" />
							{title}
							{/*
							// ? For Label
							{label && (
								<span
									className={cn(
										"ml-auto",
										href === pathname && "text-background dark:text-white"
									)}
								>
									{label}
								</span>
							)} */}
						</Link>
					);
				})}
			</nav>
		</div>
	);
};

export default DashboardNav;
