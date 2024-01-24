import ProfileForm from "@/components/forms/profile-form";
import VehicleForm from "@/components/forms/vehicle-form";
import { Separator } from "@/components/ui/separator";

const Profile = () => (
	<div className="m-4 flex-1 space-y-6 lg:max-w-2xl">
		<div>
			<h3 className="text-lg font-medium">Profile</h3>
			<p className="text-muted-foreground text-sm">
				This is how others will see you on the site.
			</p>
		</div>
		<Separator />
		<ProfileForm />
		<VehicleForm />
	</div>
);

export default Profile;
