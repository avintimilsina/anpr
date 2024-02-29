import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { extractFirstCharacter } from "../helpers";

interface UserProfileProps {
	displayName?: string | null;
	photoURL?: string | null;
	email?: string | null;
}

const UserProfile = ({ displayName, photoURL, email }: UserProfileProps) => (
	<div className="my-2 flex items-center space-x-4">
		<Avatar>
			<AvatarImage
				src={
					photoURL ??
					`https://api.dicebear.com/7.x/adventurer/svg?seed=${
						displayName ?? email?.split("@")[0]
					}`
				}
			/>
			<AvatarFallback>
				{extractFirstCharacter(displayName ?? email?.split("@")[0] ?? "")}
			</AvatarFallback>
		</Avatar>
		<div>
			<p className="text-sm font-medium leading-none">
				{displayName ?? email?.split("@")[0]}
			</p>
		</div>
	</div>
);

export default UserProfile;
