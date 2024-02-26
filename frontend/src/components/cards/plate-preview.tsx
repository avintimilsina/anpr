import React from "react";
import { Rajdhani } from 'next/font/google'
import { text } from "stream/consumers";

const rajdhani = Rajdhani({
	subsets: ["latin"],
	weight: "600"
})

const LicensePlatePreview = ({
	vehicleState,
	vehicleType,
	vehicleAgeIdentifier,
	vehicleNumber,
}: {
	vehicleState: string;
	vehicleType: string;
	vehicleAgeIdentifier: string;
	vehicleNumber: number;
}) => (
	<div className="flex w-full flex-col items-center bg-wavy ">
		<div>{vehicleState ?? "xxxxxx"} </div>
		<div className="bg-wavy flex h-full flex-row items-center justify-center gap-4 text-black">
			<div className={`flex flex-row items-center gap-4 ${rajdhani.className} text-6xl` }>
				<h2>{vehicleType ?? "X"}</h2>
				<h2>
					{vehicleAgeIdentifier.toLocaleUpperCase() || "XX"}
				</h2>
				<h2 >{vehicleNumber ?? "0000"}</h2>
			</div>
		</div>
	</div>
);

export default LicensePlatePreview;
