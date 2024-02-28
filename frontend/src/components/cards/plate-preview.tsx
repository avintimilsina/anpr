/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { Rajdhani } from "next/font/google";
import Image from "next/image";
import flagsvg from "../../../public/assets/flag.svg";

const rajdhani = Rajdhani({
	subsets: ["latin"],
	weight: "600",
});

const LicensePlatePreview = ({
	vehicleState,
	vehicleType,
	vehicleAgeIdentifier,
	vehicleNumber,
}: {
	vehicleState: string;
	vehicleType: string;
	vehicleAgeIdentifier: string;
	vehicleNumber: string;
}) => (
	<div className="bg-wavy flex w-full flex-col items-center rounded-3xl border-4 border-black  text-black">
		<div className="flex flex-row gap-4">
			<Image alt="Nepal Flag" src={flagsvg} height="100" width="100" />
			<div className="flex flex-col items-center text-3xl">
				<div>{vehicleState ?? "xxxxxx"} </div>
				<div className="flex h-full flex-row items-center justify-center gap-4 text-black">
					<div
						className={`flex flex-row items-center gap-4 ${rajdhani.className} text-8xl`}
					>
						<h2>{vehicleType ?? "X"}</h2>
						<h2>{vehicleAgeIdentifier.toLocaleUpperCase() || "XX"}</h2>
						<h2>{vehicleNumber ?? "0000"}</h2>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default LicensePlatePreview;
