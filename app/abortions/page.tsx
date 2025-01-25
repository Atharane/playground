"use client";

import { useEffect, useState, useRef } from "react";
import { faker } from "@faker-js/faker";
import Link from "next/link";

const Abortions = () => {
	const [flag, setFlag] = useState(true);
	const masterController = useRef(new AbortController());
	const [response, setResponse] = useState<Record<string, unknown>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [delay, setDelay] = useState(1000);
	const [timeout, setTimeout] = useState(1000);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [networkStatus, setNetworkStatus] = useState(true);
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		if (!flag) return;

		const controller = new AbortController();
		const combinedSignal = AbortSignal.any([
			masterController.current.signal,
			controller.signal,
		]);

		window.addEventListener(
			"mousemove",
			(e: MouseEvent) => {
				setMousePosition({ x: e.clientX, y: e.clientY });
			},
			{ signal: combinedSignal },
		);

		window.addEventListener(
			"online",
			() => {
				setNetworkStatus(navigator.onLine);
			},
			{ signal: combinedSignal },
		);
		window.addEventListener(
			"offline",
			() => {
				setNetworkStatus(navigator.onLine);
			},
			{ signal: combinedSignal },
		);

		window.addEventListener(
			"resize",
			() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			},
			{ signal: combinedSignal },
		);

		return () => {
			controller.abort(); // mass abortion
		};
	}, [flag]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-12 dark:text-white text-zinc-900">
			<h2 className="text-4xl font-serif italic p-4">
				AbortControllers <span className="not-italic">👼🗡️</span>
			</h2>
			<div className="grid grid-cols-1 gap-4 p-6 bg-zinc-100 dark:bg-muted/40 border-2 border-zinc-300 dark:border-muted-foreground mt-8">
				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-200 dark:bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Mouse XY
					</span>
					<code className="font-mono text-sm bg-zinc-300 dark:bg-zinc-950 px-2 py-0.5 min-w-[90px] text-right">
						{mousePosition.x}:{mousePosition.y}
					</code>
				</div>

				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-200 dark:bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Network
					</span>
					<code
						className={`font-mono text-sm px-2 py-0.5 min-w-[90px] text-center text-white ${networkStatus ? "bg-green-600" : "bg-red-600"}`}
					>
						{networkStatus ? "ONLINE" : "OFFLINE"}
					</code>
				</div>

				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-200 dark:bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Window
					</span>
					<code className="font-mono text-sm bg-zinc-300 dark:bg-zinc-950 px-2 py-0.5 min-w-[90px] text-right">
						{windowSize.width}×{windowSize.height}
					</code>
				</div>

				<button
					type="button"
					onClick={() => setFlag((previous) => !previous)}
					className="w-full p-3 bg-primary hover:bg-primary/80 text-secondary transition-colors duration-200 font-mono text-sm uppercase tracking-tight"
				>
					Toggle Event Listeners ({flag ? "Active" : "Inactive"})
				</button>

				<button
					type="button"
					disabled={masterController.current.signal.aborted}
					onClick={() => {
						const reason = { message: faker.hacker.phrase() };
						masterController.current.abort(reason);
						setTimeout((previous) => previous + 0.0001); // hack to force render
					}}
					className="w-full p-3 bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 font-mono text-sm uppercase tracking-tight"
				>
					{masterController.current.signal.aborted
						? "Kill Switch Engaged"
						: "Master Kill Switch"}
				</button>

				{masterController.current.signal.aborted && (
					<div className="p-3 bg-zinc-200 dark:bg-zinc-800 text-red-600 dark:text-red-400 font-mono text-sm">
						<span className="uppercase tracking-tight">Abort Reason:</span>
						<p className="mt-1 italic">
							{JSON.stringify(masterController.current.signal.reason)}
						</p>
					</div>
				)}

				<div className="grid grid-cols-2 w-full gap-2">
					<div className="flex flex-col">
						<label
							htmlFor="delay"
							className="font-mono text-sm uppercase tracking-tight mb-1 px-1"
						>
							Delay (ms)
						</label>
						<input
							id="delay"
							type="number"
							value={delay}
							onChange={(e) => setDelay(Number(e.target.value))}
							className="p-3 w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm border-2 border-zinc-300 dark:border-zinc-700"
						/>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="timeout"
							className="font-mono text-sm uppercase tracking-tight mb-1 px-1"
						>
							Timeout (ms)
						</label>
						<input
							id="timeout"
							type="number"
							value={timeout}
							onChange={(e) => setTimeout(Number(e.target.value))}
							className="p-3 w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm border-2 border-zinc-300 dark:border-zinc-700"
						/>
					</div>
				</div>
				<button
					type="button"
					disabled={isLoading}
					onClick={async () => {
						setIsLoading(true);
						try {
							const response = await fetch(`/api/mock?delay=${delay}`, {
								signal: AbortSignal.timeout(timeout),
							});
							setResponse(await response.json());
						} finally {
							setIsLoading(false);
						}
					}}
					className="w-full p-3 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-secondary transition-colors duration-200 font-mono text-sm uppercase tracking-tight"
				>
					{isLoading ? "Loading..." : "Fetch Response"}
				</button>

				{Object.keys(response).length > 0 && (
					<div className="flex flex-col space-y-2 p-3 bg-zinc-200 dark:bg-zinc-800 min-h-[120px] transition-opacity duration-300 relative">
						<span className="font-mono text-sm uppercase tracking-tight mb-2">
							Response Data
						</span>
						<pre
							className={`font-mono text-xs bg-zinc-300 dark:bg-zinc-950 p-3 overflow-x-auto min-w-[300px] transition-opacity duration-300 ${isLoading ? "opacity-30" : ""}`}
						>
							{JSON.stringify(response, null, 2)}
						</pre>
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/20">
								<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
							</div>
						)}
					</div>
				)}
			</div>

			<Link
				href="https://kettanaito.com/blog/dont-sleep-on-abort-controller"
				target="_blank"
				className="text-sm text-zinc-600 dark:text-muted-foreground hover:text-zinc-800 dark:hover:text-muted-foreground/80 hover:underline transition-all duration-200 font-serif italic mt-8"
			>
				read more
			</Link>
		</div>
	);
};

export default Abortions;
