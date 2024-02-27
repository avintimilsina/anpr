/* eslint-disable import/prefer-default-export */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Timestamp } from "firebase/firestore";
import { type BadgeProps } from "./ui/badge";

dayjs.extend(relativeTime);

export const calculateParking = (entry: Timestamp, exit?: Timestamp) =>
	Math.ceil(
		Math.abs(
			dayjs(entry?.toMillis()).diff(
				exit?.toMillis() ?? dayjs(Date.now()),
				"minutes"
			)
		) *
			(25 / 60)
	);

export const statusToColor = (status: string): BadgeProps["variant"] => {
	switch (status) {
		case "PENDING":
			return "secondary";
		case "PARKED":
			return "secondary";
		case "VERIFIED":
			return "default";
		case "COMPLETED":
			return "default";
		case "REJECTED":
			return "destructive";
		default:
			return "default";
	}
};
