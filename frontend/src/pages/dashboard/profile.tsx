import ProfileForm from "@/components/forms/profile-form";
import { Separator } from "@/components/ui/separator";
import withProtected from "@/routes/withProtected";

const Profile = () => (
	<div className="m-4 flex-1 space-y-6 lg:max-w-2xl">
		<div>
			<h2 className="text-2xl font-bold tracking-tight">Profile</h2>
			<p className="text-muted-foreground">
				This is how others will see you on the site.
			</p>
		</div>
		<Separator />
		<ProfileForm />
	</div>
);

export default withProtected(Profile);
