import { type Icon } from "@/components/icons";

export type NavItem = {
	title: string;
	href: string;
	icon?: Icon;
	key: string;
};

export const DASHBOARD_NAV_ITEMS_TOP: NavItem[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: "dashboard",
		key: "dashboard",
	},
	{
		title: "Profile",
		href: "/admin/profile",
		icon: "employee",
		key: "employee",
	},
];

export const DASHBOARD_NAV_ITEMS_BOTTOM: NavItem[] = [
	{
		title: "Login",
		href: "/auth",
		icon: "login",
		key: "login",
	},
];
