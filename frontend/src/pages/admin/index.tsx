import Dropzone from "@/components/shared/dropzone";

const UploadFile = () => (
	<Dropzone
		onUpload={(url) => console.log("Download URL", url)} // Pass the handler function
		className="your-custom-class" // Optional: Add any custom class
		fileExtension="jpg" // Set the expected file extension
	/>
);

export default UploadFile;
