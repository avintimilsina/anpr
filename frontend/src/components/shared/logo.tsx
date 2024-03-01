import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
	<Link className={cn("hidden items-end  md:flex ", className)} href="/">
		<svg
			className="text-primary"
			width="48"
			height="48"
			viewBox="0 0 181 248"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M93.5561 164.659C90.5906 164.659 88.0722 163.906 86.001 162.399C83.8357 160.893 81.2467 158.751 78.2341 155.974C75.2686 153.244 71.9264 149.855 68.2077 145.806C66.8426 144.206 66.1601 142.77 66.1601 141.499C66.1601 140.275 66.8426 138.84 68.2077 137.192C75.3627 129.143 81.8587 123.235 87.6956 119.469C89.1078 118.528 91.0613 118.057 93.5561 118.057C101.37 118.057 108.125 115.139 113.821 109.302C119.516 103.418 122.247 93.9327 122.011 80.8466C121.917 66.7249 118.434 56.8397 111.561 51.1911C104.736 45.5424 95.4155 42.7181 83.6003 42.7181H75.3392C67.7135 42.7181 62.5355 44.3421 59.8053 47.59C57.0281 50.791 55.6394 56.2984 55.6394 64.1124V238.092C55.6394 241.528 54.9333 243.905 53.5212 245.223C52.0619 246.541 49.6142 247.2 46.1779 247.2H9.46153C6.02525 247.2 3.57749 246.541 2.11825 245.223C0.706084 243.905 0 241.528 0 238.092V46.1779C0 34.6923 1.05913 25.5838 3.17738 18.8524C5.29563 12.1682 9.43799 7.34327 15.6045 4.37771C21.7239 1.45923 30.7147 0 42.5769 0H83.6003C116.551 0 140.958 6.47244 156.821 19.4173C172.685 32.3151 180.616 52.109 180.616 78.799C180.616 98.8047 176.45 115.115 168.119 127.731C159.787 140.393 148.984 149.713 135.709 155.692C122.435 161.67 108.384 164.659 93.5561 164.659Z"
				fill="currentColor"
			/>
		</svg>

		<span className="-mb-1 -ml-3 hidden font-sans text-2xl font-bold sm:inline-block">
			arkSathi
		</span>
	</Link>
);

export default Logo;
