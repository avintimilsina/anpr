
import { LuLoader2 } from "react-icons/lu";

interface PageLoadingSpinnerProps {
	text?: string;
}

const PageLoadingSpinner = ({ text }: PageLoadingSpinnerProps) => (
	<div className="grid h-screen place-items-center">
		<div className=" flex w-full flex-col">
			<LuLoader2 className="animate-spin" />
			{text && process.env.NODE_ENV === "development" && <p>{text}</p>}
		</div>
	</div>
);

PageLoadingSpinner.defaultProps = {
	text: null,
};

export default PageLoadingSpinner;

const NativeLoadingSpinner = () => (
	<div className="grid h-screen place-items-center">
		<svg
			className="spinner"
			width="32px"
			height="32px"
			viewBox="0 0 66 66"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				className="path"
				fill="none"
				strokeWidth="6"
				strokeLinecap="round"
				cx="33"
				cy="33"
				r="30"
			/>
		</svg>
	</div>
);

export { NativeLoadingSpinner };
