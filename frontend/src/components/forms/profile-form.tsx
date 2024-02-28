"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
	type DocumentData,
	type DocumentReference,
	doc,
	updateDoc,
} from "firebase/firestore";
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
import { auth, db } from "../../../firebase";
import Dropzone from "../shared/dropzone";
import { type User } from "@/db/schema";

const profileFormSchema = z.object({
	displayName: z.string().min(1, {
		message: "Name is required",
	}),
	licenseNumber: z.string().min(1, {
		message: "License number is required",
	}),
	licenseImage: z.string().url(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = () => {
	const router = useRouter();
	const [currentUser] = useAuthState(auth);
	const [updateProfile] = useUpdateProfile(auth);

	const [user] = useDocumentData<User>(
		doc(db, "users", currentUser?.uid ?? "not-found") as DocumentReference<
			User,
			DocumentData
		>,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			displayName: currentUser?.displayName ?? user?.displayName ?? "",
			licenseNumber: user?.licenseNumber ?? "",
			licenseImage: user?.licenseImage ?? "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue("displayName", currentUser?.displayName ?? "");
			form.setValue("licenseNumber", user?.licenseNumber ?? "");
			form.setValue("licenseImage", user?.licenseImage ?? "");
		}
	}, [currentUser, user]);

	const onSubmit = (data: ProfileFormValues) => {
		toast.promise(updateProfile({ displayName: data.displayName }), {
			loading: "Updating profile",
			success: () => {
				router.refresh();
				return "Profile updated";
			},
			error: "Failed to update profile",
		});

		toast.promise(
			updateDoc(doc(db, "users", currentUser?.uid ?? "not-found"), data),
			{
				loading: "Updating profile",
				success: () => {
					router.refresh();
					return "Profile updated";
				},
				error: "Failed to update profile",
			}
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input disabled value={currentUser?.email ?? "Not Logged In"} />
					</FormControl>
					<FormMessage />
				</FormItem>

				<FormField
					control={form.control}
					name="displayName"
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
				{/* <FormField
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder="98XXXXXXXX" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<FormField
					control={form.control}
					name="licenseNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>License Number</FormLabel>
							<FormControl>
								<Input placeholder="XX-XX-XXXXXXX" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="licenseImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>License Card Image</FormLabel>
							<FormControl>
								{field.value ? (
									<div className="flex max-h-[112px] max-w-[112px] flex-row gap-4">
										<Image
											objectFit="cover"
											alt="License Card"
											src={field.value}
											height="112"
											width="112"
										/>
										<div className="flex flex-col justify-center">
											<Button type="button" variant="destructive">
												Delete
											</Button>
										</div>
									</div>
								) : (
									<Dropzone
										folder="license"
										onUpload={field.onChange}
										fileExtension="jpg"
									/>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					disabled={form.formState.isSubmitting || !form.formState.isDirty}
					type="submit"
				>
					Update profile
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
