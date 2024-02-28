import { FormControl } from "@chakra-ui/react";
import { ActionMeta, AsyncSelect } from "chakra-react-select";
import { collection, query } from "firebase/firestore";
import { useId } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../../firebase";
import { LuLoader2 } from "react-icons/lu";

// ? Search component is used to search for users that are in the database
interface SearchProps {
	onChange:
		| ((newValue: unknown, actionMeta: ActionMeta<unknown>) => void)
		| undefined;
}

const Search = ({ onChange }: SearchProps) => {
	const id = useId();
	// fetches all users from the database
	const [values, loading, error] = useCollectionData(
		query(collection(db, "users")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading) {
		return <LuLoader2 className="animate-spin" />;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	return (
		<FormControl>
			<AsyncSelect
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null,
				}}
				instanceId={id}
				name="Users"
				placeholder="🔍 Search Someone"
				closeMenuOnSelect={false}
				size="lg"
				onChange={onChange}
				loadOptions={(inputValue, callback) => {
					const filteredValues = values
						?.filter((i) =>
							i?.displayName?.toLowerCase()?.includes(inputValue.toLowerCase())
						)
						.map((i) => ({
							label: i?.displayName as string,
							value: i?.uid as string,
						}));
					callback(filteredValues!);
				}}
			/>
		</FormControl>
	);
};

export default Search;
