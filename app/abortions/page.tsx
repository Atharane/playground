"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Abortions = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [networkStatus, setNetworkStatus] = useState(true);
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const controller = new AbortController();

		// mouse position listener
		window.addEventListener(
			"mousemove",
			(e: MouseEvent) => {
				setMousePosition({ x: e.clientX, y: e.clientY });
			},
			{ signal: controller.signal },
		);

		// network status listener
		window.addEventListener(
			"online",
			() => {
				setNetworkStatus(navigator.onLine);
			},
			{ signal: controller.signal },
		);
		window.addEventListener(
			"offline",
			() => {
				setNetworkStatus(navigator.onLine);
			},
			{ signal: controller.signal },
		);

		// window resize listener
		window.addEventListener(
			"resize",
			() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			},
			{ signal: controller.signal },
		);

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h2 className="text-4xl font-serif italic p-4">
				AbortControllers <span className="not-italic">👼🗡️</span>
			</h2>

			<div className="grid grid-cols-1 gap-4 p-6 bg-muted/40  border-2 border-muted-foreground mt-12">
				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Mouse XY
					</span>
					<code className="font-mono text-sm bg-zinc-950 px-2 py-0.5 min-w-[90px] text-right">
						{mousePosition.x}:{mousePosition.y}
					</code>
				</div>

				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Network
					</span>
					<code
						className={`font-mono text-sm px-2 py-0.5 min-w-[90px] text-center ${networkStatus ? "bg-green-600" : "bg-red-600"}`}
					>
						{networkStatus ? "ONLINE" : "OFFLINE"}
					</code>
				</div>

				<div className="flex items-center justify-between space-x-8 p-3 bg-zinc-800 hover:-translate-y-0.5 transition-transform duration-200">
					<span className="font-mono text-sm uppercase tracking-tight">
						Window
					</span>
					<code className="font-mono text-sm bg-zinc-950 px-2 py-0.5 min-w-[90px] text-right">
						{windowSize.width}×{windowSize.height}
					</code>
				</div>
			</div>

			<Link
				href="https://kettanaito.com/blog/dont-sleep-on-abort-controller"
				target="_blank"
				className="text-sm text-muted-foreground hover:text-muted-foreground/80 hover:underline transition-all duration-200 font-serif italic mt-8"
			>
				read more
			</Link>
		</div>
	);
};

export default Abortions;
