/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ADMIN_DASHBOARD_NAV_ITEMS_BOTTOM,
	ADMIN_DASHBOARD_NAV_ITEMS_TOP,
} from "@/config/navbar";
import DashboardNav from "../section/navbar/dashboard-nav";

type SidebarProps = {
	className?: string;
	defaultLayout?: number[] | undefined;
	children?: ReactNode;
};

const Sidebar = ({
	className,
	defaultLayout = [16, 84],
	children,
}: SidebarProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout=${JSON.stringify(
						sizes
					)}`;
				}}
				className="h-full items-stretch"
			>
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={4}
					collapsible
					minSize={15}
					maxSize={20}
					onCollapse={() => {
						setIsCollapsed(true);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							true
						)}`;
					}}
					onExpand={() => {
						setIsCollapsed(false);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							false
						)}`;
					}}
					className={cn(
						isCollapsed &&
							"min-w-[50px] transition-all duration-300 ease-in-out",
						className
					)}
				>
					<div
						className={cn(
							"flex h-[52px] items-center justify-center",
							isCollapsed ? "h-[52px]" : "px-2"
						)}
					/>
					<Separator />
					<div className="space-y-4 py-4">
						<div className="px-3 py-2">
							{!isCollapsed && (
								<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
									Overview
								</h2>
							)}
							<DashboardNav
								isCollapsed={isCollapsed}
								links={ADMIN_DASHBOARD_NAV_ITEMS_TOP}
							/>
							<Separator />
							<DashboardNav
								isCollapsed={isCollapsed}
								links={ADMIN_DASHBOARD_NAV_ITEMS_BOTTOM}
							/>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
					<ScrollArea className="h-screen">{children}</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
};

export default Sidebar;
