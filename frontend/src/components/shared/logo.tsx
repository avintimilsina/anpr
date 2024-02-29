import Link from "next/link";
import React from "react";
import { LuFish } from "react-icons/lu";

const Logo = () => (
	<Link className="hidden items-center space-x-2 md:flex" href="/">
		<LuFish />
		<span className="hidden font-mono font-bold sm:inline-block">ANPR</span>
	</Link>
);

export default Logo;
