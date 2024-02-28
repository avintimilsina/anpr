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
];

export const ADMIN_DASHBOARD_NAV_ITEMS_TOP: NavItem[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: "dashboard",
		key: "dashboard",
	},

	{
		title: "Vehicle",
		href: "/admin/vehicle",
		icon: "dashboard",
		key: "vehicle",
	},
	{
		title: "Profile",
		href: "/admin/profile",
		icon: "employee",
		key: "employee",
	},
];

export const ADMIN_DASHBOARD_NAV_ITEMS_BOTTOM: NavItem[] = [
	{
		title: "Login",
		href: "/auth/login",
		icon: "login",
		key: "login",
	},
];

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		key: "dashboard",
	},
	{
		title: "Parking",
		href: "/dashboard/parking",
		key: "parking",
	},
	{
		title: "Vehicles",
		href: "/dashboard/vehicle",
		key: "vehicle",
	},
	{
		title: "Profile",
		href: "/dashboard/profile",
		key: "profile",
	},
];
