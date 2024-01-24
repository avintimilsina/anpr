import { type Icon } from "@/components/icons";

export type NavItem = {
	title: string;
	href: string;
	icon?: Icon;
	key: string;
};

export const NAVBAR: NavItem[] = [
	{
		title: "Home",
		href: "/",
		icon: "menu",
		key: "home",
	},
	{
		title: "Admin",
		href: "/admin",
		icon: "user",
		key: "admin",
	},
];

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
		href: "/auth/login",
		icon: "login",
		key: "login",
	},
];
