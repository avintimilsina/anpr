/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from "react";
import { AiFillInfoCircle, AiFillWarning } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ResultProps {
	type: "success" | "error" | "info" | "warn";
	heading: string;
	text: string;
	dump?: any;
	children?: ReactNode;
}

const ICON = {
	success: BsCheckCircleFill,
	error: MdError,
	info: AiFillInfoCircle,
	warn: AiFillWarning,
};

const VARIANT = {
	success: "default",
	error: "destructive",
	info: "info",
	warn: "warn",
} as const;

const Result = ({ type, heading, text, dump, children }: ResultProps) => {
	const Icon = ICON[type];
	return (
		<Alert variant={VARIANT[type]}>
			<Icon className="h-4 w-4" />
			<AlertTitle>{heading}</AlertTitle>
			<AlertDescription>{text}</AlertDescription>
			<div className="box-border py-4">{children}</div>
			{dump && (
				<div className="flex-grow-1 box-border flex w-full overflow-y-scroll bg-slate-500 p-2 text-left">
					<p>{JSON.stringify(dump, null, 4)}</p>
				</div>
			)}
		</Alert>
	);
};
Result.defaultProps = {
	dump: null,
	children: null,
};

export default Result;
