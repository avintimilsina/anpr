/* eslint-disable import/prefer-default-export */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Timestamp } from "firebase/firestore";

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
