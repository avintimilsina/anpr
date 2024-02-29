/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState } from "react";
import { LuPlay } from "react-icons/lu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface StepProps {
	label: number;
	text: string;
}

const Step = ({ label, text }: StepProps) => {
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div className="grid h-[500px] place-items-center">
			<div
				className={cn(
					"flex min-h-[400px] w-[250px] flex-col justify-center gap-4 border p-4 py-8 text-2xl font-semibold transition-all ease-out",
					isHovering &&
						"hover:w-[350px] hover:text-3xl hover:shadow-[4px_4px_0_rgb(0,0,0)] hover:dark:shadow-[4px_4px_0_rgb(255,255,255)]"
				)}
				onMouseOver={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<div className="self-start">
					<Button className="aspect-square p-5 text-2xl">{label}</Button>
				</div>
				<h3 className="text-left">{text}</h3>
				<div
					className={cn(
						"grid aspect-square w-[25%] place-items-center border transition-all duration-500 ease-out",
						isHovering && "w-full bg-blue-200"
					)}
				>
					<div className={cn("p-4", isHovering && "border")}>
						<LuPlay />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Step;
