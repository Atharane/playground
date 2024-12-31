/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unstableAfter } from "./actions";

export default function Buttons() {
	const [state, setState] = useState("");
	const [data, setData] = useState("");
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="grid grid-cols-3 p-32">
			<h1 className="text-4xl font-bold font-mono underline col-span-3">
				#codeblocks
			</h1>

			<div
				className="relative p-4 border-yellow-400 w-fit border mt-12 border-dashed rounded-xl"
				// onMouseEnter={() => setIsHovered(true)}
				// onMouseLeave={() => setIsHovered(false)}
			>
				<Button
					size="lg"
					data-loading={state === "loading"}
					data-preparing={state === "preparing"}
					className="group relative mx-auto grid transition-all active:scale-95 font-semibold"
				>
					<span className="[grid-area:1/-1] group-data-[loading=true]:invisible group-data-[preparing=true]:invisible">
						Start Action!
					</span>
					<span className="invisible flex items-center justify-center gap-2 [grid-area:1/-1] group-data-[loading=true]:visible">
						Executing Action
					</span>
					<span className="invisible flex items-center justify-center gap-2 [grid-area:1/-1] group-data-[preparing=true]:visible">
						Preparing Action
					</span>
				</Button>

				<div className="border p-2 mt-4 border-dotted w-fit rounded-xl space-x-2">
					<Button
						variant="outline"
						onClick={() => setState("default")}
						className="font-mono"
					>
						default
					</Button>
					<Button
						variant="outline"
						onClick={() => setState("loading")}
						className="font-mono"
					>
						loading
					</Button>
					<Button
						variant="outline"
						onClick={() => setState("preparing")}
						className="font-mono"
					>
						preparing
					</Button>
				</div>

				<AnimatePresence>
					{isHovered && (
						<motion.div
							initial={{ y: -1, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -1, opacity: 0 }}
							className="absolute top-[100%] w-fit -z-10 mt-2 text-secondary font-mono bg-primary backdrop-blur-sm right-0 p-2 text-center text-xs"
						>
							multistate width intelligent button
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div
				className="relative p-4 border-yellow-400 w-fit border mt-12 border-dashed rounded-xl"
				// onMouseEnter={() => setIsHovered(true)}
				// onMouseLeave={() => setIsHovered(false)}
			>
				<Button
					onClick={async () => {
						const data = await unstableAfter();
						setData(data);
					}}
					size="lg"
					className="font-semibold font-mono"
				>
					Invoke `after` function
				</Button>

				<pre>{data}</pre>

				<AnimatePresence>
					{isHovered && (
						<motion.div
							initial={{ y: -1, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -1, opacity: 0 }}
							className="absolute top-[100%] w-fit -z-10 mt-2 text-secondary font-mono bg-primary backdrop-blur-sm right-0 p-2 text-center text-xs"
						>
							next/server unstable_after api
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}