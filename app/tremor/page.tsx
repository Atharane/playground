"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AreaChart, Card, Divider } from "@tremor/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const valueFormatter = (number: number) => `${number}px`;

const Abortions = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const mousePositionRef = useRef({ x: 0, y: 0 });
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	// add new state for mouse tracking
	const [mouseTrackData, setMouseTrackData] = useState<
		Array<{
			timestamp: string;
			x: number;
			y: number;
		}>
	>(() => {
		// initialize with points at (0,0)
		return Array.from({ length: 20 }, (_, i) => ({
			timestamp: new Date(Date.now() - (19 - i) * 500).toLocaleTimeString(),
			x: 0,
			y: 0,
		}));
	});

	// throttled mouse position update
	const updateMouseTrackData = useCallback((x: number, y: number) => {
		const now = new Date();
		const timestamp = now.toLocaleTimeString();

		setMouseTrackData((previous) => {
			const updated = [...previous, { timestamp, x, y }];
			if (updated.length > 20) updated.shift(); // keep last 20 positions
			return updated;
		});
	}, []);

	useEffect(() => {
		// initialize window size
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// set up interval for mouse tracking
		const trackingInterval = setInterval(() => {
			updateMouseTrackData(
				mousePositionRef.current.x,
				mousePositionRef.current.y,
			);
		}, 500);

		const handleMouseMove = (e: MouseEvent) => {
			const newPosition = { x: e.clientX, y: e.clientY };
			setMousePosition(newPosition);
			mousePositionRef.current = newPosition;
		};

		// mouse position listener
		window.addEventListener("mousemove", handleMouseMove);

		// window resize listener
		window.addEventListener("resize", handleResize);
		handleResize(); // initialize size

		return () => {
			clearInterval(trackingInterval);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("resize", handleResize);
		};
	}, [updateMouseTrackData]);

	// transform mouse track data for the chart
	const chartData = mouseTrackData.map((point) => ({
		timestamp: point.timestamp,
		"position.x": point.x,
		"position.y": point.y,
	}));

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h2 className="text-4xl font-serif italic p-4">
				Tremor Components <span className="not-italic">〽️</span>
			</h2>

			<Card className="sm:mx-auto sm:max-w-xl border rounded-md">
				<div className="flex items-center space-x-2">
					<h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
						Mouse Movement
					</h3>
					<Badge
						variant="outline"
						className="flex items-center gap-1 border-green-600/40"
					>
						<div className="size-1.5 rounded-sm bg-green-500 animate-pulse" />{" "}
						realtime
					</Badge>
				</div>
				<p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
					X and Y coordinates over time
				</p>
				<Divider className="my-3" />
				<div className="flex items-center gap-10 font-mono">
					{[
						{
							name: "position.x",
							total: mousePosition.x,
							color: "bg-blue-500",
						},
						{
							name: "position.y",
							total: mousePosition.y,
							color: "bg-violet-500",
						},
					].map((category) => (
						<div key={category.name}>
							<div className="flex items-center space-x-2">
								<span
									className={cn(category.color, "size-2.5 rounded-sm")}
									aria-hidden={true}
								/>
								<p className="text-tremor-label dark:text-dark-tremor-content-emphasis text-sm">
									{category.name}
								</p>
							</div>
							<p className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
								{valueFormatter(category.total)}
							</p>
						</div>
					))}
				</div>
				<AreaChart
					data={chartData}
					index="timestamp"
					categories={["position.x", "position.y"]}
					colors={["red", "violet"]}
					valueFormatter={valueFormatter}
					showLegend={false}
					showYAxis={false}
					showGradient={false}
					startEndOnly={true}
					className="mt-8 h-48"
					minValue={0}
					maxValue={Math.max(windowSize.width, windowSize.height)}
				/>
			</Card>
		</div>
	);
};

export default Abortions;
