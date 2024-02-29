import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { NAVBAR } from "@/config/navbar";
import { SOCIALS } from "@/config/marketing";
import { buttonVariants } from "../ui/button";

const Footer = () => (
	<footer className="container py-16">
		<div className="flex flex-row justify-between py-8">
			<Logo />
			<div className="flex flex-row gap-4">
				{NAVBAR.map(({ href, title }) => (
					<Link
						key={`nav-${href}-title-${title}`}
						className="hover:text-foreground/80 text-foreground/60 flex items-center text-lg font-medium transition-colors sm:text-xs"
						href={href}
					>
						{title.toUpperCase()}
					</Link>
				))}
			</div>
		</div>
		<div className="flex flex-row items-center justify-between border p-8">
			<p>Copyright &copy; {new Date().getFullYear()} ANPR</p>
			<div className="flex flex-row  gap-4">
				{SOCIALS.map(({ href, icon }) => {
					const Icon = icon;
					return (
						<Link
							key={`nav-${href}`}
							className={buttonVariants({ variant: "secondary", size: "icon" })}
							// className="hover:text-foreground/80 text-foreground/60 flex items-center text-lg font-medium transition-colors sm:text-xs"
							href={href}
						>
							<Icon className="text-xl" />
						</Link>
					);
				})}
			</div>
		</div>
	</footer>
);

export default Footer;