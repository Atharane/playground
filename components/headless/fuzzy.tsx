import Fuse, { type IFuseOptions } from "fuse.js";
import { useState, useMemo } from "react";

const Fuzzy = ({
	// children,
	data,
	render,
	options,
}: {
	children: React.ReactNode;
	data: unknown[];
	render: (details: unknown) => React.ReactNode;
	options: IFuseOptions<unknown>;
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const fuse = useMemo(
		() => new Fuse(data, options),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const results = useMemo(() => {
		if (!searchQuery.trim()) return data;
		const searchResults = fuse.search(searchQuery);
		return searchResults.length > 0
			? searchResults.map((result) => result.item)
			: data;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fuse, searchQuery]);

	return (
		<div className="p-4 border m-6">
			<div className="mb-8">
				<input
					type="text"
					placeholder="nike mercurial superfly"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full mx-auto block px-4 py-2 border border-zinc-300 dark:border-zinc-700 
							 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-none
							 focus:outline-none focus:border-zinc-900 dark:focus:border-white"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{results.map((details) => render(details))}
			</div>
		</div>
	);
};

export default Fuzzy;
