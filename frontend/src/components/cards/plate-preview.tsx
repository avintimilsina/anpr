import React from "react";

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
	<div className="flex w-full flex-col items-center">
		<div>{vehicleState ?? "Bagmati"} </div>
		<div className="bg-wavy flex h-full flex-row items-center justify-center gap-4 text-black">
			<div className="flex flex-row items-center gap-4">
				<h2 className="text-4xl">{vehicleType ?? "B"}</h2>
				<h2 className="text-4xl">
					{vehicleAgeIdentifier.toLocaleUpperCase() || "DE"}
				</h2>
				<h2 className="text-4xl">{vehicleNumber ?? "1234"}</h2>
			</div>
		</div>
	</div>
);

export default LicensePlatePreview;
