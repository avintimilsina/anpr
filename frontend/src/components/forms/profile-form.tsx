"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "../../../firebase";

const profileFormSchema = z.object({
	email: z
		.string({
			required_error: "Please select an email to display.",
		})
		.email(),
	name: z.string().min(1, {
		message: "Name is required",
	}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = () => {
	const router = useRouter();
	const [currentUser] = useAuthState(auth);
	const [updateProfile] = useUpdateProfile(auth);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			email: currentUser?.email ?? "",
			name: currentUser?.displayName ?? "",
		},
		mode: "onChange",
	});

	const onSubmit = (data: ProfileFormValues) => {
		toast.promise(updateProfile({ displayName: data.name }), {
			loading: "Updating profile",
			success: () => {
				router.refresh();
				return "Profile updated";
			},
			error: "Failed to update profile",
		});
	};

	useEffect(() => {
		if (currentUser) {
			form.reset({
				email: currentUser?.email ?? "",
				name: currentUser?.displayName ?? "",
			});
		}
	}, [currentUser]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input disabled {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter your name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Update profile</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
