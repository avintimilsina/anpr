import { type HTMLAttributes, type SyntheticEvent, useState } from "react";
import { LuTrash } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function onSubmit(event: SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					~
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Email
						</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading && <LuTrash className="mr-2 h-4 w-4 animate-spin" />}
						Sign In with Email
					</Button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background text-muted-foreground px-2">
						Or continue with
					</span>
				</div>
			</div>
			<Button variant="outline" type="button" disabled={isLoading}>
				{isLoading ? (
					<LuTrash className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<LuTrash className="mr-2 h-4 w-4" />
				)}{" "}
				GitHub
			</Button>
		</div>
	);
};

export default UserAuthForm;
