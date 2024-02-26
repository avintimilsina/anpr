import React, { useRef, useState } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import { toast } from "sonner";
import { getDownloadURL, ref } from "firebase/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { storage } from "../../../firebase";
import { generateId } from "@/lib/nanoid";

interface DropzoneProps {
	onUpload: (url: string) => void;
	className?: string;
	fileExtension?: string;
}

const Dropzone = ({
	onUpload,
	className,
	fileExtension,
	...props
}: DropzoneProps) => {
	const [uploadFile, uploading] = useUploadFile();

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | undefined>();
	const [fileInfo, setFileInfo] = useState<string | null>(null);

	const handleFileChange = (files: FileList) => {
		const uploadedFile = files[0];

		if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
			toast.error(`Invalid file type. Expected: .${fileExtension}`, {
				id: "file-uplaoad",
			});
			return;
		}

		const fileSizeInKB = Math.round(uploadedFile.size / 1024);

		setFile(uploadedFile);

		setFileInfo(`Selected File: ${uploadedFile.name} (${fileSizeInKB} KB)`);
	};

	const upload = async () => {
		toast.loading("Uploading file...", {
			id: "file-uplaoad",
		});
		if (file) {
			const result = await uploadFile(
				ref(storage, `videos/${generateId("VID")}`),
				file
			);
			if (result?.ref) {
				const url = await getDownloadURL(result.ref);

				if (url) {
					onUpload(url);
					toast.success("File uploaded successfully", {
						id: "file-uplaoad",
					});
				} else {
					toast.error("Something went wrong", {
						id: "file-uplaoad",
					});
				}
			} else {
				toast.error("Something went wrong", {
					id: "file-uplaoad",
				});
			}
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const { files } = e.dataTransfer;
		handleFileChange(files);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) {
			handleFileChange(files);
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Card
				className={`bg-muted hover:border-muted-foreground/50 border-2 border-dashed hover:cursor-pointer ${className}`}
				{...props}
			>
				<CardContent
					className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<div className="text-muted-foreground flex items-center justify-center">
						<div className="flex items-center justify-center ">
							<svg
								className="h-20 w-20 fill-current text-gray-300"
								viewBox="0 0 25 25"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g id="SVGRepo_bgCarrier" strokeWidth="0" />
								<g
									id="SVGRepo_tracerCarrier"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<g id="SVGRepo_iconCarrier">
									{" "}
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
										fill=""
									/>{" "}
								</g>
							</svg>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs"
							onClick={handleButtonClick}
						>
							Drag Files to Upload or Click Here
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept={`.${fileExtension}`}
							onChange={handleFileInputChange}
							className="hidden"
							multiple
						/>
					</div>
					{uploading
						? "Uploading..."
						: fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
				</CardContent>
			</Card>
			<Button className="w-full" onClick={upload} type="button">
				Upload file
			</Button>
		</div>
	);
};

export default Dropzone;
